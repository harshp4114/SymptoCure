const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { createMessage, getMessagesByChatId } = require("../controllers/messageController");

router.post("/",createMessage);
router.get("/:id",getMessagesByChatId);

module.exports = router;
