import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { connectDB } from '../src/config/db.js';

describe('Soil Reports & Scientific Safeguards Tests', () => {
  let farmerToken;
  let secondUserToken;
  let createdReportId;

  beforeAll(async () => {
    await connectDB();

    const fRes = await request(app)
      .post('/api/auth/login')
      .send({ identifier: 'farmer@mittimitra.org', password: 'Farmer@123' });
    farmerToken = fRes.body.token;

    const sRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Second Farmer',
        email: `second_${Date.now()}@test.org`,
        password: 'Password@123',
        state: 'Haryana',
        district: 'Karnal'
      });
    secondUserToken = sRes.body.token;
  });

  it('should create a soil health report with lab measurements', async () => {
    const res = await request(app)
      .post('/api/soil/analyze')
      .set('Authorization', 'Bearer ' + farmerToken)
      .send({
        farmLocation: 'Khed Shivapur East',
        knownSoilType: 'Black',
        ph: 7.1,
        nitrogen: 220,
        phosphorus: 14,
        potassium: 290,
        organicCarbon: 0.58
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.report.isLabTested).toBe(true);
    expect(res.body.report.soilHealthStatus.nRating).toContain('Low');
    expect(res.body.report.recommendations.length).toBeGreaterThan(0);
    createdReportId = res.body.report._id;
  });

  it('should retrieve my soil reports', async () => {
    const res = await request(app)
      .get('/api/soil/reports')
      .set('Authorization', 'Bearer ' + farmerToken)

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.reports)).toBe(true);
    expect(res.body.reports.length).toBeGreaterThan(0);
  });

  it('should prevent another user from accessing a private soil report', async () => {
    const res = await request(app)
      .get(`/api/soil/reports/${createdReportId}`)
      .set('Authorization', 'Bearer ' + secondUserToken)

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('should allow report owner to delete their soil report', async () => {
    const res = await request(app)
      .delete(`/api/soil/reports/${createdReportId}`)
      .set('Authorization', 'Bearer ' + farmerToken)

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

