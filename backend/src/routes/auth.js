const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const router = express.Router();

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS_HASH = process.env.ADMIN_PASS_HASH || ''; // set bcrypt hash in .env

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (username !== ADMIN_USER) return res.status(401).json({ error: 'no such user' });
  if (!ADMIN_PASS_HASH) return res.status(500).json({ error: 'admin password not configured' });
  const ok = await bcrypt.compare(password, ADMIN_PASS_HASH);
  if (!ok) return res.status(401).json({ error: 'invalid credentials' });
  const token = jwt.sign({ username, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token });
});

module.exports = router;
