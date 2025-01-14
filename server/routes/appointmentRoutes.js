const express = require("express");
const router = express.Router();
const {getAllAppointments,createAppointment} = require("../controllers/appointmentController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/",authMiddleware,getAllAppointments);
router.post("/:id",authMiddleware,createAppointment);

module.exports = router;