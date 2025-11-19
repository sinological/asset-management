const express = require('express');
const pool = require('../db');
const router = express.Router();

// GET single by asset_no
router.get('/:asset_no', async (req,res) => {
  const { asset_no } = req.params;
  const r = await pool.query('SELECT * FROM assets WHERE asset_no = $1 LIMIT 1', [asset_no]);
  if (r.rows.length === 0) return res.status(404).json({ error: 'not found' });
  res.json(r.rows[0]);
});

// SEARCH with ?q=keyword & page & per_page
router.get('/', async (req,res) => {
  const q = req.query.q ? `%${req.query.q}%` : '%';
  const page = parseInt(req.query.page || '1', 10);
  const per = parseInt(req.query.per_page || '50', 10);
  const offset = (page - 1) * per;
  const sql = `SELECT * FROM assets WHERE name ILIKE $1 OR owner ILIKE $1 OR department ILIKE $1 ORDER BY id LIMIT $2 OFFSET $3`;
  const r = await pool.query(sql, [q, per, offset]);
  res.json({ data: r.rows, page, per });
});

module.exports = router;
