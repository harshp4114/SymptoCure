const express = require("express");
const router = express.Router();
const {getAllAppointments,createAppointment,getAppointmentsByDoctorId} = require("../controllers/appointmentController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/",authMiddleware,getAllAppointments);
router.post("/:id",authMiddleware,createAppointment);
router.get("/doctor",authMiddleware,getAppointmentsByDoctorId);
module.exports = router;