const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createChat,
  getChatsbyDoctorId,
  getChatIdBySenderReceiverId,
  updateChatLastMessage,
  getChatsbyPatientId,
  resetDoctorUnreadCount,
  resetPatientUnreadCount,
  getChatByChatId,
} = require("../controllers/chatController");

router.post("/create", authMiddleware, createChat);
router.get("/chatsByDoctorId", authMiddleware, getChatsbyDoctorId);
router.post("/chatId", getChatIdBySenderReceiverId);
router.put("/updateLastMessage", authMiddleware, updateChatLastMessage);
router.get("/chatsByPatientId", authMiddleware, getChatsbyPatientId);
router.put("/resetDoctorUnreadCount", authMiddleware, resetDoctorUnreadCount);
router.put("/resetPatientUnreadCount", authMiddleware, resetPatientUnreadCount);
router.get("/:id",getChatByChatId);

module.exports = router;
