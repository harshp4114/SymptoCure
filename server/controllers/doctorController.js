const Doctor = require("../models/doctorModel"); // Import the Doctor model
const mongoose = require("mongoose");

const getAllDoctors = async (req, res) => {
  try {
    // Fetch all Doctors from the database
    const doctors = await Doctor.find(); // Exclude the password field

    // Send a successful response with the Doctor data
    res.status(200).json({
      success: true,
      message: "All Doctors fetched successfully",
      data: doctors,
    });
  } catch (error) {
    // Handle errors and send error response
    console.error("Error fetching Doctors:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch Doctors",
      error: error.message,
    });
  }
};

const getDoctorById = async (req, res) => {
  try {
    // Extract the Doctor ID from the URL parameters
    const doctorId = req.params.id;
    // Check if the provided ID is a valid MongoDB ObjectID
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Doctor ID",
      });
    }
    console.log("hiiii");
    const doctor = await Doctor.findById(doctorId);
    if (doctor) {
      res.status(200).json({
        success: true,
        message: `Doctor with ${doctorId} is fetched successfully`,
        data: doctor,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Doctor not found with the given id",
      });
    }
  } catch (error) {
    // Handle any server errors
    console.error("Error fetching Doctor by id :", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const createDoctor = async (req, res) => {
  try {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "specialization",
      "experience",
      "gender",
      "phone",
      "availableDays",
      "hospital",
      "qualifications",
      "availableTime",
    ];

    // Check if all required fields are present
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          message: `Missing required field: ${field}`,
        });
      }
    }

    // Check if Doctor already exists
    const existingDoctor = await Doctor.findOne({ email: req.body.email });
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: "Doctor with this email already exists",
      });
    }

    // Create a new doctor
    const newDoctor = await Doctor.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      gender: req.body.gender,
      phone: req.body.phone,
      specialization: req.body.specialization,
      qualifications: req.body.qualifications,
      experience: req.body.experience,
      hospital: req.body.hospital,
      availableDays: req.body.availableDays,
      availableTime: req.body.availableTime,
      rating: 0,
      reviews: [],
      isActive: true, // Default value
    });
    console.log("hello");
    if (newDoctor) {
      // Return success response
      return res.status(201).send("Doctor created successfully ");
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create doctor",
      error: error.message,
    });
  }
};

const updateDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const Info = req.body;
    // Check if the provided ID is a valid MongoDB ObjectID
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID",
      });
    }

    const doctor = await Doctor.findByIdAndUpdate(doctorId, Info);

    if (doctor) {
      res.status(200).json({
        success: true,
        messages: "doctor updated successfully",
        data: doctor,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No doctor with the given id",
      });
    }
  } catch (error) {
    // Handle any server errors
    console.error("Error updating doctor:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteDoctorById = async (req, res) => {
  try {
    // Extract the doctor ID from the URL parameters
    const doctorId = req.params.id;

    // Check if the provided ID is a valid MongoDB ObjectID
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID",
      });
    }

    // Find the doctor by ID and delete them
    const doctor = await Doctor.findByIdAndDelete(doctorId);

    // If doctor doesn't exist, return a 404 response
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "doctor not found",
      });
    }

    // Send a success response
    res.status(200).json({
      success: true,
      message: "doctor deleted successfully",
      data: doctor, // Send the deleted doctor details if needed
    });
  } catch (error) {
    // Handle any server errors
    console.error("Error deleting doctor:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  deleteDoctorById,
  updateDoctor,
};
