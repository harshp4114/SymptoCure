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

//console.log("monogo connecting")
connectMongo();
//console.log("monogo connecting")

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/predict", async (req, res) => {
  console.log("inside predict",req.body.symptoms);
  try {
      const response = await axios.post("http://localhost:8000/predict", {
          symptoms: req.body.symptoms
      });
      res.json(response.data);
  } catch (error) {
      console.error("FastAPI error:", error);
      res.status(500).json({ message: "ML service error" });
  }
});

app.use("/api/patient", userRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/consultation", consultationRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/address", addressRoutes);

app.use((req, res) => {
  res.end("hello from server");
});

// Start the server
app.listen(PORT, () => {
  //console.log(`Server running on http://localhost:${PORT}`);
});
