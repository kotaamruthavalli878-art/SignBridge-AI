import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import app from '../server.js';

let server;
let baseUrl;

test.before(async () => {
  process.env.NODE_ENV = 'test';
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

test.after(async () => {
  await new Promise((resolve) => {
    server.close(resolve);
  });
});

const makeRequest = async (path, options = {}) => {
  const url = `${baseUrl}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
};

test('GET /api/health should return ok status and features', async () => {
  const res = await makeRequest('/api/health');
  assert.equal(res.status, 200);
  assert.equal(res.data.status, 'ok');
  assert.ok(Array.isArray(res.data.features));
  assert.ok(res.data.database);
});

test('POST /api/auth/register should register a new user successfully', async () => {
  const testEmail = `test_${Date.now()}@example.com`;
  const res = await makeRequest('/api/auth/register', {
    method: 'POST',
    body: {
      name: 'Priya Sharma',
      email: testEmail,
      password: 'SecurePassword123!',
      preferredLanguage: 'te',
      accessibilityPreferences: {
        fontSize: 'large',
        highContrast: true,
      }
    }
  });

  assert.equal(res.status, 201);
  assert.equal(res.data.success, true);
  assert.ok(res.data.token);
  assert.equal(res.data.user.email, testEmail);
  assert.equal(res.data.user.preferredLanguage, 'te');
  assert.equal(res.data.user.password, undefined); // Password must never be leaked
});

test('POST /api/auth/register should reject duplicate email', async () => {
  const dupEmail = `dup_${Date.now()}@example.com`;
  await makeRequest('/api/auth/register', {
    method: 'POST',
    body: {
      name: 'User One',
      email: dupEmail,
      password: 'password123',
    }
  });

  const res = await makeRequest('/api/auth/register', {
    method: 'POST',
    body: {
      name: 'User Two',
      email: dupEmail,
      password: 'anotherpassword',
    }
  });

  assert.equal(res.status, 409);
  assert.equal(res.data.success, false);
});

test('POST /api/auth/register should fail validation for invalid email or short password', async () => {
  const res = await makeRequest('/api/auth/register', {
    method: 'POST',
    body: {
      name: 'A',
      email: 'not-an-email',
      password: '123',
    }
  });

  assert.equal(res.status, 400);
  assert.equal(res.data.success, false);
});

test('POST /api/auth/login and authenticated routes workflow', async () => {
  const email = `login_${Date.now()}@example.com`;
  const password = 'mySecretPassword456';

  // 1. Register
  await makeRequest('/api/auth/register', {
    method: 'POST',
    body: { name: 'Arun Kumar', email, password }
  });

  // 2. Login with wrong password
  const badLogin = await makeRequest('/api/auth/login', {
    method: 'POST',
    body: { email, password: 'wrongPassword' }
  });
  assert.equal(badLogin.status, 401);

  // 3. Login with correct password
  const goodLogin = await makeRequest('/api/auth/login', {
    method: 'POST',
    body: { email, password }
  });
  assert.equal(goodLogin.status, 200);
  assert.ok(goodLogin.data.token);

  const token = goodLogin.data.token;

  // 4. Protected route GET /api/auth/me with Bearer token
  const meRes = await makeRequest('/api/auth/me', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  });
  assert.equal(meRes.status, 200);
  assert.equal(meRes.data.user.email, email);

  // 5. Protected route without token
  const noAuthRes = await makeRequest('/api/auth/me', { method: 'GET' });
  assert.equal(noAuthRes.status, 401);

  // 6. Update preferences
  const prefRes = await makeRequest('/api/auth/preferences', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: {
      fontSize: 'xlarge',
      highContrast: true,
      reducedMotion: true,
      preferredLanguage: 'te'
    }
  });
  assert.equal(prefRes.status, 200);
  assert.equal(prefRes.data.user.accessibilityPreferences.fontSize, 'xlarge');
});

test('GET /api/signs and /api/signs/categories should return verified sign library', async () => {
  const signsRes = await makeRequest('/api/signs');
  assert.equal(signsRes.status, 200);
  assert.ok(Array.isArray(signsRes.data.signs));
  assert.ok(signsRes.data.signs.length >= 10);

  const categoriesRes = await makeRequest('/api/signs/categories');
  assert.equal(categoriesRes.status, 200);
  assert.ok(Array.isArray(categoriesRes.data.categories));
  assert.ok(categoriesRes.data.categories.some(c => c.id === 'healthcare'));
});

test('POST /api/ai/simplify should return simplified text or safe fallback', async () => {
  const res = await makeRequest('/api/ai/simplify', {
    method: 'POST',
    body: {
      text: 'The patient presents with acute bilateral cephalalgia and mild labyrinthine disequilibrium.'
    }
  });

  assert.equal(res.status, 200);
  assert.ok(res.data.text);
  assert.ok(typeof res.data.isAiGenerated === 'boolean');
});
