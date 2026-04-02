import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { registerBoardHandlers } from './sockets/boardHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST"]
}));

// Standard Health Check Route
app.get('/health', (req, res) => {
  res.status(200).send('Server is running');
});

// Create HTTP Server and attach Socket.io
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"]
  }
});

// Initialize Socket Handlers
const onConnection = (socket) => {
  console.log(`User connected: ${socket.id}`);
  registerBoardHandlers(io, socket);
  
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
};

io.on('connection', onConnection);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
