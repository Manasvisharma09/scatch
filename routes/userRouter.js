const express = require("express");
const router = express.Router();
//const Joi = require("joi");
//const userModel = require("../models/user-model");
const {registerUser,loginUser,logout}=require("../controllers/authController")

// Test route
router.get("/", function (req, res) {
  res.send("hey, it's working");
});


router.post("/register", registerUser);
router.post("/login",loginUser);
router.get("/logout",logout);
  


module.exports = router;
