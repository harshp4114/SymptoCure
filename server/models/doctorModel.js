const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    // Doctor's personal information
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
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // Professional information
    specialization: {
      type: String,
      required: true, // e.g., "Cardiology", "Neurology", etc.
    },
    qualifications: {
      type: [String], // e.g., ["MBBS", "MD", "Fellowship"]
      required: true,
    },
    experience: {
      type: Number, // Number of years of experience
      required: true,
    },
    hospital: {
      type: String, // Hospital/clinic where the doctor works
      required: true,
    },

    // Ratings and reviews
    rating: {
      type: Number, // Average rating (1-5)
      default: 0,
      min: 0,
      max: 5,
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to User
        comment: { type: String },
        rating: { type: Number, min: 0, max: 5 },
        reviewedAt: { type: Date, default: Date.now },
      },
    ],

    // Account details
    isActive: {
      type: Boolean, // Indicates whether the doctor is currently active
      default: true,
    },
  },
  { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
