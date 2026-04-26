import axiosClient from "../api/axiosClient";
export const UserService = {
  getAll: () => axiosClient.get("/users"),
};
