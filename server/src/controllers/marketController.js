import { getMarketPrices, calculateTransportEconomics } from '../services/marketService.js';

export const getPrices = async (req, res, next) => {
  try {
    const { state, district, commodity, marketName, dateFrom, dateTo, page, limit, verifiedOnly } = req.query;
    const result = await getMarketPrices({
      state,
      district,
      commodity,
      marketName,
      dateFrom,
      dateTo,
      page,
      limit,
      verifiedOnly
    });

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

export const getTransportCalculation = async (req, res, next) => {
  try {
    const { distanceKm, produceQuantityQuintals, localMandiPrice, distantMandiPrice } = req.body;

    const values = {
      distanceKm: Number(distanceKm),
      produceQuantityQuintals: Number(produceQuantityQuintals),
      localMandiPrice: Number(localMandiPrice),
      distantMandiPrice: Number(distantMandiPrice)
    };
    if (Object.values(values).some((value) => !Number.isFinite(value)) || values.distanceKm < 0 || values.produceQuantityQuintals <= 0 || values.localMandiPrice < 0 || values.distantMandiPrice < 0) {
      return res.status(400).json({
        success: false,
        message: 'Enter valid distance, quantity, and mandi prices.'
      });
    }

    const economics = calculateTransportEconomics(values);

    res.status(200).json({
      success: true,
      economics
    });
  } catch (error) {
    next(error);
  }
};

