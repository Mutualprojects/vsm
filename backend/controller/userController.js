const bcrypt = require("bcryptjs");
const userModel = require("../models/Usermodel");

async function UserSignup(req, res) {
  try {
    const {
      name,
      password,
      email,
      profile,
      mobile,
      position,
      role,
      empid,
      primaryid,
    } = req.body;

    const user = await userModel.findOne({ email });

    if (user) {
      return res.json({
        message: "User already exists",
        success: false,
        error: true,
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
      name,
      email,
      password: hashedPassword,
      profile,
      role,
      mobile,
      position,
      empid,
      primaryid,
    };

    const saveUser = await userModel.create(newUser);

    return res.status(201).json({
      message: "User created successfully",
      success: true,
      data: saveUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

module.exports = UserSignup;
