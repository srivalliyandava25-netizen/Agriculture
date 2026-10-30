const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const defaultApiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : 'https://agriculture-kgjl.onrender.com';
const apiRoot = (configuredApiUrl || defaultApiUrl).replace(/\/$/, '').replace(/\/api$/, '');
const BASE_URL = `${apiRoot}/api`;

export const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('mittimitra_token');

  const headers = {
    ...options.headers
  };

  if (token) {
    headers.Authorization = 'Bearer ' + token;
  }

  // If payload is FormData (file upload), let browser set multipart boundary
  if (!(options.body instanceof FormData) && options.body && typeof options.body === 'object') {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const api = {
  get: (endpoint, options = {}) => request(endpoint, { method: 'GET', ...options }),
  post: (endpoint, body, options = {}) => request(endpoint, { method: 'POST', body, ...options }),
  put: (endpoint, body, options = {}) => request(endpoint, { method: 'PUT', body, ...options }),
  delete: (endpoint, options = {}) => request(endpoint, { method: 'DELETE', ...options })
};

