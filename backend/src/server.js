import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

// Configuration & Database
import config from './config/index.js';
import connectDB from './config/db.js';

// Socket Handlers
import { registerBoardHandlers } from './sockets/boardHandler.js';

// REST API Routes
import authRoutes from './routes/authRoutes.js';
import boardRoutes from './routes/boardRoutes.js';

// 1. Initialize Environment & Database
dotenv.config();
connectDB();

const app = express();
const PORT = config.port || 3001;

// 2. HTTP Middleware
// express.json() is critical for parsing the body of POST requests from your React app
app.use(express.json()); 
app.use(cors({
  origin: config.frontendUrl, // http://localhost:5173
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true // Required if you decide to use Cookies for Auth later
}));

// 3. REST API Endpoints
// These handle non-real-time data like User profiles and Board lists
app.get('/health', (req, res) => res.status(200).json({ status: 'ok', message: 'Server is healthy' }));
app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);

// 4. Create the Integrated Server
// Socket.io needs a raw HTTP server to attach its WebSocket handshake
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: config.frontendUrl,
    methods: ["GET", "POST"]
  },
  // Adding a buffer helps prevent "choppy" lines during high-traffic drawing
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
    skipMiddlewares: true,
  }
});

// 5. WebSocket Logic
// This triggers every time a new tab is opened in the browser
io.on('connection', (socket) => {
  console.log(`🟢 New Connection: ${socket.id}`);

  // We pass both 'io' (to broadcast to everyone) and 'socket' (the specific user)
  registerBoardHandlers(io, socket);

  socket.on('error', (err) => {
    console.error(`Socket Error for ${socket.id}:`, err);
  });

  socket.on('disconnect', (reason) => {
    console.log(`🔴 User Disconnected (${socket.id}): ${reason}`);
  });
});

// 6. Start the Engine
httpServer.listen(PORT, () => {
  console.log('-------------------------------------------');
  console.log(`🚀 SYNCBOARD SERVER STARTING...`);
  console.log(`📡 Mode: ${config.nodeEnv}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log(`👉 Accepting Frontend from: ${config.frontendUrl}`);
  console.log('-------------------------------------------');
});
