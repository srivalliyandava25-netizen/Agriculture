import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { connectDB } from '../src/config/db.js';

describe('Cultivation Expense & Profit Calculator Tests', () => {
  let farmerToken;

  beforeAll(async () => {
    await connectDB();
    const res = await request(app)
      .post('/api/auth/login')
      .send({ identifier: 'farmer@mittimitra.org', password: 'Farmer@123' });
    farmerToken = res.body.token;
  });

  it('should accurately calculate total cost, revenue, net profit, and break-even price', async () => {
    const res = await request(app)
      .post('/api/expenses/calculate')
      .set('Authorization', 'Bearer ' + farmerToken)
      .send({
        cropName: 'Wheat',
        landArea: 2,
        landUnit: 'acres',
        seedsCost: 2000,
        landPrepCost: 3000,
        fertilizersCost: 4000,
        labourCost: 5000,
        irrigationCost: 2000,
        machineryCost: 2500,
        transportCost: 1500,
        otherCost: 500,
        expectedYieldQuantity: 40, // 40 quintals (20 qtl/acre)
        expectedPricePerUnit: 2300, // ₹2,300 per quintal
        saveRecord: true
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const calc = res.body.calculation;
    // Expected Total Cost = 2000+3000+4000+5000+2000+2500+1500+500 = 20,500
    expect(calc.totalCost).toBe(20500);
    expect(calc.costPerUnitArea).toBe(10250); // 20500 / 2 acres
    // Expected Gross Revenue = 40 * 2300 = 92,000
    expect(calc.grossRevenue).toBe(92000);
    // Net Profit = 92,000 - 20,500 = 71,500
    expect(calc.netProfitOrLoss).toBe(71500);
    // Break-even price = 20,500 / 40 = 512.5 -> 513
    expect(calc.breakEvenPrice).toBe(513);
    expect(calc.isProfitable).toBe(true);
  });
});

