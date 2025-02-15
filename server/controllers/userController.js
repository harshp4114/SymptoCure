const bcrypt = require("bcrypt"); // For password hashing
const User = require("../models/userModel"); // Import the User model
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Address = require("../models/addressModel");
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
    //console.error("Error fetching user by id :", error);
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
    const user = await User.findOne({ email, role });
    //console.log("user with the same email", user);
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        //console.log("pass is wrong");
        return res.status(404).json({
          success: false,
          message: "Invalid Email or Password",
        });
      }
      const roleLower=role.toLowerCase();
      const token = jwt.sign(
        { id: user._id, email: user.email, role: roleLower },
        "harshp4114",
        { expiresIn: "1h" }
      );
      //console.log("backend token", token);

      res.status(200).json({
        success: true,
        message: "User Logged in Successfully",
        user: user,
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
  // //console.log("req.user    ",req.user);
  try {
    const { email, id } = req.user;

    const user = await User.findOne({ email });
    console.log("user data backend", user);

    const address = await Address.findById(user.address);
    user.address = address;

    return res.status(201).json({
      success: true,
      message: "profile found successfully",
      userData: user,
    });
  } catch (error) {
    // //console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// Controller to create a user
const createUser = async (req, res) => {
  console.log("hhhhhhh");
  try {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "role",
      "password",
      "age",
      "gender",
      "phone",
      "address",
      "city",
      "state",
      "country",
      "zipCode",
    ];
    console.log(req.body);
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
    const { zipCode, country, state, city, address } = req.body;
    // console.log(Address);
    const newAddress = new Address({
      zipCode: zipCode,
      country: country,
      state: state,
      city: city,
      address: address,
    });
    console.log(newAddress);
    // Save the address to get its ObjectId
    const savedAddress = await newAddress.save();
    // Create a new user
    // console.log("hhhhhhhhhhhhhhhhhhhhhh");

    const role = req.body.role.toLowerCase();

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
      role: role,
      isActive: true, // Default value
    });

    // console.log("user data", newUser);
    // Return success response
    if (newUser) {
      const token = jwt.sign(
        { id: newUser._id, email: newUser.email, role: role },
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
      message: "Failed to create user",
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
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
    //console.error("Error updating user:", error);
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
    //console.error("Error deleting user:", error);
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
