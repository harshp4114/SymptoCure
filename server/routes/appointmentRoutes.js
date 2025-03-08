const express = require("express");
const router = express.Router();
const {getAllAppointments,createAppointment,getAppointmentsByDoctorId,updateAppointment} = require("../controllers/appointmentController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/",authMiddleware,getAllAppointments);
router.post("/:id",authMiddleware,createAppointment);
router.put("/:id",authMiddleware,updateAppointment)
router.get("/doctor",authMiddleware,getAppointmentsByDoctorId);
module.exports = router;