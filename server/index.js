const express = require("express");
const { connectMongo } = require("./config");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const consultationRoutes = require("./routes/consultationRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const addressRoutes = require("./routes/addressRoutes");
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
    origin: "https://symptocure.netlify.app/", // Update this with your frontend URL
    methods: ["GET", "POST","PUT","DELETE"],
  },
});
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("newAppointment",()=>{
    // console.log("appointment",appointment);
    io.emit("appointmentUpdate");
  })

  socket.on("appointmentRequestUpdate",()=>{
    io.emit("changeAppointmentStatus");
  })
  socket.on("userProfileUpdate",()=>{
    io.emit("userDataNeedChange");
  })
});

app.post("/predict", async (req, res) => {
  console.log("inside predict",req.body.symptoms);
  res.end("hello from predict");
  try {
      const response = await axios.post(`https://symptocure-ml.onrender.com/predict`, {
          symptoms: req.body.symptoms
      });
      res.json(response.data);
  } catch (error) {
      console.error("FastAPI error:", error);
      res.status(500).json({error:error, message: "ML service error" });
  }
});

app.use("/api/patient", userRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/consultation", consultationRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/address", addressRoutes);

app.use((req, res) => {
  // connectMongo();
  res.end("hello from server");
});

// Start the server
httpServer.listen(PORT,"0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
