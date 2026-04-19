import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.warn('⚠️ MONGO_URI is not set; starting server without a database connection.');
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`📡 MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`);
    console.warn('⚠️ Continuing without database connectivity.');
    return false;
  }
};

export default connectDB;
