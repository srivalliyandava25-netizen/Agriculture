/**
 * Mitti Mitra Agricultural Market Price Service
 * Interfaces with Agmarknet / APMC Mandi database and provides market analytics,
 * price trends, and transport considerations for Indian farmers.
 */

import { MarketPrice } from '../models/MarketPrice.js';

export const getMarketPrices = async ({
  state = '',
  district = '',
  commodity = '',
  marketName = '',
  dateFrom = '',
  dateTo = '',
  verifiedOnly = false,
  limit = 20,
  page = 1
}) => {
  const query = {};
  const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (state) query.state = new RegExp(escapeRegex(state), 'i');
  if (district) query.district = new RegExp(escapeRegex(district), 'i');
  if (commodity) query.commodity = new RegExp(escapeRegex(commodity), 'i');
  if (marketName) query.marketName = new RegExp(escapeRegex(marketName), 'i');
  if (dateFrom || dateTo) {
    query.priceDate = {};
    if (dateFrom && !Number.isNaN(new Date(dateFrom).getTime())) query.priceDate.$gte = new Date(`${dateFrom}T00:00:00.000Z`);
    if (dateTo && !Number.isNaN(new Date(dateTo).getTime())) query.priceDate.$lte = new Date(`${dateTo}T23:59:59.999Z`);
  }
  if (verifiedOnly === true || verifiedOnly === 'true') {
    query.isSampleData = { $ne: true };
    query.priceDate = query.priceDate || {};
    query.priceDate.$gte = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await MarketPrice.countDocuments(query);
  const prices = await MarketPrice.find(query)
    .sort({ priceDate: -1, commodity: 1 })
    .skip(skip)
    .limit(Number(limit));

  return {
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)) || 1,
    prices,
    sellingGuidance: {
      storageAdvice: 'If current local mandi prices are trading below Minimum Support Price (MSP), explore state warehousing receipt financing (WDRA) to avoid distress sales.',
      transportNote: 'Consolidating produce with village Farmer Producer Organizations (FPOs) reduces per-quintal transportation costs by 30-40%.'
    }
  };
};

export const calculateTransportEconomics = ({
  distanceKm = 25,
  produceQuantityQuintals = 20,
  localMandiPrice = 2200,
  distantMandiPrice = 2450
}) => {
  // Estimated truck/trolley rental: Base ₹800 + ₹25 per km
  const totalTransportCost = 800 + distanceKm * 25;
  const transportCostPerQuintal = Math.round(totalTransportCost / produceQuantityQuintals);

  const localGross = produceQuantityQuintals * localMandiPrice;
  const distantGross = produceQuantityQuintals * distantMandiPrice;
  const netGainDistant = distantGross - localGross - totalTransportCost;

  return {
    distanceKm,
    produceQuantityQuintals,
    totalTransportCost,
    transportCostPerQuintal,
    localMandiRevenue: localGross,
    distantMandiRevenue: distantGross,
    netExtraProfitOrLoss: netGainDistant,
    isDistantMandiEconomical: netGainDistant > 0,
    recommendation:
      netGainDistant > 0
        ? `Selling at the distant mandi yields an extra estimated net gain of ₹${netGainDistant.toLocaleString('en-IN')} after transport overheads.`
        : `Selling locally is more economical. The price difference does not justify the ₹${totalTransportCost.toLocaleString('en-IN')} transport freight.`
  };
};

