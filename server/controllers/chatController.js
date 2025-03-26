const mongoose = require("mongoose");
const Chat = require("../models/chatModel");

const createChat = async (req, res) => {
  console.log("conrgyeg called");
  try {
    const { patientId } = req.body;
    const doctorId=req.tokenData.id;
    console.log("doctorId", doctorId);
    console.log("patientId", patientId);
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

const getChatsbyDoctorId=async(req,res)=>{
  try{
    const doctorId=req.tokenData.id;
    const chats=await Chat.find({doctorId}).populate("patientId");
    return res.status(200).json({
      success:true,
      message:"Chats fetched successfully",
      data:chats
    })
  }catch(error){
    return res.status(500).json({
      success:false,
      message:"Failed to fetch chats",
      error:error.message
    })
  }
}


module.exports = {
  createChat,
  getChatsbyDoctorId,
};
