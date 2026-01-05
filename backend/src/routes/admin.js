// backend/src/routes/admin.js
const express = require('express');
const pool = require('../db');
const multer = require('multer');
const fs = require('fs');
const { parse } = require('@fast-csv/parse'); // CSV 流式解析
const iconv = require('iconv-lite'); // 编码转换
const authMiddleware = require('../middlewares/auth');

// 确保临时目录存在
if (!fs.existsSync('/tmp')) {
  fs.mkdirSync('/tmp', { recursive: true });
}

const upload = multer({ dest: '/tmp' });
const router = express.Router();

// 应用身份验证中间件
router.use(authMiddleware);

// 清空资产表（管理员专用）
router.delete('/assets', async (req, res) => {
  try {
    await pool.query('DELETE FROM assets');
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '删除失败' });
  }
});

// 导入 CSV 文件
router.post('/assets/import', upload.single('file'), async (req, res) => {
  const strategy = req.query.strategy || 'upsert';
  const filePath = req.file.path;

  // ✅ 立即响应客户端 → 防止 Cloudflare 524 超时
  res.json({
    message: 'File received. Import started in background.',
    status: 'processing'
  });

  // 🚀 异步处理导入任务（不阻塞 HTTP 响应）
  processCSV(filePath, strategy).catch((err) => {
    console.error('❌ 后台导入任务异常:', err.stack);
  });
});

// 主函数：流式读取并批量导入 CSV
async function processCSV(filePath, strategy) {
  let client;
  let count = 0;
  let batch = [];

  try {
    // 获取数据库连接
    client = await pool.connect();
    await client.query('BEGIN'); // 开启事务

    // 如果是 replace 模式，先清空数据
    if (strategy === 'replace') {
      await client.query('DELETE FROM assets');
    }

    // 创建流：文件读取 → GBK 解码 → CSV 解析
    const stream = fs.createReadStream(filePath)
      .pipe(iconv.decodeStream('gbk')) // 支持 Windows 记事本保存的 ANSI 文件
      .pipe(parse({ headers: true, skip_empty_lines: true }));

    // 逐行处理
    for await (const row of stream) {
      const assetNo = row['自编号'];
      if (!assetNo) continue; // 忽略无主键行

      // 类型转换
      const price = row['价格'] 
        ? parseFloat(String(row['价格']).replace(/,/g, '')) 
        : null;

      // 收集为批次
      batch.push([
        assetNo,
        row['名称'] || null,
        row['型号'] || null,
        row['厂家'] || null,
        row['序列号'] || null,
        row['责任人'] || null,
        row['所属部门'] || null,
        row['启用日期'] || null,
        price
      ]);

      // 达到 200 条就批量插入一次
      if (batch.length >= 200) {
        await insertBatch(client, batch);
        count += batch.length;
        batch = []; // 清空批次
      }
    }

    // 插入剩余数据
    if (batch.length > 0) {
      await insertBatch(client, batch);
      count += batch.length;
    }

    // 提交事务
    await client.query('COMMIT');
    console.log(`✅ 成功导入 ${count} 条记录`);
  } catch (err) {
    if (client) {
      await client.query('ROLLBACK').catch(console.error); // 回滚
    }
    console.error('❌ 导入失败:', err.stack);
  } finally {
    if (client) {
      client.release(); // 释放连接
    }
    // 删除临时文件
    try {
      fs.unlinkSync(filePath);
    } catch (e) {
      console.warn('⚠️ 无法删除临时文件:', e.message);
    }
  }
}

// 批量插入函数
async function insertBatch(client, rows) {
  const values = [];
  const placeholders = rows.map((_, i) => {
    const base = i * 9; // 每条记录有 9 个字段
    values.push(...rows[i]); // 展开所有值
    return `($${base+1},$${base+2},$${base+3},$${base+4},$${base+5},$${base+6},$${base+7},$${base+8},$${base+9})`;
  }).join(',');

  const sql = `
    INSERT INTO assets (
      asset_no, name, model, manufacturer,
      serial_number, owner, department, start_date, price
    ) VALUES ${placeholders}
    ON CONFLICT (asset_no) DO UPDATE SET
      name = EXCLUDED.name,
      model = EXCLUDED.model,
      manufacturer = EXCLUDED.manufacturer,
      serial_number = EXCLUDED.serial_number,
      owner = EXCLUDED.owner,
      department = EXCLUDED.department,
      start_date = EXCLUDED.start_date,
      price = EXCLUDED.price
  `;

  await client.query(sql, values);
}

module.exports = router;
