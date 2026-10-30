import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { connectDB } from '../src/config/db.js';
import mongoose from 'mongoose';

describe('Authentication & Authorization Tests', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    // Keep connection or clean test fixtures if needed
  });

  it('should register a new farmer successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Farmer Karan',
        email: `karan_${Date.now()}@testfarmer.org`,
        password: 'Password@123',
        state: 'Punjab',
        district: 'Ludhiana',
        village: 'Raikot'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.role).toBe('farmer');
  });

  it('should reject registration with missing required fields', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Incomplete User'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should authenticate seeded farmer and return JWT token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        identifier: 'farmer@mittimitra.org',
        password: 'Farmer@123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('farmer@mittimitra.org');
  });

  it('should reject login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        identifier: 'farmer@mittimitra.org',
        password: 'WrongPassword'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should protect private routes from unauthenticated requests', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should deny a regular farmer access to admin-only metrics', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        identifier: 'farmer@mittimitra.org',
        password: 'Farmer@123'
      });

    const token = loginRes.body.token;

    const adminRes = await request(app)
      .get('/api/admin/metrics')
      .set('Authorization', 'Bearer ' + token)

    expect(adminRes.statusCode).toBe(403);
    expect(adminRes.body.success).toBe(false);
  });

  it('should allow admin user access to admin metrics', async () => {
    const adminLoginRes = await request(app)
      .post('/api/auth/login')
      .send({
        identifier: 'admin@mittimitra.org',
        password: 'Admin@123'
      });

    const adminToken = adminLoginRes.body.token;

    const metricsRes = await request(app)
      .get('/api/admin/metrics')
      .set('Authorization', 'Bearer ' + adminToken)

    expect(metricsRes.statusCode).toBe(200);
    expect(metricsRes.body.success).toBe(true);
    expect(metricsRes.body.metrics.totalUsers).toBeGreaterThan(0);
  });
});

