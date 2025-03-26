const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { createChat ,getChatsbyDoctorId} = require("../controllers/chatController");

router.post("/create",authMiddleware,createChat);
router.get("/chatsByDoctorId",authMiddleware,getChatsbyDoctorId);

module.exports = router;
