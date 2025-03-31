const express = require("express");
const router = express.Router();
const {
  getAllAppointments,
  createAppointment,
  getAppointmentsByDoctorId,
  updateAppointment,
  getAppointmentsByUserId,
  getAllAcceptedPateints,
  getApprovedAppointment,
} = require("../controllers/appointmentController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware, getAllAppointments);
router.get("/doctor", authMiddleware, getAppointmentsByDoctorId);
router.get("/user", authMiddleware, getAppointmentsByUserId);
router.get("/patients", authMiddleware, getAllAcceptedPateints);
router.post("/approved",getApprovedAppointment);
router.post("/:id", authMiddleware, createAppointment);
router.put("/:id", authMiddleware, updateAppointment);
module.exports = router;
