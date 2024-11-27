import React, { useEffect, useState, useMemo } from "react";
import { ButtonToolbar, Input, InputGroup, Modal, Placeholder } from "rsuite";
import SearchIcon from "@rsuite/icons/Search";
import "rsuite/dist/rsuite.min.css";
import Visitorprofile from "./Visitorprofile";
import Header from "../components/Header";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/slice";
import { Button, Dropdown, Select, Space } from "antd";
import Allvisitorspage from "./allvisitorspage";
import { DownOutlined } from "@ant-design/icons";
import AddVisitorPage from "../pages/Addvisitorpage";
import Profilepage from "../pages/Profilepage";
import Editvisitor from "./editvisitor";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [onChangepurpose, setOnChangepurpose] = useState("");
  const [cookies, setCookies] = useCookies(["token"]);
  const [latestpersons, setLatestpersons] = useState(null);
  const [searchTerm, setSearchitem] = useState("");
  const [visitors, setVisitors] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal state

  const [openmodal, setOpenmodal] = useState(false);
  const [deletemodal, setDeletemodal] = useState(false);
  const handleOpen = () => setOpenmodal(true);
  const handleClose = () => {
    setOpenmodal(false);
    setEditid("");
    setClickedname("");
  };
  const handledeleteClose = () => setDeletemodal(false);

  const [reloadVisitors, setReloadVisitors] = useState(false);

  const handleUserAdded = () => {
    setReloadVisitors((prev) => !prev); // Toggle to trigger refresh
  };

  // Use effect to prevent body scroll when modal is open and to handle width adjustments
  // useEffect(() => {
  //   if (isModalOpen) {
  //     // Add padding-right to prevent layout shift
  //     document.body.style.overflow = "hidden"; // Prevent body from scrolling
  //     const scrollbarWidth =
  //       window.innerWidth - document.documentElement.clientWidth;
  //     document.body.style.paddingRight = `${scrollbarWidth}px`; // Add space for scrollbar
  //   } else {
  //     document.body.style.overflow = "auto"; // Restore scrolling
  //     document.body.style.paddingRight = "0px"; // Reset padding-right
  //   }

  //   // Clean up by restoring scroll and padding when modal is closed
  //   return () => {
  //     document.body.style.overflow = "auto";
  //     document.body.style.paddingRight = "0px";
  //   };
  // }, [isModalOpen]);

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
      console.log("userdata", getuserData);
    };

    GetUser();
  }, [cookies.token, navigate, dispatch]);

  const getvisitors = async () => {
    await axios
      .get("http://127.0.0.1:8090/api/getvisitors")
      .then((response) => {
        setVisitors(response.data);
      });
  };

  useEffect(() => {
    getvisitors();
  }, []);

  // Filter pending users that haven't checked in or out
  // const pendingusers = visitors?.filter(
  //   (pvisitor) => !pvisitor.checkin || !pvisitor.checkout
  // );

  // Memoize the filtered search results to optimize performance
  const filteredVisitors = useMemo(() => {
    let filtered =  visitors?.filter(
      (pvisitor) => !pvisitor.checkin || !pvisitor.checkout
    );

    // Filter by search term
    if (searchTerm !== "") {
      filtered = filtered.filter((person) =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by purpose (Business/Personal)
    if (onChangepurpose) {
      filtered = filtered.filter(
        (person) => person.visitingpurpose === onChangepurpose
      );
    }

    return filtered;
  }, [searchTerm, visitors, onChangepurpose]);

  useEffect(() => {
    setLatestpersons(filteredVisitors);
  }, [filteredVisitors]);

  // Handle search term change
  const handleQuerychange = (value) => {
    setSearchitem(value);
  };

  // Dropdown onChange handler
  const onChangepurposeHandler = (value) => {
    setOnChangepurpose(value);
  };

  const visitingpurposeoptions = [
    { value: "Personal", label: "Personal" },
    { value: "Business", label: "Business" },
  ];

  // console.log("latest", latestpersons);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12; // Convert to 12-hour format
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Add leading zero if minutes are < 10
    return `${date.toLocaleDateString()} ${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  // Check-in and check-out buttons
  const handleCheckin = async (value) => {
    await axios.put(`http://127.0.0.1:8090/api/chekin/${value}`);
    alert("successfully checked in");
    handleUserAdded();
    getvisitors();
  };

  const handleCheckout = async (value) => {
    await axios.put(`http://127.0.0.1:8090/api/checkout/${value}`);
    alert("successfully checked out");
    handleUserAdded();
    getvisitors();
  };

  const items = [
    {
      label: "Edit",
      key: "edit",
    },
    {
      label: "Delete",
      key: "delete",
    },
  ];

  const [editid, setEditid] = useState("");
  const [clickedname, setClickedname] = useState("");

  const handleMenuClick = (value, id, name) => {
    // alert(id.key);
    // alert(value);
    setClickedname(name);

    if (id.key === "edit") {
      setOpenmodal(true);
      setEditid(value);
    } else {
      setDeletemodal(true);
      setEditid(value);
    }
  };

  const handleOk = async () => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8090/api/deletevisitor/${editid}`
      );

      const responseData = response.data;

      if (responseData.success) {
        alert("Visitor " + clickedname + " deleted");
        getvisitors();
        setDeletemodal(false);
        handleUserAdded();
      } else {
        alert(responseData.message);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className=" overflow-x-hidden">
      <Header Getvisitors={getvisitors} getload={handleUserAdded} />
      <div className="h-full w-full lg:px-28 md:px-2 sm:px-2 mb-16 pt-28">
        {/* Header Section */}
        <div className="px-2">
          <h1 className="font-bold text-2xl">Visitors</h1>
          <p className="text-gray-500">
            All the visitors that are currently on the premises
          </p>
        </div>
        {/* Search Input */}
        <div className="lg:flex lg:flex-row lg:items-center lg:justify-between w-full mt-5">
          {/* Search Input and Add Employee Button */}
          <div className="flex flex-col md:flex-row lg:flex-row w-full mt-16 lg:mt-1 gap-2">
            <div className="lg:w-4/5 md:w-4/6 sm:w-full ">
              <InputGroup style={{ width: "100%", height: 40 }}>
                <InputGroup.Addon className="bg-slate-100">
                  <SearchIcon />
                </InputGroup.Addon>
                <Input
                  className="bg-slate-100 w-full focus:outline-none"
                  placeholder="Search Visitors..."
                  onChange={handleQuerychange}
                />
              </InputGroup>
            </div>

            {/* Select Buttons */}
            <div className="flex flex-col  justify-between md:w-1/6 gap-2 md:flex-row lg:flex-row lg:w-1/5 md:pr-1 ">
              <div className="w-full">
                <Select
                  placeholder="Purpose"
                  optionFilterProp="label"
                  onChange={onChangepurposeHandler}
                  options={visitingpurposeoptions}
                  className="h-10 w-full"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Visitors profile */}
        <div className="">
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
            {latestpersons?.length > 0 ? (
              latestpersons
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by createdAt, descending
                .map((employee) => (
                  <div
                    key={employee._id}
                    className="bg-white rounded-lg pb-3 border overflow-hidden transform transition-all duration-300 hover:shadow-xl"
                  >
                    <div className="relative h-44 border-b-2 p-4">
                      <img
                        alt="profile"
                        src={employee.photo}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <div className="px-2 pt-1 text-start">
                      <div className=" flex flex-col justify-between items-start">
                        <h3 className="text-xl font-semibold text-gray-800 truncate">
                          {employee.name}
                        </h3>
                        <div className="bg-violet-200 px-2 rounded-md  text-secondary">
                          {employee.status}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mt-3">Visiting</div>
                      <div className="text-md text-gray-900">
                        {employee.visitingperson}
                      </div>
                      <div className="text-sm text-gray-600 mt-3">
                        Purpose of visit
                      </div>
                      <div className="text-md text-gray-900">
                        {employee.visitingpurpose}
                      </div>

                      <div className="text-sm text-gray-600 mt-3">
                        Created time
                      </div>
                      <div className="text-md text-gray-900">
                        {formatDate(employee.createdAt)}
                      </div>

                      <div className="flex flex-row gap-3">
                        {/* Check-in button */}
                        {!employee.checkin && (
                          <button
                            className="mt-3 p-2 rounded-md text-white bg-green-400"
                            onClick={() => handleCheckin(employee._id)}
                          >
                            Check in
                          </button>
                        )}

                        {/* Check-out button */}
                        {!employee.checkout && employee.checkin && (
                          <button
                            className="mt-3 p-2 bg-teal-400 rounded-md text-white"
                            onClick={() => handleCheckout(employee._id)}
                          >
                            Check out
                          </button>
                        )}

                        {/* Dropdown button */}
                        <Dropdown
                          menu={{
                            items,
                            onClick: (e) =>
                              handleMenuClick(employee._id, e, employee.name),
                          }}
                          trigger={["click"]}
                        >
                          <button className="mt-3 py-2 px-3 bi bi-three-dots border text-black rounded-md"></button>
                        </Dropdown>
                      </div>
                    </div>
                    <Modal open={deletemodal} onClose={handledeleteClose}>
                      <Modal.Header>
                        <Modal.Title>Delete Visitor</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <p>
                          You are about to delete the visitor, are you sure?
                        </p>
                      </Modal.Body>
                      <Modal.Footer className=" flex gap-3 justify-end">
                        {/* Cancel button to close modal */}
                        <Button onClick={handledeleteClose} appearance="subtle">
                          Cancel
                        </Button>

                        {/* Delete button */}
                        <button
                          onClick={handleOk} // Handle deletion
                          className="bg-red-600 text-white border px-3 py-1 rounded-md hover:bg-gray-400 hover:text-black" // Tailwind CSS classes for red button and text
                          appearance="primary"
                        >
                          Delete
                        </button>
                      </Modal.Footer>
                    </Modal>
                  </div>
                ))
            ) : (
              <div className="w-full text-center text-lg text-gray-500 p-2">
                No Visitors found.
              </div>
            )}
          </div>
        </div>
        <Modal
          size={"lg:calc(100% - 100px)"}
          open={openmodal}
          onClose={handleClose}
          className="lg:px-28 md:px-20 sticky"
        >
          <Modal.Header>
            <Modal.Title>
              <div className="font-bold text-center"> Edit visitor details</div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Editvisitor
              editid={editid}
              handleClose={handleClose}
              getvisitors={getvisitors}
              getload={handleUserAdded}
            />
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>

        {/* {deletemodal && (
          <Profilepage
            open={deletemodal}
            handleCancel={handledeleteClose}
            handleOk={handleOk}
          />
        )} */}
      </div>
      <hr />
      <Allvisitorspage getload={reloadVisitors} />
    </div>
  );
};

export default Home;
