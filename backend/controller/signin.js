require("dotenv").config();
const jwt = require("jsonwebtoken");
const userModel = require("../models/Usermodel");
const bcrypt = require("bcryptjs");
const cors = require("cors");

// Configure CORS

async function USersign(req, res) {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password",
      });
    }

    console.log("JWT Secret:", "sdfghjkjhgfdsfghj");

    const existingUser = await userModel.findOne({ email });

    if (!existingUser) {
      return res.status(201).json({
        success: false,
        message: "Invalid credentials",
        error: true,
      });
    }

    const checkPassword = await bcrypt.compare(password, existingUser.password);

    if (!checkPassword) {
      return res.status(201).json({
        success: false,
        message: "Invalid credentials",
        error: true,
      });
    }

    const tokendata = {
      userId: existingUser._id,
      email: existingUser.email,
    };

    const token = jwt.sign(
      tokendata,
      process.env.JWT_SECRET
      //   , {
      //   expiresIn: "2m", // Set token expiration as needed
      // }
    );

    // Set token in a cookie
    const cookieOptions = {
      httpOnly: true, // Cookie cannot be accessed via JavaScript
      secure: process.env.NODE_ENV === "production", // Set to true in production
      sameSite: "None", // Necessary for cross-origin requests
      maxAge: 3600000, // Token expiration time (1 hour)
      // path: "/", // Ensure cookie is available across the entire domain
    };

    return res.status(200).cookie("token", token, cookieOptions).json({
      message: "Login successful",
      token: token,
      user: existingUser,
      success: true,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

module.exports = USersign;
