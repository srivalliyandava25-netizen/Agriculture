import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mittimitra',
  jwtSecret: process.env.JWT_SECRET || 'mittimitra_super_secret_jwt_key_2026_agro_safe_token',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    isConfigured: Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY)
  },
  weatherApiKey: process.env.WEATHER_API_KEY || '',
  marketDataApiKey: process.env.MARKET_DATA_API_KEY || '',
  aiServiceApiKey: process.env.AI_SERVICE_API_KEY || ''
};

