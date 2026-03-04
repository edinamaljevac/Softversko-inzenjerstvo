import axiosInstance from "../lib/axiosInstance";

export const getMySlots = async () => {
  const response = await axiosInstance.get("slots/");
  return response.data;
};

export const createSlot = async (data) => {
  const response = await axiosInstance.post("slots/", data);
  return response.data;
};

export const deleteSlot = async (id) => {
  await axiosInstance.delete(`slots/${id}/`);
};
