// src/services/auth.js
import api, { setToken } from '../api';

export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password });
  if (data?.token) setToken(data.token);
  return data;
}

export async function register(name, email, password) {
  const { data } = await api.post('/auth/register', { name, email, password });
  if (data?.token) setToken(data.token);
  return data;
}

export async function fetchMe() {
  const { data } = await api.get('/me');
  return data;
}
