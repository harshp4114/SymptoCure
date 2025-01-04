const express = require("express");
const router = express.Router();
const {
  getAllConsultations,
  createConsultation,
  deleteConsultationById,
  getConsultationById,
  updateConsultation,
} = require("../controllers/consultationController"); // Import the controller

router.get("/", getAllConsultations);
router.post("/", createConsultation);
router.delete("/:id", deleteConsultationById);
router.get("/:id", getConsultationById);
router.put("/:id",updateConsultation);
module.exports = router;
