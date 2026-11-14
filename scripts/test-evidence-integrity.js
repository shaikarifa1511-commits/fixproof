const crypto = require('node:crypto');

console.log('=== FIXPROOF EVIDENCE INTEGRITY & ANTI-FRAUD TEST SUITE ===\n');

let passed = 0;
let total = 0;

function assert(condition, testName) {
  total++;
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passed++;
  } else {
    console.error(`[FAIL] ${testName}`);
  }
}

// 1. Magic Byte Sniffing
function validateMagicBytes(buffer) {
  if (buffer.length < 12) return { valid: false, error: 'File too small' };

  // JPEG
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, mimeType: 'image/jpeg', ext: '.jpg' };
  }

  // PNG
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { valid: true, mimeType: 'image/png', ext: '.png' };
  }

  // WebP
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return { valid: true, mimeType: 'image/webp', ext: '.webp' };
  }

  return { valid: false, error: 'Unsupported file type. Only genuine JPEG, PNG, and WebP images are allowed.' };
}

// Test legitimate JPEG buffer
const validJpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01]);
assert(validateMagicBytes(validJpeg).valid === true, 'Magic-byte validation accepts genuine JPEG');

// Test legitimate PNG buffer
const validPng = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d]);
assert(validateMagicBytes(validPng).valid === true, 'Magic-byte validation accepts genuine PNG');

// Test malicious fake script named "photo.jpg"
const fakeJpeg = Buffer.from('<?php echo "malicious exploit"; ?>');
assert(validateMagicBytes(fakeJpeg).valid === false, 'Magic-byte validation rejects fake image with PHP/HTML script header');

// 2. Cryptographic SHA-256 Fingerprinting
const testImageBytes = Buffer.from('CIVIC_EVIDENCE_SAMPLE_PHOTO_DATA_2026');
const sha256Hash = crypto.createHash('sha256').update(testImageBytes).digest('hex');
assert(sha256Hash.length === 64, `SHA-256 fingerprint generated with 64 hex chars (${sha256Hash.substring(0, 16)}...)`);

// Verify tamper detection
const tamperedImageBytes = Buffer.from('CIVIC_EVIDENCE_SAMPLE_PHOTO_DATA_2027');
const tamperedHash = crypto.createHash('sha256').update(tamperedImageBytes).digest('hex');
assert(sha256Hash !== tamperedHash, 'SHA-256 detects byte alterations (tamper evident)');

// 3. Perceptual dHash Hamming Distance (Duplicate Detection)
function calculateHammingDistance(hashA, hashB) {
  let distance = 0;
  for (let i = 0; i < Math.min(hashA.length, hashB.length); i++) {
    const valA = parseInt(hashA[i], 16);
    const valB = parseInt(hashB[i], 16);
    let xor = valA ^ valB;
    while (xor > 0) {
      distance += xor & 1;
      xor >>= 1;
    }
  }
  return distance;
}

const photoHashA = 'c4e09871ab9011f0';
const photoHashB = 'c4e09871ab9011f0'; // identical
const photoHashC = 'f0e01234ba0922e1'; // different scene

assert(calculateHammingDistance(photoHashA, photoHashB) === 0, 'dHash Hamming distance is 0 for identical duplicate image');
assert(calculateHammingDistance(photoHashA, photoHashC) > 10, 'dHash Hamming distance > 10 for different scenes');

// 4. GPS Haversine Distance
function calculateGpsDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLon = (lon2 - lon1) * rad;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Distance between Indiranagar 100ft Rd and Indiranagar Metro (~50 meters)
const distNearby = calculateGpsDistanceMeters(12.9719, 77.6412, 12.9721, 77.6415);
assert(distNearby < 100, `Haversine correctly calculates nearby coordinates (${distNearby}m < 100m threshold)`);

// Distance between Bengaluru and Whitefield (~15,000 meters)
const distFar = calculateGpsDistanceMeters(12.9719, 77.6412, 12.9698, 77.7499);
assert(distFar > 5000, `Haversine flags distant GPS claim (${distFar}m > 5000m)`);

console.log(`\nEvidence Integrity Test Results: ${passed}/${total} passed.\n`);
if (passed !== total) process.exit(1);

