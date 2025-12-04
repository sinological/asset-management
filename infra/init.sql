-- 表：users - 存储管理员账号
-- ----------------------------
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL
);

-- 插入默认管理员账户（密码已哈希）
INSERT INTO users (username, password_hash)
VALUES ('admin', '$2a$10$x8.1Jo5HKDdSnsQdPtrHjuI6Yt4yUyfA.H2b42H.u4d4eSFsArBxa')
ON CONFLICT (username) DO NOTHING;


-- ----------------------------
-- 表：assets - 资产主表（支持20列，十万行级别）
-- ----------------------------
CREATE TABLE IF NOT EXISTS assets (
  id SERIAL PRIMARY KEY,           -- 自编号（系统自动生成）
  name TEXT,                       -- 名称
  model TEXT,                      -- 型号
  manufacturer TEXT,               -- 厂家
  serial_number TEXT UNIQUE,       -- 序列号（唯一约束）
  owner TEXT,                      -- 责任人
  department TEXT,                 -- 所属部门
  start_date DATE,                 -- 启用日期
  price NUMERIC(10,2),             -- 价格（最多99999999.99）

  -- 预留字段（第10~20列，可用于未来扩展）
  field10 TEXT,
  field11 TEXT,
  field12 TEXT,
  field13 TEXT,
  field14 TEXT,
  field15 TEXT,
  field16 TEXT,
  field17 TEXT,
  field18 TEXT,
  field19 TEXT,
  field20 TEXT,

  -- 时间戳（记录创建和更新时间）
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ----------------------------
-- 索引优化（提升查询性能）
-- ----------------------------
-- 按序列号查找（防重、快速定位）
CREATE INDEX IF NOT EXISTS idx_assets_serial_number ON assets(serial_number);
-- 按部门查找
CREATE INDEX IF NOT EXISTS idx_assets_department ON assets(department);
-- 按责任人查找
CREATE INDEX IF NOT EXISTS idx_assets_owner ON assets(owner);
-- 按启用日期范围查询
CREATE INDEX IF NOT EXISTS idx_assets_start_date ON assets(start_date);
