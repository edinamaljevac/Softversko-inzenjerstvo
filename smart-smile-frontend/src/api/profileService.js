import axiosInstance from "../lib/axiosInstance";

export const getPatientProfile = async (profileId) => {
  const response = await axiosInstance.get(`accounts/patient/${profileId}/`);
  return response.data;
};

export const getMyPatientProfile = async () => {
  const response = await axiosInstance.get("accounts/me/patient-profile/");
  return response.data;
};

export const createPatientProfile = async (data) => {
  const response = await axiosInstance.post("accounts/patients/", data);
  return response.data;
};

export const updatePatientProfile = async (data) => {
  const response = await axiosInstance.patch(
    "accounts/me/patient-profile/",
    data,
  );
  return response.data;
};

export const getMyDentistProfile = async () => {
  const response = await axiosInstance.get("accounts/me/dentist-profile/");
  return response.data;
};

export const createDentistProfile = async (data) => {
  const response = await axiosInstance.post(
    "accounts/me/dentist-profile/",
    data,
  );
  return response.data;
};

export const updateDentistProfile = async (data) => {
  const response = await axiosInstance.patch(
    "accounts/me/dentist-profile/",
    data,
  );
  return response.data;
};

export const getPatientsList = async () => {
  const response = await axiosInstance.get("accounts/patients/");
  return response.data;
};

export const getPatientProfileById = async (id) => {
  const response = await axiosInstance.get(`accounts/patient/${id}/`);
  return response.data;
};

export const getDentistProfileById = async (id) => {
  const response = await axiosInstance.get(`accounts/dentist/${id}/`);
  return response.data;
};
