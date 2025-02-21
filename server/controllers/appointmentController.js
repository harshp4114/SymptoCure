const Appointment = require("../models/appointmentModel"); // Import the User model
const mongoose = require("mongoose");
// const { create } = require("../models/consultationModel");

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    if (appointments) {
      return res.status(200).json({
        success: true,
        message: "All appointments fetched successfully",
        data: appointments,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
      error: error.message,
    });
  }
};

const getAppointmentsByDoctorId= async (req, res) => {

  const doctor=req.tokenData;
  try {
    // console.log("doc",doctor)
    const doctorId = doctor.id;
    const appointments = await Appointment.find({doctorId});
    // console.log("ustsy sincsakn",appointments)
    if (appointments) {
      return res.status(200).json({
        success: true,
        message: "All appointments fetched successfully",
        data: appointments,
      });
    }else{
      return res.status(404).json({
        success: false,
        message: "No appointments found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
      error: error.message,
    });
  }
}

const createAppointment = async (req, res) => {
  try {
    console.log("appointment body data",req.body)
    const { selectedDate, reason ,disease} = req.body;
    // //console.log(req.body);
    // //console.log(req.patient);
    const userId = req.tokenData.id;
    const doctorId = req.params.id;
    //console.log(selectedDate);

    const existingAppointment = await Appointment.findOne({
      userId,
      doctorId,
    });
    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: "Appointment already exists for this date",
      });
    }

    const appointment = new Appointment({
      userId,
      doctorId,
      date: selectedDate,
      reason,
      status: "pending",
    });
    //console.log(appointment);
    const newAppointment = await appointment.save();
    //console.log(newAppointment);
    if (newAppointment) {
      return res.status(201).json({
        success: true,
        message: "Appointment created successfully",
        data: newAppointment,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create appointment",
      error: error.message,
    });
  }
};

module.exports = {
  getAllAppointments,
  createAppointment,
  getAppointmentsByDoctorId,
};
