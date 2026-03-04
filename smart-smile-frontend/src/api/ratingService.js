import axiosInstance from "../lib/axiosInstance";

export const getRatings = async () => {
  const response = await axiosInstance.get("ratings/");
  return response.data;
};

export const createRating = async (data) => {
  const response = await axiosInstance.post("ratings/create/", data);
  return response.data;
};

export const getAllRatingsAdmin = async () => {
  const response = await axiosInstance.get("ratings/admin/");
  return response.data;
};

export const deleteRatingAdmin = async (id) => {
  await axiosInstance.delete(`ratings/admin/${id}/`);
};
