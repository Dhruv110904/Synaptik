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
const usersRoutes = require('./routes/users'); // lightweight search/profile
const roomsRoutes = require('./routes/rooms'); // stubbed (you'll expand)
const socketHandlers = require('./sockets');

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// health
app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/rooms', roomsRoutes);
app.use("/api/dms", require("./routes/dms"));



// serve uploads in dev
app.use('/uploads', express.static(path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads')));

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


  // collect default system metrics (CPU, memory, event loop)
client.collectDefaultMetrics();

// metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});
