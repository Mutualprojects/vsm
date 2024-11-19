import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import SearchIcon from "@rsuite/icons/Search";
import { InputGroup, Input, Modal, Button, ButtonToolbar } from "rsuite";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCookies } from "react-cookie";

const Emloyeespage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [cookies] = useCookies(["token"]);

  // Redirect to signin if token is missing or user is not logged in
  useEffect(() => {
    if (!cookies.token || !user.name) {
      navigate("/signin");
    }
  }, [cookies.token, user.name, navigate]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    empid: "",
    profile: "",
  });


  // Fetch all employees from the backend
  const GetEmployees = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8090/api/employees");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // Handle search query change
  const handleQuerychange = async (value) => {
    setSearchQuery(value);

    if (value === "") {
      // If the search query is empty, fetch all employees
      GetEmployees();
    } else {
      // If there is a search query, fetch filtered employees based on query
      const response = await axios.post(
        "http://127.0.0.1:8090/api/searchemployee",
        {
          query: value,
        }
      );

      console.log("employee", response.data);

      setEmployees(response.data); // Update employees with search results
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value, // Dynamically update the corresponding field in the state
    }));
  };

  // Handle file input change (profile picture)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevState) => ({
          ...prevState,
          profile: reader.result, // Store base64 string
        }));
      };
      reader.readAsDataURL(file); // Read the file as base64
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8090/api/regemployee",
        formData
      );
      const responseData = response.data;

      if (responseData.message === "employee already exists") {
        alert("Employee already exists.");
      }

      if (responseData.success) {
        alert("Employee created successfully!");
        GetEmployees(); // Refresh employee list
        setFormData({
          name: "",
          email: "",
          mobile: "",
          empid: "",
          profile: "",
        });
        handleClose(); // Close modal after submission
      }
    } catch (error) {
      console.error("Error creating employee:", error);
    }
  };

  useEffect(() => {
    GetEmployees(); // Fetch all employees when component mounts
  }, []);

  return (
    <div style={{ height: "200vh" }} className="pt-28">
      <Header />

      <div className="lg:px-28 md:px-2 sm:px-2 w-full">
        <div className="font-bold font-sans text-2xl mt-3 w-full">
          Employees
        </div>

        <div className="lg:flex lg:flex-row lg:items-center lg:justify-between w-full mt-5">
          {/* Search Input and Add Employee Button */}
          <div className="flex flex-col md:flex-row lg:flex-row w-full mt-16 lg:mt-10">
            {/* Search Input */}
            <div className="lg:w-5/6 md:w-4/5 sm:w-full pr-4">
              <InputGroup style={{ width: "100%", height: 40 }}>
                <InputGroup.Addon className="bg-slate-100">
                  <SearchIcon />
                </InputGroup.Addon>
                <Input
                  className="bg-slate-100 w-full focus:outline-none"
                  placeholder="Search Employees..."
                  value={searchQuery} // Bind the input to searchQuery state
                  onChange={handleQuerychange} // Handle change
                />
              </InputGroup>
            </div>

            {/* Add Employee Button (unchanged code) */}
            <div className="lg:w-1/6 md:w-1/5 sm:w-full flex justify-start lg:mt-0 lg:block sm:hidden md:block hidden ">
              <button
                onClick={handleOpen}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                style={{ marginTop: 0, height: 38 }}
              >
                Add Employee
              </button>
            </div>
            <div className="lg:w-1/6 md:w-1/5 sm:w-full flex justify-start lg:mt-0 lg:hidden md:hidden sm:block ">
              <ButtonToolbar
                onClick={handleOpen}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                style={{ marginTop: 10, height: 38 }}
              >
                Add Employee
              </ButtonToolbar>
            </div>
          </div>
        </div>

        {/* Add Employee Modal */}
        <Modal open={open} onClose={handleClose}>
          <Modal.Header>
            <Modal.Title>
              <div className="font-bold">Add a New Employee</div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit}>
              {/* Employee fields */}
              <input
                type="number"
                name="empid"
                value={formData.empid}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Employee ID"
                required
              />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Name"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Email"
                required
              />
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Mobile"
                required
              />
              <input
                type="file"
                name="profile"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleClose} appearance="subtle">
              Cancel
            </Button>
            <Button type="submit" onClick={handleSubmit} appearance="primary">
              Save
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Employee List */}
        <div>
          {employees?.length > 0 ? (
            employees.map((employee) => (
              <div key={employee._id}>
                <img alt="profile" src={employee.profile} />
                <div>{employee.name}</div>
                <div>{employee.email}</div>
                <div>{employee.mobile}</div>
                <div>{employee.empid}</div>
              </div>
            ))
          ) : (
            <div>No employees found.</div> // Message when no employees are found
          )}
        </div>
      </div>
    </div>
  );
};

export default Emloyeespage;
