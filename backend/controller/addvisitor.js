const visitorModel = require("../models/VisitorModel");

async function Addvisitor(req, res) {
  const {
    name,
    mobile,
    address,
    visitingpurpose,
    visitingperson,
    photo,
    checkinTime,
    checkin,
    checkouttime,
    checkout,
    status,
  } = req.body;

  // Check for missing required fields
  if (
    !name ||
    !mobile ||
    !address ||
    !visitingperson ||
    !visitingpurpose ||
    !photo
  ) {
    return res.status(204).json({
      message: "All fields are required",
      success: false,
      error: true,
    });
  }

  try {
    // Create a new visitor object
    const newvisitor = {
      name,
      mobile,
      address,
      visitingpurpose,
      visitingperson,
      photo,
      checkinTime,
      checkin: false,
      checkouttime,
      checkout: false,
      status: "pending",
    };

    // Save the new visitor to the database
    const savevisitor = await visitorModel.create(newvisitor);

    // Send back the saved visitor data with a success message
    return res.status(201).json({
      message: "Visitor added successfully",
      visitor: savevisitor,
      success: true,
      error: false,
    });
  } catch (error) {
    // Catch and handle any errors
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while adding the visitor",
      error: error.message,
    });
  }
}

module.exports = Addvisitor;
