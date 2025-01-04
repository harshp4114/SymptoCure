const bcrypt = require("bcrypt"); // For password hashing
const User = require("../models/userModel"); // Import the User model
const mongoose = require("mongoose");
// Controller to get all users
const getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find(); // Exclude the password field

    // Send a successful response with the user data
    res.status(200).json({
      success: true,
      message: "All users fetched successfully",
      data: users,
    });
  } catch (error) {
    // Handle errors and send error response
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    // Extract the user ID from the URL parameters
    const userId = req.params.id;
    // Check if the provided ID is a valid MongoDB ObjectID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await User.findById(userId);
    if (user) {
      res.status(200).json({
        success: true,
        message: `User with ${userId} is fetched successfully`,
        data: user,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found with the given id",
      });
    }
  } catch (error) {
    // Handle any server errors
    console.error("Error fetching user by id :", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Controller to create a user
const createUser = async (req, res) => {
  try {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "password",
      "age",
      "gender",
      "phone",
      "address",
      "role",
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

    // Check if user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new user
    const newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword, // Save the hashed password
      age: req.body.age,
      gender: req.body.gender,
      phone: req.body.phone,
      address: req.body.address,
      symptoms: [],
      detectedDisease: null,
      history: [],
      searchHistory: [],
      role: req.body.role,
      isActive: true, // Default value
    });

    // Return success response
    if(newUser){
      return res.status(201).send("User created successfully ");
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error.message,
    });
  }
};

const updateUser = async (req,res) => {
  try {
    const userId = req.params.id;
    const Info = req.body;
    // Check if the provided ID is a valid MongoDB ObjectID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await User.findByIdAndUpdate(userId, Info);

    if (user) {
      res.status(200).json({
        success: true,
        messages: "User updated successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No user with the given id",
      });
    }
  } catch (error) {
    // Handle any server errors
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteUserById = async (req, res) => {
  try {
    // Extract the user ID from the URL parameters
    const userId = req.params.id;

    // Check if the provided ID is a valid MongoDB ObjectID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Find the user by ID and delete them
    const user = await User.findByIdAndDelete(userId);

    // If user doesn't exist, return a 404 response
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Send a success response
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: user, // Send the deleted user details if needed
    });
  } catch (error) {
    // Handle any server errors
    console.error("Error deleting user:", error);
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
};
