import axiosInstance from "../lib/axiosInstance";

export const getAllUsers = async () => {
  const response = await axiosInstance.get("accounts/users/");
  return response.data;
};

export const toggleUserActive = async (userId) => {
  const response = await axiosInstance.patch(
    `/accounts/users/${userId}/toggle-active/`
  );
  return response.data;
};
