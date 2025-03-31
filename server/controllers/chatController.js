const mongoose = require("mongoose");
const Chat = require("../models/chatModel");

const createChat = async (req, res) => {
  // console.log("conrgyeg called");
  try {
    const { patientId } = req.body;
    const doctorId = req.tokenData.id;
    // console.log("doctorId", doctorId);
    // console.log("patientId", patientId);
    const chat = await Chat.create({ patientId, doctorId });
    if (chat) {
      return res.status(200).json({
        success: true,
        message: "Chat created successfully",
        data: chat,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create chat",
      error: error.message,
    });
  }
};

const getChatByChatId = async (req, res) => {
  try {
    const chatId = req.params.id;
    const chat = await Chat.findById(chatId)
      .populate("doctorId")
      .populate("patientId");
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "No chat found with following id",
        data: null,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Chat fetched successfully",
      data: chat,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch chat",
      error: error.message,
    });
  }
};

const getChatIdBySenderReceiverId = async (req, res) => {
  try {
    const { patientId, doctorId } = req.body;
    // console.log("reqbody", req.body);
    // console.log("patientId", patientId);
    // console.log("doctorId", doctorId);
    const chat = await Chat.findOne({
      patientId: patientId,
      doctorId: doctorId,
    });
    if (chat) {
      return res.status(200).json({
        success: true,
        message: "Chat fetched successfully",
        data: chat,
      });
    } else {
      return res.status(404).json({
        success: true,
        message: "No chat found with following Sender and Receiver",
        data: null,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch chat",
      error: error.message,
    });
  }
};

const getChatsbyDoctorId = async (req, res) => {
  try {
    const doctorId = req.tokenData.id;
    const chats = await Chat.find({ doctorId }).populate("patientId");
    return res.status(200).json({
      success: true,
      message: "Chats fetched successfully",
      data: chats,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch chats",
      error: error.message,
    });
  }
};

const updateChatLastMessage = async (req, res) => {
  try {
    const { chatId, lastMessage, lastMessageTime, receiverModel, changeCount } =
      req.body;
    // console.log("chang count", changeCount);
    const numChat = await Chat.findById(chatId);
    let updateFields = { lastMessage, lastMessageTime };

    if (changeCount) {
      if (receiverModel === "Doctor") {
        updateFields.doctorUnreadCount = (numChat.doctorUnreadCount || 0) + 1;
      } else if (receiverModel === "Patient") {
        updateFields.patientUnreadCount = (numChat.patientUnreadCount || 0) + 1;
      }
    }

    const chat = await Chat.findByIdAndUpdate(chatId, updateFields);

    return res.status(200).json({
      success: true,
      message: "Last message updated successfully",
      data: chat,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update last message",
      error: error.message,
    });
  }
};

const getChatsbyPatientId = async (req, res) => {
  try {
    const patientId = req.tokenData.id;
    const chats = await Chat.find({ patientId }).populate("doctorId");
    return res.status(200).json({
      success: true,
      message: "Chats fetched successfully",
      data: chats,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch chats",
      error: error.message,
    });
  }
};

const resetDoctorUnreadCount = async (req, res) => {
  try {
    const { chatId } = req.body;
    const chat = await Chat.findByIdAndUpdate(chatId, { doctorUnreadCount: 0 });
    return res.status(200).json({
      success: true,
      message: "Doctor Unread count reset successfully",
      data: chat,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to reset unread count",
      error: error.message,
    });
  }
};

const resetPatientUnreadCount = async (req, res) => {
  try {
    const { chatId } = req.body;
    const chat = await Chat.findByIdAndUpdate(chatId, {
      patientUnreadCount: 0,
    });
    return res.status(200).json({
      success: true,
      message: "Patient Unread count reset successfully",
      data: chat,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to reset unread count",
      error: error.message,
    });
  }
};

module.exports = {
  createChat,
  getChatsbyDoctorId,
  getChatIdBySenderReceiverId,
  updateChatLastMessage,
  getChatsbyPatientId,
  resetDoctorUnreadCount,
  resetPatientUnreadCount,
  getChatByChatId,
};
