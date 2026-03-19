import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const categoryAPI = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
};

export const postAPI = {
  getAll: (page = 0, size = 10) => api.get(`/posts?page=${page}&size=${size}`),
  getById: (id) => api.get(`/posts/${id}`),
  getByCategory: (categoryId, page = 0, size = 10) => 
    api.get(`/posts/category/${categoryId}?page=${page}&size=${size}`),
  search: (query, page = 0, size = 10) => 
    api.get(`/posts/search?q=${query}&page=${page}&size=${size}`),
  create: (data) => api.post('/posts', data),
  update: (id, data) => api.put(`/posts/${id}`, data),
  delete: (id) => api.delete(`/posts/${id}`),
};

export const commentAPI = {
  getByPostId: (postId) => api.get(`/posts/${postId}/comments`),
  create: (postId, data) => api.post(`/posts/${postId}/comments`, data),
  delete: (id) => api.delete(`/comments/${id}`),
};

export const imageAPI = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/images/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default api;