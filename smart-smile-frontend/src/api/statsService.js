import axiosInstance from "../lib/axiosInstance";

export const getStats = async () => {
  const response = await axiosInstance.get("stats/");
  return response.data;
};

export const getDentistStats = async () => {
  const response = await axiosInstance.get("/stats/dentist/");
  return response.data;
};
