const mongoose = require("mongoose");
const Address = require("../models/addressModel");
const getAddressById = async (req, res) => {
    try {
      // Extract the Address ID from the URL parameters
      const addressId = req.params.id;
      
      // console.log("inside get by ud")
      // Check if the provided ID is a valid MongoDB ObjectID
      if (!mongoose.Types.ObjectId.isValid(addressId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Address ID",
        });
      }
      //console.log("hiiii");
      const address = await Address.findById(addressId);
  
      console.log(address);
      if (address) {
        res.status(200).json({
          success: true,
          message: `Address with ${addressId} is fetched successfully`,
          data: address,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Address not found with the given id",
        });
      }
    } catch (error) {
      // Handle any server errors
      //console.error("Error fetching Address by id :", error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  };

  module.exports={
    getAddressById,
  }