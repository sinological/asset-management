const express = require('express');
const pool = require('../db');
const router = express.Router();

/**
 * ===============================
 * 1️⃣ 首页搜索 / 模糊搜索（统一入口）
 * GET /api/assets?asset_no=&owner=&name=&model=&q=&page=
 * ===============================
 */
router.get('/', async (req, res) => {
  const {
    asset_no,
    owner,
    name,
    model,
    q
  } = req.query;

  const page = Math.max(parseInt(req.query.page || '1', 10), 1);
  const per = Math.min(parseInt(req.query.per_page || '50', 10), 100);
  const offset = (page - 1) * per;

  let conditions = [];
  let values = [];
  let idx = 1;

  // 自编号模糊（大小写不敏感）
  if (asset_no) {
    conditions.push(`asset_no ILIKE $${idx}`);
    values.push(`%${asset_no}%`);
    idx++;
  }

  // 高级搜索字段
  if (owner) {
    conditions.push(`owner ILIKE $${idx}`);
    values.push(`%${owner}%`);
    idx++;
  }

  if (name) {
    conditions.push(`name ILIKE $${idx}`);
    values.push(`%${name}%`);
    idx++;
  }

  if (model) {
    conditions.push(`model ILIKE $${idx}`);
    values.push(`%${model}%`);
    idx++;
  }

  // 通用模糊搜索 q
  if (q) {
    conditions.push(`(
      asset_no ILIKE $${idx} OR
      name ILIKE $${idx} OR
      owner ILIKE $${idx} OR
      department ILIKE $${idx}
    )`);
    values.push(`%${q}%`);
    idx++;
  }

  const where = conditions.length
    ? `WHERE ${conditions.join(' AND ')}`
    : '';

  const sql = `
    SELECT
      asset_no,
      name,
      model,
      manufacturer,
      serial_number,
      owner,
      department,
      start_date,
      price
    FROM assets
    ${where}
    ORDER BY asset_no
    LIMIT $${idx} OFFSET $${idx + 1}
  `;

  values.push(per, offset);

  try {
    const r = await pool.query(sql, values);
    res.json({
      data: r.rows,
      page,
      per
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'query failed' });
  }
});

/**
 * ===============================
 * 2️⃣ 详情页：精确获取单条
 * GET /api/assets/:asset_no
 * ===============================
 */
router.get('/:asset_no', async (req, res) => {
  const { asset_no } = req.params;

  try {
    const r = await pool.query(
      `
      SELECT
        asset_no,
        name,
        model,
        manufacturer,
        serial_number,
        owner,
        department,
        start_date,
        price
      FROM assets
      WHERE asset_no = $1
      LIMIT 1
      `,
      [asset_no]
    );

    if (r.rows.length === 0) {
      return res.status(404).json({ error: 'not found' });
    }

    res.json(r.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'query failed' });
  }
});

module.exports = router;

