const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // User authentication fields
    fullName: {
      firstName: {
        type: String,
        required: true,
        trim: true,
      },
      lastName: {
        type: String,
        required: true,
        trim: true,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // Optional profile details
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "male", "female", "other"],
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },

    // Machine learning-related fields
    symptoms: {
      type: [String], // Current symptoms provided by the patient
      default: [],
    },
    detectedDisease: {
      type: String, // Current disease detected via machine learning
      default: null,
    },

    // History of symptoms and detected diseases
    history: [
      {
        symptoms: { type: [String] }, // Previous symptoms
        detectedDisease: { type: String }, // Disease detected for those symptoms
        detectedAt: { type: Date, default: Date.now }, // When the detection occurred
      },
    ],

    // Account-related fields
    role: {
      type: String,
      enum: ["patient", "admin", "doctor"], // Default role is "patient", can be "admin" for admin access
      default: "patient",
    },
    isActive: {
      type: Boolean, // Indicates whether the patient account is active
      default: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
