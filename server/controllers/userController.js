const bcrypt = require("bcrypt"); // For password hashing
const User = require("../models/userModel"); // Import the User model
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Address = require("../models/addressModel");
const Doctor = require("../models/doctorModel");
// Controller to get all users
const getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find(); // Exclude the password field

    // Send a successful response with the patient data
    res.status(200).json({
      success: true,
      message: "All users fetched successfully",
      data: users,
    });
  } catch (error) {
    // Handle errors and send error response
    //console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    // Extract the patient ID from the URL parameters
    const userId = req.params.id;
    // Check if the provided ID is a valid MongoDB ObjectID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID",
      });
    }

    const patient = await User.findById(userId);
    if (patient) {
      res.status(200).json({
        success: true,
        message: `User with ${userId} is fetched successfully`,
        data: patient,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found with the given id",
      });
    }
  } catch (error) {
    // Handle any server errors
    //console.error("Error fetching patient by id :", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getUserByEmail = async (req, res) => {
  const { email, password, role } = req.body;
  //console.log("request body", req.body);
  try {
    const patient = await User.findOne({ email });
    // console.log("patient with the same email", patient);
    if (patient) {
      const isPasswordValid = await bcrypt.compare(password, patient.password);
      if (!isPasswordValid) {
        //console.log("pass is wrong");
        return res.status(404).json({
          success: false,
          message: "Invalid Email or Password",
        });
      }
      const roleLower = role.toLowerCase();
      const token = jwt.sign(
        { id: patient._id, email: patient.email, role: roleLower },
        "harshp4114",
        { expiresIn: "1h" }
      );
      //console.log("backend token", token);

      res.status(200).json({
        success: true,
        message: "User Logged in Successfully",
        patient: patient,
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

const getUserProfile = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  // //console.log("req.patient    ",req.patient);
  try {
    const { email, id } = req.tokenData;

    const patient = await User.findOne({ email });
    // console.log("patient data backend", patient);

    const address = await Address.findById(patient.address);
    patient.address = address;

    return res.status(201).json({
      success: true,
      message: "profile found successfully",
      userData: patient,
    });
  } catch (error) {
    // //console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// Controller to create a patient
const createUser = async (req, res) => {
  // console.log("hhhhhhh");

  // if (req.body.role == "patient") {
    try {
      const requiredFields = [
        "firstName",
        "lastName",
        "email",
        "phone",
        "password",
        "age",
        "gender",
        "city",
        "state",
        "country",
        "zipCode",
      ];
      // console.log(req.body);
      // Check if all required fields are present
      for (const field of requiredFields) {
        if (!req.body[field]) {
          return res.status(400).json({
            success: false,
            message: `Missing required field: ${field}`,
          });
        }
      }

      // Check if patient already exists
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User with this email already exists",
        });
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const { zipCode, country, state, city } = req.body;
      // console.log(Address);
      const newAddress = new Address({
        zipCode: zipCode,
        country: country,
        state: state,
        city: city,
      });
      // console.log(newAddress);
      // Save the address to get its ObjectId
      const savedAddress = await newAddress.save();
      // Create a new patient
      // console.log("hhhhhhhhhhhhhhhhhhhhhh");


      const newUser = await User.create({
        fullName: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
        },
        email: req.body.email,
        password: hashedPassword, // Save the hashed password
        age: req.body.age,
        gender: req.body.gender,
        phone: req.body.phone,
        address: savedAddress._id,
        symptoms: [],
        detectedDisease: null,
        history: [],
        searchHistory: [],
        role: "patient",
        isActive: true, // Default value
      });

      console.log("patient data", newUser);
      // Return success response
      if (newUser) {
        const token = jwt.sign(
          { id: newUser._id, email: newUser.email , role:"patient"},
          "harshp4114",
          { expiresIn: "1h" }
        );

        return res
          .status(201)
          .json({ message: "User created successfully", token });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to create patient",
        error: error.message,
      });
    }
  // } else if (req.body.role == "doctor") {
  // }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const Info = req.body;
    // Check if the provided ID is a valid MongoDB ObjectID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID",
      });
    }

    const patient = await User.findByIdAndUpdate(userId, Info);

    if (patient) {
      res.status(200).json({
        success: true,
        messages: "User updated successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No patient with the given id",
      });
    }
  } catch (error) {
    // Handle any server errors
    //console.error("Error updating patient:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteUserById = async (req, res) => {
  try {
    // Extract the patient ID from the URL parameters
    const userId = req.params.id;

    // Check if the provided ID is a valid MongoDB ObjectID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID",
      });
    }

    // Find the patient by ID and delete them
    const patient = await User.findByIdAndDelete(userId);

    // If patient doesn't exist, return a 404 response
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Send a success response
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: patient, // Send the deleted patient details if needed
    });
  } catch (error) {
    // Handle any server errors
    //console.error("Error deleting patient:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  deleteUserById,
  getUserById,
  updateUser,
  getUserByEmail,
  getUserProfile,
};
