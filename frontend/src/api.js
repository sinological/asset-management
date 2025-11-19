import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export async function login(username, password) {
  const r = await axios.post(`${API_BASE}/api/auth/login`, { username, password });
  return r.data;
}
export async function getAsset(asset_no) {
  const r = await axios.get(`${API_BASE}/api/assets/${encodeURIComponent(asset_no)}`);
  return r.data;
}
export async function searchAssets(q, page=1, per_page=50) {
  const r = await axios.get(`${API_BASE}/api/assets`, { params: { q, page, per_page }});
  return r.data;
}
export async function uploadCsv(file, token, strategy='upsert') {
  const fd = new FormData(); fd.append('file', file);
  const r = await axios.post(`${API_BASE}/api/admin/assets/import?strategy=${strategy}`, fd, { headers: { Authorization: 'Bearer ' + token }, timeout: 0 });
  return r.data;
}
