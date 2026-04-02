import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 3001,
  mongoUri: process.env.MONGO_URI,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_for_dev_only',
  nodeEnv: process.env.NODE_ENV || 'development',
};

// --- SAFETY CHECK ---
// Ensure critical variables exist before the server starts
const requiredKeys = ['MONGO_URI'];

requiredKeys.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`⚠️ WARNING: Configuration key "${key}" is missing in .env`);
  }
});

export default config;
