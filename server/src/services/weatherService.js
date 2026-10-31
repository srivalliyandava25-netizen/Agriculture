import { config } from '../config/env.js';

const weatherCodeDescriptions = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Depositing rime fog', 51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
  61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 71: 'Light snow', 73: 'Snow', 75: 'Heavy snow',
  80: 'Light rain showers', 81: 'Rain showers', 82: 'Heavy rain showers', 95: 'Thunderstorm',
  96: 'Thunderstorm with hail', 99: 'Thunderstorm with heavy hail'
};

const describeWeather = (code) => weatherCodeDescriptions[Number(code)] || 'Variable conditions';

const DISTRICT_ALIASES = {
  sirmaur: ['Nahan', 'Sirmaur', 'Sirmour'],
  sirmour: ['Nahan', 'Sirmaur', 'Sirmour'],
  bellary: ['Ballari'], ballari: ['Ballari', 'Bellary'],
  bangalore: ['Bengaluru'], bengaluru: ['Bengaluru', 'Bangalore'],
  bijapur: ['Vijayapura'], vijayapura: ['Vijayapura', 'Bijapur'],
  gurgaon: ['Gurugram'], gurugram: ['Gurugram', 'Gurgaon'],
  hooghly: ['Hooghly', 'Chinsurah'],
  nayagarh: ['Nayagarh', 'Nayagarh town'],
  solan: ['Solan'], kangra: ['Dharamshala', 'Kangra'],
  shimla: ['Shimla'], mandi: ['Mandi'], kullu: ['Kullu'], una: ['Una'],
};

const STATE_COORDINATES = {
  'Himachal Pradesh': { latitude: 31.1048, longitude: 77.1734, name: 'Shimla' },
  'Andhra Pradesh': { latitude: 16.5062, longitude: 80.6480, name: 'Vijayawada' },
  'Arunachal Pradesh': { latitude: 27.0844, longitude: 93.6053, name: 'Itanagar' },
  Assam: { latitude: 26.1445, longitude: 91.7362, name: 'Guwahati' },
  Bihar: { latitude: 25.5941, longitude: 85.1376, name: 'Patna' },
  Chhattisgarh: { latitude: 21.2514, longitude: 81.6296, name: 'Raipur' },
  Delhi: { latitude: 28.6139, longitude: 77.2090, name: 'Delhi' },
  Goa: { latitude: 15.2993, longitude: 74.1240, name: 'Panaji' },
  Gujarat: { latitude: 23.0225, longitude: 72.5714, name: 'Ahmedabad' },
  Haryana: { latitude: 28.4595, longitude: 77.0266, name: 'Gurugram' },
  Jharkhand: { latitude: 23.3441, longitude: 85.3096, name: 'Ranchi' },
  Karnataka: { latitude: 12.9716, longitude: 77.5946, name: 'Bengaluru' },
  Kerala: { latitude: 8.5241, longitude: 76.9366, name: 'Thiruvananthapuram' },
  'Madhya Pradesh': { latitude: 23.2599, longitude: 77.4126, name: 'Bhopal' },
  Maharashtra: { latitude: 19.0760, longitude: 72.8777, name: 'Mumbai' },
  Odisha: { latitude: 20.2961, longitude: 85.8245, name: 'Bhubaneswar' },
  Punjab: { latitude: 30.7333, longitude: 76.7794, name: 'Chandigarh' },
  Rajasthan: { latitude: 26.9124, longitude: 75.7873, name: 'Jaipur' },
  'Tamil Nadu': { latitude: 13.0827, longitude: 80.2707, name: 'Chennai' },
  Telangana: { latitude: 17.3850, longitude: 78.4867, name: 'Hyderabad' },
  'Uttar Pradesh': { latitude: 26.8467, longitude: 80.9462, name: 'Lucknow' },
  Uttarakhand: { latitude: 30.3165, longitude: 78.0322, name: 'Dehradun' },
  'West Bengal': { latitude: 22.5726, longitude: 88.3639, name: 'Kolkata' },
  Meghalaya: { latitude: 25.5788, longitude: 91.8933, name: 'Shillong' },
  Manipur: { latitude: 24.8170, longitude: 93.9368, name: 'Imphal' },
  Mizoram: { latitude: 23.7271, longitude: 92.7176, name: 'Aizawl' },
  Nagaland: { latitude: 25.6751, longitude: 94.1086, name: 'Kohima' },
  Sikkim: { latitude: 27.3389, longitude: 88.6065, name: 'Gangtok' },
  Tripura: { latitude: 23.8315, longitude: 91.2868, name: 'Agartala' },
  'Andaman and Nicobar Islands': { latitude: 11.7401, longitude: 92.6586, name: 'Port Blair' },
  Chandigarh: { latitude: 30.7333, longitude: 76.7794, name: 'Chandigarh' },
  'Dadra and Nagar Haveli and Daman and Diu': { latitude: 20.3974, longitude: 72.8328, name: 'Daman' },
  'Jammu and Kashmir': { latitude: 34.0837, longitude: 74.7973, name: 'Srinagar' },
  Ladakh: { latitude: 34.1526, longitude: 77.5771, name: 'Leh' },
  Lakshadweep: { latitude: 10.5667, longitude: 72.6417, name: 'Kavaratti' },
  Puducherry: { latitude: 11.9416, longitude: 79.8083, name: 'Puducherry' }
};

