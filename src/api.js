// src/api.js
import axios from 'axios';

/** ===== 基本設定 ===== */
export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8090/api';

export const TOKEN_KEY = 'token'; // 唯一正式 key
// 把你過去用過的錯誤/舊 key 都列進來做相容（包含 'TOKEN_KEY'）
export const LEGACY_TOKEN_KEYS = ['auth_token', 'api_token', 'TOKEN_KEY'];

/** 讀/寫/清 Token（統一出入口） */
export function getToken() {
  let token = localStorage.getItem(TOKEN_KEY);
  if (token) return token;
  for (const k of LEGACY_TOKEN_KEYS) {
    const v = localStorage.getItem(k);
    if (v) return v;
  }
  return null;
}

export function setToken(token, { migrate = true } = {}) {
  if (!token) return clearToken();
  localStorage.setItem(TOKEN_KEY, token);
  if (migrate) {
    LEGACY_TOKEN_KEYS.forEach((k) => localStorage.removeItem(k));
  }
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/** ===== Axios 實例 ===== */
const api = axios.create({
  baseURL: API_BASE_URL,
  // withCredentials: true, // 若改 Cookie 驗證再打開
});

const DEBUG = process.env.NODE_ENV === 'development';

/** 請求攔截器：自動帶 Authorization */
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    if (DEBUG) {
      console.debug(
        '[api][request]',
        (config.method || 'GET').toUpperCase(),
        config.url,
        { hasAuth: !!config.headers.Authorization }
      );
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/** 回應攔截器：簡易除錯（不要 clear 全 storage） */
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (DEBUG) {
      console.debug(
        '[api][response error]',
        err?.response?.status,
        err?.response?.data || err.message
      );
    }
    // if (err?.response?.status === 401) clearToken();
    return Promise.reject(err);
  }
);

export default api;
