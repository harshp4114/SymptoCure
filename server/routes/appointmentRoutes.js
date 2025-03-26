const express = require("express");
const router = express.Router();
const {
  getAllAppointments,
  createAppointment,
  getAppointmentsByDoctorId,
  updateAppointment,
  getAppointmentsByUserId,
  getAllAcceptedPateints,
} = require("../controllers/appointmentController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware, getAllAppointments);
router.post("/:id", authMiddleware, createAppointment);
router.put("/:id", authMiddleware, updateAppointment);
router.get("/doctor", authMiddleware, getAppointmentsByDoctorId);
router.get("/user", authMiddleware, getAppointmentsByUserId);
router.get("/patients", authMiddleware, getAllAcceptedPateints);
module.exports = router;
