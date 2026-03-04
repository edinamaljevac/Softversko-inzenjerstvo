import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import BookAppointmentModal from "../BookAppointementModal";

// Mock API
vi.mock("../../api/appointmentService", () => ({
  createAppointment: vi.fn(),
}));

vi.mock("../../api/treatmentService", () => ({
  getTreatments: vi.fn(),
}));

import { createAppointment } from "../../api/appointmentService";
import { getTreatments } from "../../api/treatmentService";

const mockSlot = {
  id: 1,
  doctor: 2,
  date: "2026-01-10",
  start_time: "10:00:00",
  end_time: "11:00:00",
};

describe("BookAppointmentModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders modal and slot data", async () => {
    getTreatments.mockResolvedValue([]);

    render(
      <BookAppointmentModal
        slot={mockSlot}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />,
    );

    expect(await screen.findByText("Zakazivanje termina")).toBeInTheDocument();
    expect(screen.getByText("2026-01-10")).toBeInTheDocument();
  });

  it("shows validation error if no treatment selected", async () => {
    getTreatments.mockResolvedValue([]);

    render(
      <BookAppointmentModal
        slot={mockSlot}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />,
    );

    const confirmButton = await screen.findByText("Potvrdi");
    fireEvent.click(confirmButton);

    expect(
      await screen.findByText("Molimo izaberite tretman."),
    ).toBeInTheDocument();
  });

  it("calls createAppointment and onSuccess when valid", async () => {
    getTreatments.mockResolvedValue([
      { id: 5, service_name: "Čišćenje kamenca" },
    ]);

    createAppointment.mockResolvedValue({});

    const onSuccessMock = vi.fn();

    render(
      <BookAppointmentModal
        slot={mockSlot}
        onClose={vi.fn()}
        onSuccess={onSuccessMock}
      />,
    );

    const select = await screen.findByRole("combobox");

    fireEvent.change(select, { target: { value: "5" } });

    const confirmButton = screen.getByText("Potvrdi");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(createAppointment).toHaveBeenCalled();
      expect(onSuccessMock).toHaveBeenCalled();
    });
  });
});
