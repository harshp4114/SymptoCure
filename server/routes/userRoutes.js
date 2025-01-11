const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  createUser,
  deleteUserById,
  getUserById,
  updateUser,
  getUserByEmail,
} = require("../controllers/userController"); // Import the controller

router.get("/", getAllUsers);
router.get("/login",getUserByEmail);
router.post("/", createUser);
router.delete("/:id", deleteUserById);
router.get("/:id", getUserById);
router.put("/:id",updateUser);
module.exports = router;
