import axiosClient from '../api/axiosClient';
export const TodoService = {
  getAll: () => axiosClient.get('/todos'),
  update: (id, data) => axiosClient.patch(`/todos/${id}`, data),
  create: (data) => axiosClient.post('/todos', data)
};