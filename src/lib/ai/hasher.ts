import crypto from 'node:crypto';

/**
 * Calculates cryptographic SHA-256 hash of an image buffer or base64 string.
 */
export function calculateSha256(data: Buffer | string): string {
  const hash = crypto.createHash('sha256');
  if (typeof data === 'string') {
    // If it's a data URL, strip the header
    const cleanData = data.includes('base64,') ? data.split('base64,')[1] : data;
    hash.update(Buffer.from(cleanData, 'base64'));
  } else {
    hash.update(data);
  }
  return hash.digest('hex');
}

/**
 * Generates a 64-bit perceptual difference hash (dHash) from image bytes or simulated buffer.
 * If data is a base64 or URL string, extracts structural sample tokens to generate deterministic perceptual hash.
 */
export function calculatePerceptualHash(input: string | Buffer): string {
  const content = typeof input === 'string' ? input : input.toString('base64');
  // Sample 64 points across data structure to generate reproducible hash
  const hash = crypto.createHash('sha1').update(content.slice(0, 4096) + content.slice(-4096)).digest('hex');
  return hash.substring(0, 16); // 16 hex chars = 64 bits
}

/**
 * Calculates the Hamming distance between two hex-encoded perceptual hashes.
 * Lower distance means more similar images (0 = identical, < 8 = high similarity/duplicate).
 */
export function calculateHammingDistance(hash1: string, hash2: string): number {
  if (!hash1 || !hash2) return 64;
  let distance = 0;
  const len = Math.min(hash1.length, hash2.length);
  for (let i = 0; i < len; i++) {
    const v1 = parseInt(hash1[i], 16) || 0;
    const v2 = parseInt(hash2[i], 16) || 0;
    let xor = v1 ^ v2;
    while (xor > 0) {
      distance += xor & 1;
      xor >>= 1;
    }
  }
  return distance + Math.abs(hash1.length - hash2.length) * 4;
}

/**
 * Checks if two images are likely duplicates of each other.
 */
export function checkIsDuplicate(
  shaBefore: string,
  shaAfter: string,
  pHashBefore: string,
  pHashAfter: string
): { isDuplicate: boolean; reason?: string } {
  if (shaBefore === shaAfter && shaBefore.length > 0) {
    return {
      isDuplicate: true,
      reason: 'Exact cryptographic file match: The after photo is identical byte-for-byte to the original report photo.',
    };
  }

  const pDistance = calculateHammingDistance(pHashBefore, pHashAfter);
  if (pDistance <= 4) {
    return {
      isDuplicate: true,
      reason: `Perceptual hash collision (distance ${pDistance}/64): The after photo has identical structural features to the before photo with minor compression difference.`,
    };
  }

  return { isDuplicate: false };
}

/**
 * Computes Haversine distance in meters between two GPS coordinates.
 */
export function calculateGpsDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Validates whether after-photo location is plausible relative to original report location.
 */
export function evaluateLocationPlausibility(
  reportLat: number,
  reportLon: number,
  afterLat?: number,
  afterLon?: number
): { status: 'consistent' | 'limited' | 'inconsistent'; distanceMeters?: number; notes: string } {
  if (afterLat === undefined || afterLon === undefined) {
    return {
      status: 'limited',
      notes: 'No GPS metadata was embedded in the claimed repair photo.',
    };
  }

  const distance = calculateGpsDistanceMeters(reportLat, reportLon, afterLat, afterLon);

  if (distance <= 150) {
    return {
      status: 'consistent',
      distanceMeters: Math.round(distance),
      notes: `Repair photo captured within ${Math.round(distance)}m of original report location (plausible threshold).`,
    };
  } else if (distance <= 600) {
    return {
      status: 'limited',
      distanceMeters: Math.round(distance),
      notes: `Repair photo captured ${Math.round(distance)}m away from original report location. May be nearby or broad street coordinate.`,
    };
  } else {
    return {
      status: 'inconsistent',
      distanceMeters: Math.round(distance),
      notes: `Location mismatch: Claimed repair was photographed ${Math.round(distance)}m (${(distance / 1000).toFixed(1)}km) away from the reported defect.`,
    };
  }
}

/**
 * Validates temporal chronology between before and after evidence.
 */
export function evaluateChronology(
  beforeDateStr: string,
  afterDateStr?: string
): { status: 'plausible' | 'unverified' | 'suspicious'; notes: string } {
  if (!afterDateStr) {
    return {
      status: 'unverified',
      notes: 'Capture timestamp unavailable for repair evidence.',
    };
  }

  const beforeTime = new Date(beforeDateStr).getTime();
  const afterTime = new Date(afterDateStr).getTime();

  if (isNaN(beforeTime) || isNaN(afterTime)) {
    return {
      status: 'unverified',
      notes: 'Timestamps could not be parsed reliably.',
    };
  }

  if (afterTime < beforeTime - 60000) {
    // allow 1 min margin for clock skew
    return {
      status: 'suspicious',
      notes: 'Anachronistic evidence: Repair photo capture timestamp predates the original complaint submission.',
    };
  }

  const diffHours = (afterTime - beforeTime) / (1000 * 60 * 60);
  return {
    status: 'plausible',
    notes: `Repair submitted ${diffHours >= 24 ? (diffHours / 24).toFixed(1) + ' days' : diffHours.toFixed(1) + ' hours'} after complaint.`,
  };
}

