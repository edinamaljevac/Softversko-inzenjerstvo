import axiosInstance from "../lib/axiosInstance";

export const createToothRecord = async (data) => {
  const response = await axiosInstance.post(
    "appointments/tooth-records/",
    data
  );
  return response.data;
};

export const getPatientToothRecords = async (patientId) => {
  const response = await axiosInstance.get(
    `appointments/patients/${patientId}/tooth-records/`
  );
  return response.data;
};
