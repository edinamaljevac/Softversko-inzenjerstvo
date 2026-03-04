import axiosInstance from "../lib/axiosInstance";

export const createAppointment = async ({ slotId, treatmentId }) => {
  const response = await axiosInstance.post("appointments/", {
    slot: slotId,
    treatment: treatmentId,
  });
  return response.data;
};

export const getMyAppointments = async () => {
  const response = await axiosInstance.get("appointments/");
  return response.data;
};

export const updateAppointmentStatus = async (id, status) => {
  const response = await axiosInstance.patch(`appointments/${id}/`, {
    status,
  });
  return response.data;
};

export const createAppointmentAsDentist = async ({
  patient,
  slot,
  treatment,
  parent_appointment,
}) => {
  const response = await axiosInstance.post("appointments/dentist-create/", {
    patient,
    slot,
    treatment,
    parent_appointment,
  });
  return response.data;
};
