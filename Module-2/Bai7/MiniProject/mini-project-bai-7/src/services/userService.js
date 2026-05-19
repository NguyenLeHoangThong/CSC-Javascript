import axiosClient from '../api/axiosClient';

export const UserService = {
  getAll: () => axiosClient.get('/users'),
  create: (data) => axiosClient.post('/users', data),
  delete: (id) => axiosClient.delete(`/users/${id}`),
};