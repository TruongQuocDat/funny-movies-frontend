import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`,
  timeout: 5000
});

function getToken() {
  return localStorage.getItem('jwtToken');
}

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
