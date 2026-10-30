import { getWeatherData } from '../services/weatherService.js';
import { WeatherAlert } from '../models/WeatherAlert.js';

export const getWeather = async (req, res, next) => {
  try {
    const state = String(req.query.state || req.user?.state || '').trim();
    const district = String(req.query.district || req.user?.district || '').trim();

    if (!state || !district) {
      return res.status(400).json({
        success: false,
        message: 'State and district are required for a local weather forecast.'
      });
    }

    const weather = await getWeatherData(state, district);

    // Also look up any active severe alerts in our database
    const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const statePattern = escapeRegex(state);
    const districtPattern = escapeRegex(district);
    const activeAlerts = await WeatherAlert.find({
      $or: [
        { state: new RegExp(statePattern, 'i'), district: new RegExp(districtPattern, 'i') },
        { state: new RegExp(statePattern, 'i'), district: 'All' }
      ],
      validUntil: { $gte: new Date() }
    });

    res.status(200).json({
      success: true,
      weather,
      activeAlerts
    });
  } catch (error) {
    if (error.message?.includes('Live weather is currently unavailable') || error.message?.includes('district')) {
      return res.status(503).json({ success: false, message: error.message });
    }
    next(error);
  }
};

