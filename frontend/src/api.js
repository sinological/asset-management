import axios from 'axios';

/**
 * API 基础地址
 * - 本地开发：VITE_API_BASE=http://localhost:3000
 * - 线上：默认 https://api.szmg.xyz
 */
const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.szmg.xyz';

/**
 * 登录
 */
export async function login(username, password) {
  const r = await axios.post(
    `${API_BASE}/api/auth/login`,
    { username, password }
  );
  return r.data;
}

/**
 * 资产搜索（统一接口）
 * 支持：
 * - q（首页模糊搜索，自编号）
 * - owner / name / model（高级搜索）
 * - page / per_page（分页）
 */
export async function searchAssets(params = {}) {
  const {
    q,
    owner,
    name,
    model,
    page = 1,
    per_page = 20
  } = params;

  const r = await axios.get(`${API_BASE}/api/assets`, {
    params: {
      q,
      owner,
      name,
      model,
      page,
      per_page
    }
  });

  /**
   * 后端返回格式：
   * {
   *   data: [...],
   *   page: 1,
   *   per: 20,
   *   total_pages: N   （如果你已加）
   * }
   */
  return r.data;
}

/**
 * CSV 上传（管理员）
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

