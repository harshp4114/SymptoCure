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
} = require("../controllers/doctorController");

router.get("/",authMiddleware, getAllDoctors);
router.post("/", createDoctor);
router.get("/:id/appointments", getAppointmentsByDoctorId);
router.get("/:id", getDoctorById);
router.delete("/:id",deleteDoctorById);
router.put("/:id",updateDoctor);
module.exports = router;
