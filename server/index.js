const express = require("express");
const { connectMongo } = require("./config");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const ConsultationRoutes=require("./routes/consultationRoutes")

connectMongo();

const app = express();
const PORT = 5000;

app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/doctor",doctorRoutes);
app.use("/api/consultation/",ConsultationRoutes);

app.use((req, res) => {
  res.end("hello from server");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
