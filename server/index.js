const express = require("express");
const { connectMongo } = require("./config");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const consultationRoutes=require("./routes/consultationRoutes");
const appointmentRoutes=require("./routes/appointmentRoutes");
const cors = require('cors');

console.log("monogo connecting")
connectMongo();
console.log("monogo connecting")

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRoutes);
app.use("/api/doctor",doctorRoutes);
app.use("/api/consultation",consultationRoutes);
app.use("/api/appointment",appointmentRoutes);

app.use((req, res) => {
  res.end("hello from server");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
