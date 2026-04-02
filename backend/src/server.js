// src/server.js
import express from 'express';
import { createServer } from 'http';
import config from './config/index.js'; // Import centralized config
import connectDB from './config/db.js'; // Import DB connection

const app = express();

// Connect to Database
connectDB();

// Use the config object instead of process.env directly
const PORT = config.port;

const httpServer = createServer(app);
// ... the rest of your socket logic ...

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running in ${config.nodeEnv} mode at http://localhost:${PORT}`);
});
