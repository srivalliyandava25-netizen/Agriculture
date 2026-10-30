import fs from 'fs';
import mongoose from 'mongoose';

export const connectDB = async () => {
  const socketPath = process.env.MONGODB_SOCKET_PATH || '/tmp/mongodb-27017.sock';
  let uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mittimitra';

  // If local unix domain socket exists, prefer it for sandbox/container stability
  if (fs.existsSync(socketPath)) {
    uri = `mongodb://${encodeURIComponent(socketPath)}/mittimitra`;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`[MongoDB] Connected: ${conn.connection.host || socketPath}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB] Connection via preferred socket failed (${error.message}). Retrying fallback URI...`);
    try {
      const fallbackUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mittimitra';
      const fallbackConn = await mongoose.connect(fallbackUri);
      console.log(`[MongoDB] Connected via fallback: ${fallbackConn.connection.host}`);
      return fallbackConn;
    } catch (fallbackError) {
      console.error(`[MongoDB] Critical Connection Error: ${fallbackError.message}`);
      throw fallbackError;
    }
  }
};

