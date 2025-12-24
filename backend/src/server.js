// backend/src/server.js
require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const path = require('path');
const client = require("prom-client");

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const usersRoutes = require('./routes/users'); 
const roomsRoutes = require('./routes/rooms'); 
const socketHandlers = require('./sockets');

const app = express();

// 1. UPDATE HELMET: Allow resources from same origin (needed for images/scripts)
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// --- API ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/rooms', roomsRoutes);
app.use("/api/dms", require("./routes/dms"));

// Serve uploads folder
app.use('/uploads', express.static(path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads')));


// ==========================================
//  DEPLOYMENT LOGIC (ADD THIS SECTION)
// ==========================================
// Only serve static files if we are in production (or if you want to test build locally)
if (process.env.NODE_ENV === 'production') {
  
  // 1. Point to your React Build folder
  // Adjust the path if your build folder is named 'build' or located elsewhere
  // Assuming structure: root/backend/src/server.js  -> root/frontend/dist
  const buildPath = path.join(__dirname, '../../frontend/dist');
  
  app.use(express.static(buildPath));

  // 2. Catch-All Handler: Send index.html for any unknown route
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}
// ==========================================


const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL, methods: ['GET','POST'], credentials: true },
});

socketHandlers(io);

const PORT = process.env.PORT || 5000;
connectDB(process.env.MONGO_URI)
  .then(() => server.listen(PORT, () => console.log(`Backend + sockets listening on ${PORT}`)))
  .catch(err => { console.error('DB connect failed', err); process.exit(1); });


client.collectDefaultMetrics();

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});