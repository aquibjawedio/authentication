import axiosClient from "@/api/axiosClient";

export const getAllUsers = () => axiosClient.get("/admin/users");
export const deleteUser = (userId) =>
  axiosClient.delete(`/admin/users/${userId}`);
