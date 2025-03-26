const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { createChat ,getChatsbyDoctorId, getChatIdBySenderReceiverId, updateChatLastMessage} = require("../controllers/chatController");

router.post("/create",authMiddleware,createChat);
router.get("/chatsByDoctorId",authMiddleware,getChatsbyDoctorId);
router.post("/chatId",getChatIdBySenderReceiverId);
router.put("/updateLastMessage",authMiddleware,updateChatLastMessage);

module.exports = router;
