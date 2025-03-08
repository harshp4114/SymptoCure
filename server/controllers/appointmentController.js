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

const getAppointmentsByDoctorId = async (req, res) => {
  const doctor = req.tokenData;
  try {
    // console.log("doc",doctor)
    const doctorId = doctor.id;
    const appointments = await Appointment.find({ doctorId });
    // console.log("ustsy sincsakn",appointments)
    if (appointments) {
      return res.status(200).json({
        success: true,
        message: "All appointments fetched successfully",
        data: appointments,
      });
    } else {
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
};

const createAppointment = async (req, res) => {
  try {
    console.log("appointment body data",req.body)
    const { selectedDate, reason, disease } = req.body;
    // console.log(req.body);
    // console.log("req ma pt",req.patient);
    const userId = req.tokenData.id;
    const doctorId = req.params.id;
    //console.log(selectedDate);

    const existingAppointment = await Appointment.findOne({
      userId,
      doctorId,
      status: { $ne: "rejected" },
    });

    console.log("existing appointment", existingAppointment);
    if (existingAppointment) {
      if (existingAppointment.status === "pending") {
        return res.status(400).json({
          success: false,
          message: "Appointment pending with the doctor. Please wait"
        });
      } else if (existingAppointment.status === "approved") {
        return res.status(400).json({
          success: false,
          message: "Appointment already exists with the doctor",
        });
      }
    }

    const appointment = new Appointment({
      userId,
      doctorId,
      date: selectedDate,
      reason,
      disease: disease,
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

const updateAppointment = async (req, res) => {
  try {
    const { status } = req.body;
    const appointmentId = req.params.id;
    const appointment = await Appointment.findById(appointmentId);
    if (appointment) {
      appointment.status = status;
      const updatedAppointment = await appointment.save();
      if (updatedAppointment) {
        return res.status(200).json({
          success: true,
          message: "Appointment updated successfully",
          data: updatedAppointment,
        });
      }
    } else {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update appointment",
      error: error.message,
    });
  }
};

module.exports = {
  updateAppointment,
  getAllAppointments,
  createAppointment,
  getAppointmentsByDoctorId,
};
