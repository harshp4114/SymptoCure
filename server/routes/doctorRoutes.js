const express = require("express");
const router = express.Router();
const {
  getAllDoctors,
  createDoctor,
  getDoctorById,
  deleteDoctorById,
  updateDoctor,
} = require("../controllers/doctorController");

router.get("/", getAllDoctors);
router.post("/", createDoctor);
router.get("/:id", getDoctorById);
router.delete("/:id",deleteDoctorById);
router.put("/:id",updateDoctor);
module.exports = router;
