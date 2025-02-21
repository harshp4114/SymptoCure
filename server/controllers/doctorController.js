const bcrypt = require("bcrypt"); // For password hashing
const Doctor = require("../models/doctorModel"); // Import the Doctor model
const Address=require("../models/addressModel");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Appointment = require("../models/appointmentModel");


const getAllDoctors = async (req, res) => {
  try {
    // //console.log("hii");
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
    // //console.error("Error fetching Doctors:", error);
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
    // console.log("auth middleware info",req.patient)

    // console.log("inside get by ud")
    // Check if the provided ID is a valid MongoDB ObjectID
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Doctor ID",
      });
    }
    //console.log("hiiii");
    const doctor = await Doctor.findById(doctorId);

    console.log(doctor);
    if (doctor) {
      res.status(200).json({
        success: true,
        message: `Doctor with ${doctorId} is fetched successfully`,
        data: doctor,
        patientData: req.tokenData,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Doctor not found with the given id",
      });
    }
  } catch (error) {
    // Handle any server errors
    //console.error("Error fetching Doctor by id :", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getDoctorProfile = async (req, res) => {
  try {
    // Extract the Doctor ID from the URL parameters
    const { email, id } = req.tokenData;

    //console.log("hiiii");
    const doctor = await Doctor.findOne({ email });

    const address = await Address.findById(doctor.address);
    doctor.address = address;
    // console.log("dcoctor", doctor);
    if (doctor) {
      res.status(200).json({
        success: true,
        message: `Doctor with ${id} is fetched successfully`,
        doctorData: doctor,
        // patientData: req.patient,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }
  } catch (error) {
    // Handle any server errors
    //console.error("Error fetching Doctor by id :", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getDoctorByEmail = async (req, res) => {
  console.log("correct cntroller");
  const { email, password, role } = req.body;
  //console.log("request body", req.body);
  try {
    const doctor = await Doctor.findOne({ email });
    console.log("doc with the same email", doctor);
    if (doctor) {
      const isPasswordValid = await bcrypt.compare(password, doctor.password);
      if (!isPasswordValid) {
        //console.log("pass is wrong");
        return res.status(404).json({
          success: false,
          message: "Invalid Email or Password",
        });
      }
      console.log(doctor);
      const roleLower = role.toLowerCase();
      const token = jwt.sign(
        { id: doctor._id, email: doctor.email, role: roleLower },
        "harshp4114",
        { expiresIn: "1h" }
      );
      //console.log("backend token", token);

      res.status(200).json({
        success: true,
        message: "User Logged in Successfully",
        doctor: doctor,
        token,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Invalid Email or Password for the selected role",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something Went Wrong",
    });
  }
};

const getAppointmentsByDoctorId = async (req, res) => {
  const doctorId = req.params.id;

  try {
    // Fetch doctor details to get patientsPerDay
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const patientsPerDay = doctor.patientsPerDay;

    // Aggregate appointments to find fully booked dates
    const fullyBookedDates = await Appointment.aggregate([
      {
        $match: {
          doctorId: new mongoose.Types.ObjectId(doctorId), // Match doctorId
          status: "confirmed", // Only consider confirmed appointments
        },
      },
      {
        $group: {
          _id: "$date", // Group by date
          count: { $sum: 1 }, // Count the number of appointments per date
        },
      },
      {
        $match: { count: { $gte: patientsPerDay } }, // Filter dates where count >= patientsPerDay
      },
      {
        $project: {
          _id: 0,
          date: "$_id", // Rename _id to date
        },
      },
    ]);

    res.status(200).json({
      success: true,
      fullyBookedDates: fullyBookedDates.map((entry) => entry.date), // Return an array of fully booked dates
    });
  } catch (error) {
    //console.error("Error fetching fully booked dates:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const createDoctor = async (req, res) => {
  // //console.log(req.body);
  try {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "password",
      "gender",
      "city",
      "state",
      "country",
      "zipCode",
      "specialization",
      "qualifications",
      "experience",
      "hospital",
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
    //bcrypt the password for safety purposes
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const { zipCode, country, state, city } = req.body;

    const newAddress = new Address({
      zipCode: zipCode,
      country: country,
      state: state,
      city: city,
    });

    const savedAddress = await newAddress.save();

    // Create a new doctor
    const newDoctor = await Doctor.create({
      fullName: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      },
      gender: req.body.gender,
      email: req.body.email,
      phone: req.body.phone,
      password: hashedPassword,
      specialization: req.body.specialization,
      qualifications: req.body.qualifications,
      experience: req.body.experience,
      hospital: req.body.hospital,
      address:savedAddress._id,
      // availableDays: req.body.availableDays,
      // availableTime: req.body.availableTime,
      // patientsPerDay: req.body.patientsPerDay, // This field is required in the schema
      rating: 0, // Default rating
      reviews: [], // Default reviews
      isActive: true, // Default value
    });

    //console.log("hello");
    console.log("new doctor that is created ",newDoctor)
    if (newDoctor) {
      const token = jwt.sign(
        { id: newDoctor._id, email: newDoctor.email, role: "doctor" },
        "harshp4114",
        { expiresIn: "1h" }
      );
      // Return success response
      return res
        .status(201)
        .json({ message: "Doctor created successfully", token });
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
    //console.error("Error updating doctor:", error);
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
    //console.error("Error deleting doctor:", error);
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
  getAppointmentsByDoctorId,
  getDoctorProfile,
  getDoctorByEmail,
};
