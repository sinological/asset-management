require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const assetsRoutes = require('./routes/assets');
const adminRoutes = require('./routes/admin');

const app = express();

// CORS 配置，允许前端域名请求
app.use(cors({
  origin: [
  'https://szmg.xyz',
  'https://api.szmg.xyz'
  ],
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/assets', assetsRoutes);
app.use('/api/admin', adminRoutes);

app.get('/health', (req,res)=> res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';  // ✅ 关键修改

app.listen(PORT, HOST, ()=> console.log(`Backend listening on ${HOST}:${PORT}`));

