import axiosInstance from "../lib/axiosInstance";

export const register = (data) => {
  return axiosInstance.post("accounts/register/", data);
};

export const login = async (credentials) => {
  const response = await axiosInstance.post("accounts/login/", credentials);

  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await axiosInstance.post("accounts/forgot-password/", {
    email,
  });
  return response.data;
};

export const resetPassword = async ({ uid, token, password }) => {
  const response = await axiosInstance.post(
    `accounts/reset-password/${uid}/${token}/`,
    { password },
  );
  return response.data;
};
