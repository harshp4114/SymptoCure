const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema(
  {
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
      type: [String], // Symptoms provided by the patient
      required: true,
    },
    detectedDisease: {
      type: String, // Disease detected during this consultation
      required: true,
    },
    diagnosis: {
      type: String, // Doctor's diagnosis, if applicable
      required: true,
    },
    prescription: {
      type: String, // Prescription provided by the doctor
      required: false,
      default: "No prescription given.",
    },
    consultationNotes: {
      type: String, // Additional notes by the doctor
      required: false,
      default: "No additional notes given by the doctor.",
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
  },
  { timestamps: true }
);

const Consultation = mongoose.model("consultation", consultationSchema);

module.exports = Consultation;
