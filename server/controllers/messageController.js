const mongoose = require("mongoose");
const Message = require("../models/messageModel");

const createMessage = async (req, res) => {
  try {
    const { chatId, senderId, receiverId, text, senderModel, receiverModel } =
      req.body;
    const message = await Message.create({
      chatId,
      senderId,
      receiverId,
      text,
      senderModel,
      receiverModel,
    });
    if (message) {
      return res.status(200).json({
        success: true,
        message: "Message sent successfully",
        data: message,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};

const getMessagesByChatId = async (req, res) => {
    try{
        const chatId=req.params.id;
        const messages=await Message.find({chatId});
        return res.status(200).json({
            success:true,
            message:"Messages fetched successfully",
            data:messages
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Failed to fetch messages for this chat",
            error:err.message
        })
    }
}

module.exports = {
  createMessage,
  getMessagesByChatId,
};
