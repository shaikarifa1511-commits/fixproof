const crypto = require('node:crypto');

console.log('=== FIXPROOF AUTHENTICATION & RBAC TEST SUITE ===\n');

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

const AUTH_SECRET = process.env.AUTH_SECRET || 'fixproof-secure-auth-secret-key-2026';

function createSessionToken(user, ttlSeconds = 3600) {
  const payload = JSON.stringify({
    id: user.id,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  });

  const base64Payload = Buffer.from(payload).toString('base64url');
  const signature = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(base64Payload)
    .digest('base64url');

  return `${base64Payload}.${signature}`;
}

function verifySessionToken(token) {
  try {
    const [base64Payload, signature] = token.split('.');
    if (!base64Payload || !signature) return null;

    const expectedSignature = crypto
      .createHmac('sha256', AUTH_SECRET)
      .update(base64Payload)
      .digest('base64url');

    if (signature !== expectedSignature) return null;

    const payload = JSON.parse(Buffer.from(base64Payload, 'base64url').toString('utf-8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

function checkAuthorization(userRole, allowedRoles) {
  if (!userRole) return { authorized: false, code: 'UNAUTHORIZED' };
  if (allowedRoles.includes(userRole) || allowedRoles.includes('public')) {
    return { authorized: true };
  }
  return { authorized: false, code: 'FORBIDDEN' };
}

// 1. Valid Token Creation & Verification
const user = { id: 'user_cit_1', email: 'aditi@example.com', role: 'citizen' };
const token = createSessionToken(user);
const verified = verifySessionToken(token);
assert(verified && verified.id === user.id && verified.role === 'citizen', 'Session token creation and signature verification');

// 2. Tampered Token Rejection
const tamperedToken = token.substring(0, token.length - 4) + 'abcd';
const verifiedTampered = verifySessionToken(tamperedToken);
assert(verifiedTampered === null, 'Tampered token signature rejection (Anti-tamper HMAC SHA-256)');

// 3. Expired Token Rejection
const expiredToken = createSessionToken(user, -100);
const verifiedExpired = verifySessionToken(expiredToken);
assert(verifiedExpired === null, 'Expired token rejection');

// 4. Role Authorization: Authority submitting claim
assert(checkAuthorization('authority', ['authority', 'admin']).authorized === true, 'Authority permitted to submit repair claim');
assert(checkAuthorization('citizen', ['authority', 'admin']).authorized === false, 'Citizen rejected from submitting authority repair claim');

// 5. Role Authorization: Moderator ruling
assert(checkAuthorization('moderator', ['moderator', 'admin']).authorized === true, 'Moderator permitted to arbitrate dispute');
assert(checkAuthorization('citizen', ['moderator', 'admin']).authorized === false, 'Citizen rejected from arbitrating dispute');

// 6. Role Authorization: Citizen submitting dispute
assert(checkAuthorization('citizen', ['citizen', 'public', 'authority', 'moderator', 'admin']).authorized === true, 'Citizen permitted to file dispute');

console.log(`\nAuth & RBAC Test Results: ${passed}/${total} passed.\n`);
if (passed !== total) process.exit(1);

