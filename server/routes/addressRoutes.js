const express = require("express");
const router = express.Router();
const {getAddressById}= require("../controllers/addressController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/:id",getAddressById);

module.exports = router;