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

    // Availability
    availableDays: {
      type: [String], // e.g., ["Monday", "Wednesday", "Friday"]
      required: true,
    },
    availableTime: {
      start: { type: String, required: true }, // e.g., "09:00 AM"
      end: { type: String, required: true }, // e.g., "05:00 PM"
    },

    patientsPerDay: {
      type: Number,
      required: true,
    },

    // Ratings and reviews
    rating: {
      type: Number, // Average rating (1-5)
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to User
        comment: { type: String },
        rating: { type: Number, min: 0, max: 5 },
        reviewedAt: { type: Date, default: Date.now },
      },
    ],
    // Account-related fields
    // role: {
    //   type: String,
    //   enum: ["doctor"], 
    //   default: "doctor",
    // },

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
