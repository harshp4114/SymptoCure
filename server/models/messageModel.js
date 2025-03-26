const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
      chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'senderModel',
      },
      senderModel: {
        type: String,
        required: true,
        enum: ['Patient', 'Doctor'], // Specifies the collection
      },
      receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'receiverModel',  //specifies the path for dynamic reference
      },
      receiverModel: {
        type: String,
        required: true,
        enum: ['Patient', 'Doctor'],
      },
      text: { type: String, required: true },
      status: { type: String, enum: ['delivered', 'read'], default: 'delivered' },
    },
    { timestamps: true }
  );
  
 const Message = mongoose.model("Message", messageSchema);
 
 module.exports = Message;
  