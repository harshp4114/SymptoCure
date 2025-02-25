const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getAllUsers,
  createUser,
  deleteUserById,
  getUserById,
  updateUser,
  getUserByEmail,
  getUserProfile,
  updateSymptoms,
} = require("../controllers/userController"); // Import the controller

router.get("/", getAllUsers);
router.get("/profile",authMiddleware, getUserProfile);
router.post("/login",getUserByEmail); //y
router.post("/", createUser);//y
router.delete("/:id", deleteUserById);
router.get("/:id", getUserById);
router.put("/:id",updateUser);
router.put("/symptoms/:id",updateSymptoms);
module.exports = router;
