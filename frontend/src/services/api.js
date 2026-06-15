const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

export const authAPI = {
  register: (body) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  login: (body) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  getProfile: () => request('/auth/profile'),
};

export const accountAPI = {
  getAll: () => request('/accounts'),

  create: (body) =>
    request('/accounts', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  getById: (id) => request(`/accounts/${id}`),
};

export const transactionAPI = {
  getAll: (accountId) =>
    request(
      `/transactions${accountId ? `?account_id=${accountId}` : ''}`
    ),

  deposit: (body) =>
    request('/transactions/deposit', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  withdraw: (body) =>
    request('/transactions/withdraw', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  transfer: (body) =>
    request('/transactions/transfer', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};

export const adminAPI = {
  getStats: () => request('/admin/stats'),
};