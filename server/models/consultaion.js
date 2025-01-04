const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // References the User model
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor", // References the Doctor model
    required: true,
  },

  // Details of the consultation
  symptoms: {
    type: [String], // Symptoms provided by the user
    required: true,
  },
  detectedDisease: {
    type: String, // Disease detected during this consultation
    required: false,
  },
  diagnosis: {
    type: String, // Doctor's diagnosis, if applicable
    required: false,
  },
  prescription: {
    type: String, // Prescription provided by the doctor
    required: false,
  },
  consultationNotes: {
    type: String, // Additional notes by the doctor
    required: false,
  },

  // Date and status of the consultation
  consultationDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Completed", "Ongoing", "Cancelled"], // Consultation status
    default: "Ongoing",
  },

  // Optional fields
  followUpDate: {
    type: Date, // Suggested follow-up date, if any
    required: false,
  },
});

const Consultaions= mongoose.model("Consultation", consultationSchema);

module.exports = Consultaions;
