const { request, response } = require("express");
const getuserDetailsfromtoken = require("./ActivatonToken");

// Controller function to handle user details request
async function userDetailsController(req, res) {
  try {
    // Get token from the request cookies
    const { token } = req.body; // Make sure the token is in the cookies

    // If no token is provided, return a 401 Unauthorized response

    // Retrieve user details from token
    const user = await getuserDetailsfromtoken(token);

    // If everything is fine, send user details back
    return res.status(200).json({
      success: true,
      message: "User details retrieved successfully",
      data: user, // This will be the user object (without password)
    });
  } catch (error) {
    console.error("Error in userDetailsController:", error);
    return res.status(500).json({
      message: error.message || "Something went wrong",
      error: true,
    });
  }
}

module.exports = userDetailsController;
