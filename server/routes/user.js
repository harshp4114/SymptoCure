const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  createUser,
  deleteUserById,
  getUserById,
  updateUser,
} = require("../controllers/user"); // Import the controller

// Route: GET /api/user/
router.get("/", getAllUsers);
router.post("/", createUser);
router.delete("/:id", deleteUserById);
router.get("/:id", getUserById);
router.put("/:id",updateUser);
module.exports = router;
