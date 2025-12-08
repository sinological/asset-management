// backend/routes/admin.js
import express from "express";
import bcrypt from "bcryptjs";
import multer from "multer";
import csvParser from "csv-parser";
import fs from "fs";
import path from "path";
import pkg from "pg";

const { Pool } = pkg;

const router = express.Router();

// PostgreSQL 连接池
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Multer 临时文件目录
const upload = multer({ dest: "/tmp" });

/* ----------------------------
   1. 管理员登录
------------------------------- */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "用户不存在" });
    }

    const user = result.rows[0];

    // 检查密码
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ message: "密码错误" });
    }

    res.json({ message: "登录成功" });
  } catch (err) {
    console.error("登录失败:", err);
    res.status(500).json({ message: "服务器错误" });
  }
});

/* ----------------------------
   2. CSV 上传接口
------------------------------- */
router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "没有上传 CSV 文件" });
  }

  const filePath = req.file.path;

  const rows = [];

  try {
    // 解析 CSV 文件
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on("data", (data) => rows.push(data))
        .on("end", resolve)
        .on("error", reject);
    });

    let inserted = 0;
    let updated = 0;

    // 按行写入数据库
    for (const row of rows) {
      const {
        name,
        model,
        manufacturer,
        serial_number,
        owner,
        department,
        start_date,
        price,
        field10,
        field11,
        field12,
        field13,
        field14,
        field15,
        field16,
        field17,
        field18,
        field19,
        field20,
      } = row;

      // 必须有唯一 serial_number，否则不处理
      if (!serial_number) continue;

      // UPSERT：存在则更新，不存在则插入
      const result = await pool.query(
        `
        INSERT INTO assets (
          name, model, manufacturer, serial_number, owner, department, start_date, price,
          field10, field11, field12, field13, field14, field15,
          field16, field17, field18, field19, field20
        )
        VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,
          $9,$10,$11,$12,$13,$14,
          $15,$16,$17,$18,$19
        )
        ON CONFLICT (serial_number)
        DO UPDATE SET
          name = EXCLUDED.name,
          model = EXCLUDED.model,
          manufacturer = EXCLUDED.manufacturer,
          owner = EXCLUDED.owner,
          department = EXCLUDED.department,
          start_date = EXCLUDED.start_date,
          price = EXCLUDED.price,
          field10 = EXCLUDED.field10,
          field11 = EXCLUDED.field11,
          field12 = EXCLUDED.field12,
          field13 = EXCLUDED.field13,
          field14 = EXCLUDED.field14,
          field15 = EXCLUDED.field15,
          field16 = EXCLUDED.field16,
          field17 = EXCLUDED.field17,
          field18 = EXCLUDED.field18,
          field19 = EXCLUDED.field19,
          field20 = EXCLUDED.field20,
          updated_at = NOW()
        RETURNING *
        `,
        [
          name || null,
          model || null,
          manufacturer || null,
          serial_number,
          owner || null,
          department || null,
          start_date || null,
          price || null,
          field10 || null,
          field11 || null,
          field12 || null,
          field13 || null,
          field14 || null,
          field15 || null,
          field16 || null,
          field17 || null,
          field18 || null,
          field19 || null,
          field20 || null,
        ]
      );

      if (result.command === "INSERT") inserted++;
      else updated++;
    }

    res.json({
      message: `上传成功：插入 ${inserted} 条，更新 ${updated} 条`,
    });
  } catch (err) {
    console.error("CSV 导入失败:", err);
    res.status(500).json({ message: "CSV 导入失败" });
  } finally {
    // 删除临时文件
    fs.unlinkSync(filePath);
  }
});

/* ----------------------------
   3. 默认导出
------------------------------- */
export default router;

