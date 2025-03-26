const express = require("express");
const { connectMongo } = require("./config");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const consultationRoutes = require("./routes/consultationRoutes");
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
const io=new Server(httpServer,{
  cors: {
    origin: "*", 
    methods: ["GET", "POST","PUT","DELETE"],
    credentials: true,
  },
});
const PORT = 5000;

app.use(cors(
  {
    origin: "*",
    methods: ["GET", "POST","PUT","DELETE"],
    credentials: true,
  }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


io.on("connection", (socket) => {
  console.log("a user connected",socket.id);
  

  socket.on("landing",()=>{
    console.log("landing");
  })

  socket.on("user-book-appointment",()=>{
    console.log("user-book-appointment");  // this is to show appointment request in doctor when a patient makes an request
    io.emit("appointment-reload");
  })

  socket.on("patient-profile-updated",()=>{
    io.emit("change-patient-data"); //this is to reload details in appointment when patient updates his profile
  })

  socket.on("doctor-profile-updated",()=>{
    console.log("doctor-profile-updated");
    io.emit("change-doctor-data")  //this is to reload details in appointment when doctor updates his profile
  })

  socket.on("appointment-status-updated",()=>{
    io.emit("appointment-reload-info")  //this is to fetch status on patient profile when doctor accepts/rejects the request
  });

  socket.on("disconnect", () => {
    console.log("user disconnected",socket.id);
  });
});

app.post("/predict", async (req, res) => {
  // console.log("inside predict",req.body.symptoms);
  // res.end("hello from predict");
  try {
      const response = await axios.post(`http://127.0.0.1:8000/predict`, {
          symptoms: req.body.symptoms
      });
      res.json(response.data);
  } catch (error) {
      console.error("FastAPI error:", error);
      res.status(500).json({error:error, message: "ML service error" });
  }
});
// console.log("chat routes",chatRoutes);
// console.log("docotr routes",doctorRoutes);

app.use("/api/patient", userRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/consultation", consultationRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/chat",chatRoutes);
app.use("/api/message",messageRoutes);

app.use((req, res) => {
  // connectMongo();
  console.log("no one matched")
  res.end("hello from server");
});

// Start the server
httpServer.listen(PORT,"0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
