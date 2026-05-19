import axiosClient from "../api/axiosClient";
export const BlogService = {
  getPosts: () => axiosClient.get("/posts?_limit=6"),
  getComments: (postId) => axiosClient.get(`/posts/${postId}/comments`),
  createPost: (data) => axiosClient.post("/posts", data),
  deletePost: (id) => axiosClient.delete(`/posts/${id}`),
};
