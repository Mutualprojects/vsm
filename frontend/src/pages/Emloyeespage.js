import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import SearchIcon from "@rsuite/icons/Search";
import { InputGroup, Input } from "rsuite";
import { Modal, Toggle, Button, ButtonToolbar, Placeholder } from "rsuite";
import axios from "axios";

const Emloyeespage = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [employees, setEmployees] = useState(null);

  const GetEmployees = async () => {
    await axios.get("http://127.0.0.1:8090/api/employees").then((response) => {
      setEmployees(response.data);
    });
  };

  useEffect(() => {
    GetEmployees();
  }, []);

  console.log("employees", employees);

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    mobile: "",
    empid: "",
    profile: "", // We'll store the binary data here
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle the file input change (convert image to binary format)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Convert the image file to base64 binary format (data URL)
        setFormData((prevState) => ({
          ...prevState,
          profile: reader.result, // Store the binary data (base64)
        }));
      };
      reader.readAsDataURL(file); // Reads the file as base64
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic here

    const response = await axios.post(
      "http://127.0.0.1:8090/api/regemployee",
      formData
    );

    const responseData = response.data;

    if (responseData.message === "employee already exist") {
      alert("employess already exist ");
    }

    if (responseData.success) {
      alert("user Created Successfully");
      GetEmployees();
    }

    console.log("Form Submitted:", formData);
    handleClose(); // Close the modal after submitting
  };

  return (
    <div style={{ height: "200vh" }} className="pt-28">
      <Header />
      <div className="lg:px-28 md:px-2 sm:px-2 w-full">
        <div className="font-bold font-sans text-2xl mt-3 w-full">
          Employees
        </div>

        <div className="lg:flex lg:flex-row lg:items-center lg:justify-between  w-full mt-5">
          {/* Search Input and Add Employee Button Container */}
          <div className="flex flex-col md:flex-row lg:flex-row w-full mt-16 lg:mt-10">
            {/* Search Input */}
            <div className="lg:w-5/6 md:w-4/5 sm:w-full pr-4">
              <InputGroup className="" style={{ width: "100%", height: 40 }}>
                <InputGroup.Addon className="bg-slate-100">
                  <SearchIcon />
                </InputGroup.Addon>
                <Input
                  className="bg-slate-100 w-full focus:outline-none"
                  placeholder="Search Employees..."
                />
              </InputGroup>
            </div>

            {/* Add Employee Button */}
            <div className="lg:w-1/6 md:w-1/5 sm:w-full flex justify-start  lg:mt-0 lg:block sm:hidden md:block hidden ">
              <button
                onClick={handleOpen}
                className="bg-blue-500 text-white  py-2 px-4 rounded-md hover:bg-blue-600"
                style={{ marginTop: 0, height: 38 }}
              >
                Add Employee
              </button>
            </div>
            <div className="lg:w-1/6 md:w-1/5 sm:w-full flex justify-start  lg:mt-0 lg:hidden md:hidden sm:block ">
              <ButtonToolbar
                onClick={handleOpen}
                className="bg-blue-500 text-white  py-2 px-4 rounded-md hover:bg-blue-600"
                style={{ marginTop: 10, height: 38 }}
              >
                Add Employee
              </ButtonToolbar>
            </div>
          </div>
        </div>
      </div>

      {/*Add Employee Modal */}

      {/* <hr /> */}

      <Modal open={open} onClose={handleClose} className="bg-sky-300">
        <Modal.Header>
          <Modal.Title>
            <div className="font-bold">Add a New Employee</div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            {/* Empid Field */}
            <dl className="mb-4">
              <dt className="text-sm">Employee id</dt>
              <dd>
                <input
                  type="number"
                  name="empid"
                  value={formData.empid}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </dd>
            </dl>

            {/* Name Field */}
            <dl className="mb-4">
              <dt className="text-sm">Name</dt>
              <dd>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </dd>
            </dl>

            {/* Email Field */}
            <dl className="mb-4">
              <dt className="text-sm">Email</dt>
              <dd>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </dd>
            </dl>

            {/* Mobile Field */}
            <dl className="mb-4">
              <dt className="text-sm">Mobile</dt>
              <dd>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </dd>
            </dl>

            {/* Profile Picture Field */}
            <dl className="mb-4">
              <dt className="text-sm">Profile Picture</dt>
              <dd>
                <input
                  type="file"
                  name="profile"
                  onChange={handleFileChange} // Handle file input
                  className="w-full px-3 py-2 border rounded-md"
                />
              </dd>
            </dl>
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

      <div className="flex justify-evenly">
        {employees?.map((employee) => (
          <div key={employee._id} className="card">
            <img
              className="w-24 h-24 rounded-full object-cover flex justify-center align-content-center"
              alt="gh"
              src={employee.profile}
            ></img>
            <div>
              <h5>Name:{employee.name}</h5>
              <h5>Email:{employee.email}</h5>
              <p>Employ ID:{employee.empid}</p>
              <p>Mobile NO:{employee.mobile}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Emloyeespage;
