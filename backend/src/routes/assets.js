const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
  const { q, owner, name, model } = req.query;

  const page = Math.max(parseInt(req.query.page || '1', 10), 1);
  const per = Math.min(parseInt(req.query.per_page || '20', 10), 100);
  const offset = (page - 1) * per;

  let conditions = [];
  let values = [];
  let idx = 1;

  if (q) {
    conditions.push(`asset_no ILIKE $${idx++}`);
    values.push(`%${q}%`);
  }
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

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  // 数据查询
  const dataSql = `
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
  const dataValues = [...values, per, offset];

  // 总数查询
  const countSql = `SELECT COUNT(*) FROM assets ${where}`;

  const [dataResult, countResult] = await Promise.all([
    pool.query(dataSql, dataValues),
    pool.query(countSql, values)
  ]);

  const total = parseInt(countResult.rows[0].count, 10);
  const totalPages = Math.ceil(total / per);

  res.json({
    data: dataResult.rows,
    page,
    per,
    total,
    totalPages
  });
});

module.exports = router;

