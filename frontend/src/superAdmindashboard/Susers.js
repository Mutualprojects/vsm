import React, { useEffect, useState } from "react";
import SearchIcon from "@rsuite/icons/Search";
import {
  InputGroup,
  Input,
  Modal,
  ButtonToolbar,
  toaster,
  Placeholder,
  Button,
} from "rsuite";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import Addemployee from "../pages/aadEmployee";
import { Dropdown, message, Skeleton } from "antd";
import Adduser from "../Admindashboard/Adduser";
import Userdetailsmodel from "../Admindashboard/Userdetailsmodel";
import { setUser } from "../redux/slice";
import Sheader from "./Sheader";

const Susers = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [cookies, setCookies] = useCookies(["token"]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // Redirect to signin if token is missing or user is not logged in
  useEffect(() => {
    // If no token, redirect to signin
    if (!cookies.token) {
      navigate("/signin");
      return; // Early return if token doesn't exist
    }

    // Fetch user data using token
    const GetUser = async () => {
      const response = await axios.post("http://127.0.0.1:8090/api/getuser", {
        token: cookies.token,
      });

      const getuserData = response.data;

      if (getuserData.data.message === "Invalid token") {
        alert("Invalid token");
        navigate("/signin");
      }

      dispatch(setUser(getuserData.data));
    };

    GetUser();
  }, [cookies.token, navigate, dispatch]);
  console.log("userfdghj", user);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [messageApi, contextHolder] = message.useMessage();

  const [employees, setEmployees] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [userid, setUserid] = useState("");

  const [viewmodel, setViewmodel] = useState(false);
  const handleviewopen = (value) => {
    setViewmodel(true);
    setUserid(value);
  };
  const handleviewclose = () => setViewmodel(false);

  const [deletemodal, setDeletemodal] = useState(false);
  const handledeleteopen = (value) => setDeletemodal(true);

  const handledeleteclose = () => setDeletemodal(false);

  // Fetch all employees from the backend
  const GetEmployees = async () => {
    setLoading(true);
    try {
      await axios.get("http://127.0.0.1:8090/api/getusers").then((response) => {
        setEmployees(response.data.data);
        setLoading(false);
      });
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  console.log("employees", user);

  // Handle search query change
  const handleQuerychange = async (value) => {
    setSearchQuery(value);

    if (value === "") {
      // If the search query is empty, fetch all employees
      GetEmployees();
    } else {
      // If there is a search query, fetch filtered employees based on query
      const response = await axios.post(
        "http://127.0.0.1:8090/api/getuserbyname",
        {
          query: value,
        }
      );

      setEmployees(response.data); // Update employees with search results
    }
  };

  useEffect(() => {
    GetEmployees(); // Fetch all employees when component mounts
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const items = [
    {
      label: "View",
      key: "view",
    },
    {
      label: "Delete",
      key: "delete",
    },
  ];

  const [username, setUsername] = useState("");

  const handleMenuClick = (value, id, name) => {
    // alert(id.key);
    // alert(value);
    // setClickedname(name);

    if (id.key === "view") {
      setViewmodel(true);
      setUserid(value);
      // setOpenmodal(true);
      // setEditid(value);
    } else {
      setDeletemodal(true);
      setUserid(value);
      setUsername(name);
    }
  };

  const handleUSerdelete = async () => {
    const response = await axios.delete(
      `http://127.0.0.1:8090/api/deleteuserbyid/${userid}`
    );
    if (response.data.success) {
      messageApi.open({
        type: "success",
        content: (
          <span>
            {`User\u00A0`}
            <strong style={{ fontWeight: "bold" }}>{username}</strong>{" "}
            {/* Highlight clickedname in red */}
            {`deleted`}
          </span>
        ),
      });
      // alert("User deleted");
      GetEmployees();
      handledeleteclose();
      if (user._id === userid) {
        navigate("/signin");
      }
    }
  };

  return (
    <div style={{}} className="">
      {contextHolder}
      <Sheader />
      <div className="lg:px-24 md:px-2 sm:px-2 w-full mt-28">
        <div className="font-bold font-sans text-2xl mt-3 w-full px-2">
          Users
        </div>

        <div className="lg:flex lg:flex-row lg:items-center lg:justify-between w-full mt-5 px-2">
          {/* Search Input and Add Employee Button */}
          <div className="flex flex-col md:flex-row lg:flex-row w-full mt-16 lg:mt-10">
            {/* Search Input */}
            <div className="lg:w-5/6 md:w-4/5 sm:w-full">
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
            {/* <div className="  lg:w-1/6 md:w-1/5 sm:w-full flex justify-end lg:mt-0 lg:block sm:hidden md:block hidden ">
              <button
                onClick={handleOpen}
                className="bg-blue-500 text-white py-2 px-4 w-full rounded-md hover:bg-blue-600"
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
            </div> */}
          </div>
        </div>

        {/* Add Employee Modal */}
        <Modal open={open} onClose={handleClose} className="bg-slate-400">
          <Modal.Header>
            <Modal.Title>
              <div className="font-bold text-center">Add a new Employee</div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Adduser handleClose={handleClose} Getemployees={GetEmployees} />
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>

        {/* Employee List */}

        {loading ? (
          <div className="pb-10 w-full mt-3 px-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <div className="shadow-sm rounded-md w-full p-2">
              <div className="w-full h-48 text-center ">
                <Skeleton.Image
                  active
                  className=" w-full"
                  style={{ width: "185px", height: "170px" }}
                />
              </div>
              <div>
                <Skeleton active />
              </div>
            </div>
            <div className="border rounded-md w-full p-2">
              <div className="w-full h-48 text-center ">
                <Skeleton.Image
                  active
                  className=" w-full"
                  style={{ width: "185px", height: "170px" }}
                />
              </div>
              <div>
                <Skeleton active />
              </div>
            </div>
            <div className="border rounded-md w-full p-2">
              <div className="w-full h-48 text-center ">
                <Skeleton.Image
                  active
                  className=" w-full"
                  style={{ width: "185px", height: "170px" }}
                />
              </div>
              <div>
                <Skeleton active />
              </div>
            </div>
            <div className="border rounded-md w-full p-2">
              <div className="w-full h-48 text-center ">
                <Skeleton.Image
                  active
                  className=" w-full"
                  style={{ width: "185px", height: "170px" }}
                />
              </div>
              <div>
                <Skeleton active />
              </div>
            </div>
            <div className="border rounded-md w-full p-2">
              <div className="w-full h-48 text-center ">
                <Skeleton.Image
                  active
                  className=" w-full"
                  style={{ width: "185px", height: "170px" }}
                />
              </div>
              <div>
                <Skeleton active />
              </div>
            </div>
          </div>
        ) : (
          <div className="  pb-10 px-2  mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {employees?.length > 0 &&
              employees
                .sort((a, b) => a.name.localeCompare(b.name)) // Sorting the employees by name
                .map((employee) => (
                  <div
                    key={employee._id}
                    className="bg-slate-100  rounded-lg overflow-hidden transform transition-transform duration-300  min-h-80"
                  >
                    {/* Profile Image Section */}
                    <div className="relative h-48  p-7">
                      <img
                        alt="profile"
                        src={employee.profile}
                        className="w-full h-full object-cover rounded-lg shadow-md cursor-pointer"
                        onClick={() => handleviewopen(employee._id)}
                      />
                    </div>

                    {/* Employee Info Section */}
                    <div className="px-4 pt-3 text-start space-y-2">
                      <h3 className="text-2xl font-semibold text-gray-800 truncate">
                        {employee.name}
                      </h3>
                      <p className="text-sm text-gray-600">{employee.email}</p>
                      <p className="text-sm text-gray-600">{employee.mobile}</p>
                      <p className="text-sm text-gray-600 font-medium">
                        {employee.empid}
                      </p>
                    </div>
                    <div className=" px-4 py-3 ">
                      <Dropdown
                        menu={{
                          items,
                          onClick: (e) =>
                            handleMenuClick(employee._id, e, employee.name),
                        }}
                        trigger={["click"]}
                      >
                        <button className="mt-3 py-1 px-2 border bg-slate-300 text-black rounded-md">
                          More..
                        </button>
                      </Dropdown>
                    </div>
                  </div>
                ))}
          </div>
        )}
        {!employees.length > 0 && (
          <div className="flex flex-col items-center justify-center w-full h-64   rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700">
              No Results Found
            </h2>
            <p className="text-gray-500 mt-2 text-center">
              Try adjusting your search or applying different filters to find
              what you're looking for.
            </p>
          </div>
        )}

        <Modal open={viewmodel} onClose={handleviewclose}>
          <Modal.Header>
            <Modal.Title className=" text-center"></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Userdetailsmodel id={userid} />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleviewclose} appearance="subtle">
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/*Delete modal */}
        <Modal open={deletemodal} onClose={handledeleteclose}>
          <Modal.Header>
            <Modal.Title>Delete User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            You are about to delete the User{" "}
            <div className=" inline-block font-bold">{username}</div> , are you
            sure?
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handledeleteclose} appearance="subtle">
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleUSerdelete}
              color="red"
              appearance="primary"
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Susers;