const normalizePlace = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const fetchWithTimeout = async (url, timeoutMs = 12000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

export const getWeatherData = async (state = '', district = '') => {
  const apiKey = config.weatherApiKey;
  let location = null;

  try {
    const districtName = district.trim();
    const normalizedDistrict = normalizePlace(districtName);
    const searchNames = [...(DISTRICT_ALIASES[normalizedDistrict] || [districtName]), `${districtName}, ${state}`];

    const indianLocations = [];
    for (const searchName of [...new Set(searchNames)]) {
      const searchDistrict = encodeURIComponent(searchName);
      const locationResponse = await fetchWithTimeout(`https://geocoding-api.open-meteo.com/v1/search?name=${searchDistrict}&count=10&language=en&format=json`);
      if (!locationResponse.ok) continue;
      const locationData = await locationResponse.json();
      indianLocations.push(...(locationData.results || []).filter((item) => item.country_code === 'IN'));
      if (indianLocations.length) break;
    }

    const normalizedState = normalizePlace(state);
    location = indianLocations.find((item) => {
      const admin1 = normalizePlace(item.admin1);
      const admin2 = normalizePlace(item.admin2);
      return admin1.includes(normalizedState) || normalizedState.includes(admin1) || admin2.includes(normalizedDistrict);
    }) || indianLocations.find((item) => normalizePlace(item.admin1).includes(normalizedState)) || indianLocations[0];

    if (!location) {
      const stateEntry = Object.entries(STATE_COORDINATES).find(([stateName]) => normalizePlace(stateName) === normalizedState);
      const stateFallback = stateEntry?.[1] || { latitude: 22.5937, longitude: 78.9629, name: 'India' };
      location = {
        ...stateFallback,
        name: normalizedDistrict ? `${districtName} (${stateFallback.name})` : stateFallback.name
      };
    }

    const weatherResponse = await fetchWithTimeout(`https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&hourly=precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,uv_index_max&timezone=auto&forecast_days=6`);
    if (!weatherResponse.ok) throw new Error('Live weather forecast is unavailable');
    const data = await weatherResponse.json();
    const current = data.current;
    if (!current) throw new Error('Live weather response did not contain current conditions');
    const hourlyTimes = data.hourly?.time || [];
    const hourlyRain = data.hourly?.precipitation_probability || [];
    const currentHour = `${current.time.slice(0, 13)}:00`;
    let currentHourIndex = hourlyTimes.findIndex((time) => time === currentHour);
    if (currentHourIndex < 0) currentHourIndex = hourlyTimes.findIndex((time) => time >= currentHour);
    const rainProbability = hourlyRain[Math.max(0, currentHourIndex)] ?? 0;
    const forecast = (data.daily?.time || []).slice(1).map((date, index) => {
      const dayIndex = index + 1;
      return {
        day: new Date(`${date}T12:00:00`).toLocaleDateString('en-IN', { weekday: 'long' }),
        maxTemp: Math.round(data.daily?.temperature_2m_max?.[dayIndex] ?? current.temperature_2m),
        minTemp: Math.round(data.daily?.temperature_2m_min?.[dayIndex] ?? current.temperature_2m),
        condition: describeWeather(data.daily?.weather_code?.[dayIndex]),
        rainProbability: data.daily?.precipitation_probability_max?.[dayIndex] ?? 0,
        windSpeed: Math.round(data.daily?.wind_speed_10m_max?.[dayIndex] ?? current.wind_speed_10m)
      };
    });

    return formatWeatherResponse({
      state,
      district,
      temperature: Math.round(current.temperature_2m),
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      condition: describeWeather(current.weather_code),
      rainProbability,
      feelsLike: Math.round(current.apparent_temperature),
      uvIndex: data.daily?.uv_index_max?.[0] != null ? Math.round(data.daily.uv_index_max[0]) : null,
      forecast,
      isLiveApi: true,
      dataSource: 'Open-Meteo live forecast (NOAA-derived weather models)',
      locationName: location.name
    });
  } catch (error) {
    console.warn(`[Weather] Open-Meteo lookup failed (${error.message})`);
  }

  if (apiKey) {
    try {
      const query = encodeURIComponent(`${district},${state},IN`);
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=metric`);
      if (response.ok) {
        const data = await response.json();
        return formatWeatherResponse({
          state, district,
          temperature: Math.round(data.main.temp),
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed * 3.6),
          condition: data.weather[0].description,
          rainProbability: 0,
          feelsLike: Math.round(data.main.feels_like),
          isLiveApi: true,
          dataSource: 'OpenWeatherMap live current weather'
        });
      }
    } catch (error) {
      console.warn(`[Weather] OpenWeatherMap fallback failed (${error.message})`);
    }
  }

  throw new Error(`Live weather is temporarily unavailable for ${district}, ${state}. Please try again in a moment.`);
};

const formatWeatherResponse = ({
  state, district, temperature, humidity, windSpeed, condition, rainProbability,
  feelsLike = temperature, uvIndex = null, forecast = null, isLiveApi, dataSource, locationName
}) => {
  // Agricultural advisories generated from meteorological parameters
  const sprayAdvisory =
    rainProbability > 40
      ? 'DO NOT SPRAY: High chance of rainfall (>40%) will wash away foliar chemicals and waste expensive inputs.'
      : windSpeed > 15
      ? `DO NOT SPRAY: Wind speeds of ${windSpeed} km/h will cause severe chemical drift. Spray only during calm early mornings (<10 km/h).`
      : 'FAVORABLE FOR SPRAYING: Calm winds and dry canopy conditions suitable for bio-pesticide or micronutrient application.';

  const irrigationAdvisory =
    rainProbability > 50
      ? 'POSTPONE IRRIGATION: Expected rain showers will replenish root-zone moisture naturally. Conserve groundwater and electricity.'
      : temperature > 34
      ? 'CRITICAL IRRIGATION: High temperature and evapotranspiration. Irrigate early morning or evening to minimize water evaporation loss.'
      : 'NORMAL IRRIGATION: Maintain regular scheduled irrigation cycle according to crop phenological stage.';

  const harvestAdvisory =
    rainProbability > 40
      ? 'Protect open threshed grains and harvested bundles with tarpaulins immediately.'
      : 'Safe window for harvesting, threshing, and sun-drying agricultural produce.';

  const alerts = [];
  if (rainProbability >= 70) {
    alerts.push({ level: 'warning', type: 'Heavy Rain', message: 'Heavy rain may affect the field tomorrow. Check drainage, clear outlets, and delay fertilizer or pesticide spraying.' });
  }
  if (temperature >= 38) {
    alerts.push({ level: 'danger', type: 'Heatwave', message: 'Dangerously hot conditions are expected. Irrigate early morning or evening and provide temporary shade to vulnerable crops.' });
  }
  if (temperature >= 34 && humidity <= 40 && rainProbability <= 15) {
    alerts.push({ level: 'warning', type: 'Drought Risk', message: 'Hot, dry weather may quickly dry out soil. Prioritize conservation irrigation and mulching.' });
  }
  if (windSpeed >= 30) {
    alerts.push({ level: 'warning', type: 'Strong Winds', message: 'Strong winds may damage crops and cause spray drift. Secure young plants, nets, and stored produce.' });
  }

  if (!forecast) {
    forecast = [];
  }

  return {
    state,
    district,
    current: {
      temperature,
      feelsLike,
      humidity,
      windSpeed,
      condition,
      rainProbability,
      uvIndex: uvIndex == null ? 'Unavailable' : uvIndex,
      dewPoint: Math.round(temperature - (100 - humidity) / 5)
    },
    advisories: {
      sprayAdvisory,
      irrigationAdvisory,
      harvestAdvisory
    },
    alerts,
    forecast,
    metadata: {
      isLiveApi,
      dataSource,
      updatedAt: new Date().toISOString()
    }
  };
};

