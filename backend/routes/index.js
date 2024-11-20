require("dotenv").config();

const express = require("express");
const USersign = require("../controller/signin");
const verifyTokenAndCheckActivation = require("../controller/ActivatonToken"); // Import the middleware
const userDetailsController = require("../controller/getuser");
const RegisterEmployee = require("../controller/regemployee");
const GetEmployees = require("../controller/getemployees");
const Employeesearchbyname = require("../controller/emplyeesearchbyname");
const UserSignup = require("../controller/userController");
const Addvisitor = require("../controller/addvisitor");
const Getvisitors = require("../controller/getvisitore");
const Getvisitorsbyname = require("../controller/Getvisitorsearchbyname");

const router = express.Router();

router.post("/register", UserSignup);
router.post("/login", USersign);

router.post("/getuser", userDetailsController);

router.post("/regemployee", RegisterEmployee);

router.get("/employees", GetEmployees);

router.post("/searchemployee", Employeesearchbyname);

//add visitor
router.post("/addvisitor", Addvisitor);

//get Visitors list
router.get("/getvisitors", Getvisitors);

//get visitor by name
router.post("/searchvisitorbyname", Getvisitorsbyname);

module.exports = router;
