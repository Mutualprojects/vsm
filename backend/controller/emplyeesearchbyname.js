const employeeModel = require("../models/Employeemodel");

async function Employeesearchbyname(req, res) {
  const { query } = req.body;

  try {
    const users = await employeeModel.find({
      name: { $regex: query, $options: "i" },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error during search:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while searching for users." });
  }
}

module.exports = Employeesearchbyname;
