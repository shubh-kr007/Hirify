import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
// Optional: Add token automatically (interceptor)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = token;
  }
  return req;
});

export default API;