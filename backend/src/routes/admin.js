const express = require('express');
const pool = require('../db');
const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parse');
const authMiddleware = require('../middlewares/auth');

const upload = multer({ dest: '/tmp' });
const router = express.Router();

router.use(authMiddleware);

router.delete('/assets', async (req,res)=>{
  await pool.query('TRUNCATE assets');
  res.json({ ok:true });
});

// CSV import
router.post('/assets/import', upload.single('file'), async (req,res)=>{
  const strategy = req.query.strategy || 'upsert';
  const filePath = req.file.path;
  const client = await pool.connect();

  let count = 0;

  try {
    await client.query('BEGIN');
    if (strategy === 'replace') await client.query('TRUNCATE assets');

    const parser = fs.createReadStream(filePath).pipe(csv({ columns: true, skip_empty_lines: true }));

    for await (const row of parser) {
      await client.query(`
        INSERT INTO assets (asset_no, name, model, serial_number, purchase_date, location, owner, department, price)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        ON CONFLICT (asset_no) DO UPDATE SET
          name = EXCLUDED.name,
          model = EXCLUDED.model,
          serial_number = EXCLUDED.serial_number,
          purchase_date = EXCLUDED.purchase_date,
          location = EXCLUDED.location,
          owner = EXCLUDED.owner,
          department = EXCLUDED.department,
          price = EXCLUDED.price
      `, [
        row.asset_no, row.name, row.model,
        row.serial_number, row.purchase_date || null,
        row.location, row.owner, row.department, row.price || null
      ]);

      count++;
    }

    await client.query('COMMIT');
    res.json({ ok:true, imported: count });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
    fs.unlinkSync(filePath);
  }
});

module.exports = router;

