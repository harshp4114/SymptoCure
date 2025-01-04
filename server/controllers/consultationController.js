const Consultation = require("../models/consultationModel"); // Import the User model
const mongoose = require("mongoose");

const getAllConsultations = async (req, res) => {
    try{
        const consultations=await Consultation.find();
        if(consultations){
            res.status(200).json({
                success: true,
                message: "All consultations fetched successfully",
                data: consultations,
              });
        }

    }catch (error) {
        res.status(500).json({
          success: false,
          message: "Failed to create consultation",
          error: error.message,
        });
      }
};

const getConsultationById = async (req, res) => {
    try {
      // Extract the consultation ID from the URL parameters
      const consultationId = req.params.id;
      // Check if the provided ID is a valid MongoDB ObjectID
      if (!mongoose.Types.ObjectId.isValid(consultationId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid consultation ID",
        });
      }
  
      const consultation = await Consultation.findById(consultationId);
      if (consultation) {
        res.status(200).json({
          success: true,
          message: `consultation with ${consultationId} is fetched successfully`,
          data: consultation,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "consultation not found with the given id",
        });
      }
    } catch (error) {
      // Handle any server errors
      console.error("Error fetching consultation by id :", error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  };

const createConsultation = async (req, res) => {

  try {
    const requiredFields = [
      "userId",
      "doctorId",
      "symptoms",
      "detectedDisease",
      "diagnosis",
      "prescription",
      "consultationNotes",
    ];
    console.log("hello");

    // Check if all required fields are present
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          message: `Missing required field: ${field}`,
        });
      }
    }

    // Create a new consultation
    const newConsultation = await Consultation.create({
      userId: req.body.userId,
      doctorId: req.body.doctorId,
      symptoms: req.body.symptoms,
      detectedDisease: req.body.detectedDisease,
      diagnosis: req.body.diagnosis,
      prescription: req.body.prescription,
      consultationNotes: req.body.consultationNotes,
      status: req.body.status,
      followUpDate: req.body.followUpDate,
    });
    // Return success response
    if (newConsultation) {
      return res.status(201).send("consultation created successfully ");
    } 
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create consultation",
      error: error.message,
    });
  }
};

const updateConsultation = async (req,res) => {
    try {
      const consultationId = req.params.id;
      const Info = req.body;
      // Check if the provided ID is a valid MongoDB ObjectID
      if (!mongoose.Types.ObjectId.isValid(consultationId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Consultation ID",
        });
      }
  
      const consultation = await Consultation.findByIdAndUpdate(consultationId, Info);
  
      if (consultation) {
        res.status(200).json({
          success: true,
          messages: "Consultation updated successfully",
        });
      } else {
        res.status(404).json({
          success: false,
          message: "No Consultation with the given id",
        });
      }
    } catch (error) {
      // Handle any server errors
      console.error("Error updating Consultation:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  };

const deleteConsultationById = async (req, res) => {
    try {
      // Extract the Consultation ID from the URL parameters
      const consultationId = req.params.id;
  
      // Check if the provided ID is a valid MongoDB ObjectID
      if (!mongoose.Types.ObjectId.isValid(consultationId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Consultation ID",
        });
      }
  
      // Find the Consultation by ID and delete them
      const consultation = await Consultation.findByIdAndDelete(consultationId);
  
      // If Consultation doesn't exist, return a 404 response
      if (!consultation) {
        return res.status(404).json({
          success: false,
          message: "Consultation not found",
        });
      }
  
      // Send a success response
      res.status(200).json({
        success: true,
        message: "Consultation deleted successfully",
        data: consultation, // Send the deleted Consultation details if needed
      });
    } catch (error) {
      // Handle any server errors
      console.error("Error deleting Consultation:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  };

module.exports = {
  getAllConsultations,
  createConsultation,
  deleteConsultationById,
  getConsultationById,
  updateConsultation,
};
