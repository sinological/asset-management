import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.szmg.xyz';

/**
 * 管理员登录
 */
export async function login(username, password) {
  const r = await axios.post(
    `${API_BASE}/api/auth/login`,
    { username, password }
  );
  return r.data;
}

/**
 * 资产搜索（首页 + 高级搜索统一使用）
 * 支持参数：
 *   q, owner, name, model, page, per_page
 */
export async function searchAssets(params = {}) {
  const r = await axios.get(
    `${API_BASE}/api/assets`,
    { params }
  );
  return r.data;
}

/**
 * CSV 导入（管理员）
 */
export async function uploadCsv(file, token, strategy = 'upsert') {
  const fd = new FormData();
  fd.append('file', file);

  const r = await axios.post(
    `${API_BASE}/api/admin/assets/import?strategy=${strategy}`,
    fd,
    {
      headers: {
        Authorization: 'Bearer ' + token
      },
      timeout: 0
    }
  );

  return r.data;
}

