const express = require('express');
const pool = require('../db');
const router = express.Router();

// GET single by asset_no (exact match)
router.get('/:asset_no', async (req,res) => {
  const { asset_no } = req.params;
  const r = await pool.query('SELECT * FROM assets WHERE asset_no = $1 LIMIT 1', [asset_no]);
  if (r.rows.length === 0) return res.status(404).json({ error: 'not found' });
  res.json(r.rows[0]);
});

// SEARCH: supports ?owner=&name=&model=&q=&page=
router.get('/', async (req,res) => {
  const { owner, name, model, q } = req.query;
  const page = parseInt(req.query.page || '1', 10);
  const per = parseInt(req.query.per_page || '50', 10);
  const offset = (page - 1) * per;

  let conditions = [];
  let values = [];
  let idx = 1;

  // multi-field fuzzy
  if (owner) {
    conditions.push(`owner ILIKE $${idx++}`);
    values.push(`%${owner}%`);
  }
  if (name) {
    conditions.push(`name ILIKE $${idx++}`);
    values.push(`%${name}%`);
  }
  if (model) {
    conditions.push(`model ILIKE $${idx++}`);
    values.push(`%${model}%`);
  }

  // fallback combined fuzzy q
  if (q) {
    conditions.push(`(
      owner ILIKE $${idx} OR
      name ILIKE $${idx} OR
      department ILIKE $${idx}
    )`);
    values.push(`%${q}%`);
    idx++;
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const sql = `
    SELECT * FROM assets
    ${where}
    ORDER BY id
    LIMIT ${per} OFFSET ${offset}
  `;

  const r = await pool.query(sql, values);
  res.json({ data: r.rows, page, per });
});

module.exports = router;

