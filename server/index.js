const express = require("express");
const { connectMongo } = require("./config");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const addressRoutes = require("./routes/addressRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const cors = require("cors");
const axios = require("axios");
const { createServer } = require("http");
const { Server } = require("socket.io");

//console.log("monogo connecting")
connectMongo();
//console.log("monogo connecting")

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    // origin:"http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});
const PORT = 5000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let onlineUsers = {};

io.on("connection", (socket) => {
  // console.log("a user connected",socket.id);

  // const

  socket.on("new-message-from-patient", (data) => {
    if (onlineUsers[data.doctorId]) {
      // console.log("new message from patient called socket")
      io.to(onlineUsers[data.doctorId]).emit(
        "new-message-updatefrom-patient",
        data.message
      );
    }
  });

  socket.on("new-message-from-doctor", (data) => {
    if (onlineUsers[data.patientId]) {
      // console.log("new message from doc called socket")
      io.to(onlineUsers[data.patientId]).emit(
        "new-message-updatefrom-doctor",
        data.message
      );
    }
  });

  //count not updated when message seen directly by patient
  socket.on("chat-opened-by-patient", (chat) => {
    // console.log("chat-opened-by-patient socket");
    // console.log("user id",chat.doctorId);
    // console.log("online users",onlineUsers);
    if (onlineUsers[chat.doctorId._id]) {
      // console.log("chat-opened-by-patient socket if",onlineUsers[chat?.doctorId?._id]);
      io.to(onlineUsers[chat?.doctorId?._id]).emit(
        "chat-opened-by-patient-from-server",
        chat
      );
    }
  });

  socket.on("chat-closed-by-patient", (chat) => {
    // console.log("chat-closed-by-patient socket",chat);
    // console.log("user id",chat?.doctorId);
    // console.log("online users",onlineUsers[chat?.doctorId?._id]);
    if (onlineUsers[chat?.doctorId?._id]) {
      // console.log("inside if cond")
      io.to(onlineUsers[chat.doctorId._id]).emit(
        "chat-closed-by-patient-from-server",
        chat
      );
    }
  });

  //count not updated when message seen directly by doctor
  socket.on("chat-opened-by-doctor", (chat) => {
    // console.log("chat-opened-by-doctor socket", chat);
    // console.log("user id", chat.patientId);
    // console.log("online users", onlineUsers);
    if (onlineUsers[chat.patientId._id]) {
      // console.log(
      //   "chat-opened-by-doctor socket if",
      //   onlineUsers[chat?.patientId?._id]
      // );
      io.to(onlineUsers[chat?.patientId?._id]).emit(
        "chat-opened-by-doctor-from-server",
        chat
      );
    }
  });

  socket.on("chat-closed-by-doctor", (chat) => {
    // console.log("chat-closed-by-doctor socket", chat);
    // console.log("user id", chat?.patientId);
    // console.log("online users", onlineUsers[chat?.patientId?._id]);
    if (onlineUsers[chat?.patientId?._id]) {
      // console.log("inside if cond");
      io.to(onlineUsers[chat.patientId._id]).emit(
        "chat-closed-by-doctor-from-server",
        chat
      );
    }
  });

  socket.on("join", (userId) => {
    onlineUsers[userId] = socket.id;
    console.log(`User ${userId} connected with socket ID: ${socket.id}`);
    io.emit("user-online-status", userId);
  });

  socket.on("is-user-online", (userId) => {
    // console.log("socket is user online", userId);
    if (onlineUsers[userId]) {
      // console.log("inside if");
      io.emit("user-online-status", userId);
    } else {
      // console.log("inside else");
      io.emit("user-offline-status", userId);
    }
  });

  socket.on("user-book-appointment", (data) => {
    // console.log("user-book-appointment",data); // this is to show appointment request in doctor when a patient makes an request
    io.emit("appointment-reload",data.appointment);
  });

  socket.on("patient-profile-updated", () => {
    io.emit("change-patient-data"); //this is to reload details in appointment when patient updates his profile
  });

  socket.on("doctor-profile-updated", () => {
    // console.log("doctor-profile-updated");
    io.emit("change-doctor-data"); //this is to reload details in appointment when doctor updates his profile
  });

  socket.on("appointment-status-updated", () => {
    io.emit("appointment-reload-info"); //this is to fetch status on patient profile when doctor accepts/rejects the request
  });

  socket.on("remove-user-socket", (userId) => {
    delete onlineUsers[userId];
    io.emit("user-offline-status", userId);
    // console.log(`User ${userId} disconnected`);
  });

  socket.on("disconnect", () => {
    // console.log("User disconnected", socket.id);
    let disconnectedUserId = Object.keys(onlineUsers).find(
        (key) => onlineUsers[key] === socket.id
    );
    if (disconnectedUserId) {
        delete onlineUsers[disconnectedUserId];
        io.emit("user-offline-status", disconnectedUserId);
    }
});
  // console.log("online users ",onlineUsers);
});

app.post("/predict", async (req, res) => {
  // console.log("inside predict",req.body.symptoms);
  // res.end("hello from predict");
  try {
    // const response = await axios.post(`http://127.0.0.1:8000/predict`, {
    //   symptoms: req.body.symptoms,
    // });
    const response = await axios.post(`https://symptocure-ml.onrender.com`, {
      symptoms: req.body.symptoms,
    });

    res.json(response.data);
  } catch (error) {
    console.error("FastAPI error:", error);
    res.status(500).json({ error: error, message: "ML service error" });
  }
});
// console.log("chat routes",chatRoutes);
// console.log("docotr routes",doctorRoutes);

app.use("/api/patient", userRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use((req, res) => {
  // connectMongo();
  // console.log("no one matched");
  res.end("hello from server");
});

// Start the server
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
