import express from "express";
import { 
  createAppointment,
  getAppointments,
  updateAppointmentStatus
} from "../controllers/appointmentController.js";

const router = express.Router();

// Create a new appointment
router.post("/", createAppointment);

// Get appointments (filter by userId or counsellorId)
router.get("/", getAppointments);

// Update appointment status
router.patch("/:id", updateAppointmentStatus);

export default router;
