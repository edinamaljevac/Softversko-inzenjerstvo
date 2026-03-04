import axiosInstance from "../lib/axiosInstance";

export const getTreatments = async (doctorId) => {
  const response = await axiosInstance.get(`treatments/?doctor=${doctorId}`);
  return response.data;
};

export const createTreatment = async (data) => {
  const response = await axiosInstance.post("treatments/", data);
  return response.data;
};

export const updateTreatment = async (id, data) => {
  const response = await axiosInstance.put(`treatments/${id}/`, data);
  return response.data;
};

export const deleteTreatment = async (id) => {
  await axiosInstance.delete(`treatments/${id}/`);
};
