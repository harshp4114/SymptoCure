const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getAllDoctors,
  createDoctor,
  getDoctorById,
  deleteDoctorById,
  updateDoctor,
  getAppointmentsByDoctorId,
  getDoctorProfile
} = require("../controllers/doctorController");

router.get("/",authMiddleware, getAllDoctors);
router.post("/", createDoctor);
router.get("/:id/appointments", getAppointmentsByDoctorId);
router.get("/profile",authMiddleware, getDoctorProfile);
router.get("/:id", getDoctorById);
router.delete("/:id",deleteDoctorById);
router.put("/:id",updateDoctor);
module.exports = router;
