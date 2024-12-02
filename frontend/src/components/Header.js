import React, { useState, useEffect, useRef } from "react";
import logo from "./../images/new logo blue.png";
import { BsList } from "react-icons/bs";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Drawer, message } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { CgProfile } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/slice";
import { useCookies } from "react-cookie";
import { Button, ButtonToolbar, Modal } from "rsuite";
import Addvisitorpage from "../pages/Addvisitorpage";
import { RiDashboardHorizontalFill } from "react-icons/ri";
import MemberIcon from "@rsuite/icons/Member";
import PlusRoundIcon from "@rsuite/icons/PlusRound";

const Header = ({ Getvisitors, getload }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // Get the current route location
  const user = useSelector((state) => state.user);

  console.log("userdfghj", user);

  const profileRef = useRef(null); // Ref for profile icon and dropdown
  const dropdownRef = useRef(null); // Ref for the dropdown menu

  const showDrawer = () => setOpen(true);
  const onCloseDrawer = () => setOpen(false);
  const [cookies, setCookies, removieCookie] = useCookies();

  const [openmodal, setOpenmodal] = useState(false);
  const handleOpen = () => setOpenmodal(true);
  const handleClose = () => setOpenmodal(false);

  const handleToggle = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleLogout = () => {
    removieCookie("token");
    dispatch(
      setUser({
        _id: "",
        name: "",
        email: "",
        token: "",
      })
    );
    navigate("/signin");
  };

  const [messageApi, contextHolder] = message.useMessage();
  const added = () => {
    messageApi.open({
      type: "success",
      content: "Visitor Added successfully",
    });
  };

  // Close profile dropdown when on the profile page
  useEffect(() => {
    if (location.pathname === "/profile") {
      setIsOpen(false); // Close the dropdown when on the profile page
    }
  }, [location.pathname]);

  // Close dropdown when clicking outside the profile or dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false); // Close the dropdown if clicked outside
      }
    };

    // Add event listener for clicks outside
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleaddvisitor = () => {
    handleOpen();
    onCloseDrawer();
  };

  return (
    <div
      className="bg-neutral-300 fixed-top"
      style={{ zIndex: 1000, height: "100px" }}
    >
      {contextHolder}
      <div
        className="lg:px-16 md:px-3  pt-3 pb-1 mb-4"
        style={{ position: "relative" }}
      >
        <header className="flex justify-between items-center mx-2">
          {/* Logo Section */}
          <div className=" w-44 h-16">
            <Link to="/">
              <img
                src={logo}
                alt="Company Logo"
                className=" w-full h-full"
                // width="200"
                // height="200"
                style={{ display: "block" }}
              />{" "}
            </Link>
          </div>

          {/* Navigation & Profile */}
          <div className="flex justify-between items-center gap-4 sm:gap-6 lg:gap-10">
            {/* Navigation Links for Large Screens */}
            <div className="hidden lg:flex gap-10 items-center">
              <Link
                to="/"
                className={
                  location.pathname === "/" ? "text-blue-500" : "text-gray-700"
                }
                style={{ textDecoration: "none" }}
              >
                <div className="flex items-center gap-1">
                  <RiDashboardHorizontalFill />
                  {/* Conditionally apply text color, font weight, and bottom border to the text */}
                  <span
                    className={
                      location.pathname === "/"
                        ? " text-blue-500 border-b-2   border-blue-500"
                        : "text-gray-700"
                    }
                  >
                    Dashboard
                  </span>
                </div>
              </Link>

              <Link
                to="/employees"
                className={
                  location.pathname === "/employees"
                    ? "text-blue-500"
                    : "text-gray-700"
                }
                style={{ textDecoration: "none" }}
              >
                <div className="flex items-center gap-1">
                  <MemberIcon />
                  {/* Conditionally apply the text color, font weight, and border to the text */}
                  <span
                    className={
                      location.pathname === "/employees"
                        ? "text-blue-500  border-b-2 border-blue-500"
                        : "text-gray-700"
                    }
                  >
                    Employees
                  </span>
                </div>
              </Link>
              <div
                className="cursor-pointer"
                onClick={handleOpen} // Open Add Visitor modal
              >
                <button
                  appearance="primary"
                  color=""
                  className="flex  gap-1 px-2 border py-1 items-center rounded-md bg-emerald-500   text-white "
                >
                  <PlusRoundIcon /> <span>Add-visitor</span>
                </button>
              </div>
            </div>
            {/* Profile Section */}
            <div className="cursor-pointer" ref={profileRef}>
              {/* Profile Icon */}

              {user.profile ? (
                <img
                  width="40px"
                  height="40px"
                  className=" rounded-circle"
                  onClick={handleToggle}
                  src={user.profile}
                  alt="profile"
                ></img>
              ) : (
                <CgProfile size={30} onClick={handleToggle} />
              )}
              {/* <CgProfile size={30} onClick={handleToggle} /> */}

              {/* Dropdown Menu */}
              {isOpen && (
                <div
                  className="absolute bg-slate-200 py-1 gap-5 rounded-md px-3 top-16 end-5 shadow-lg transition-all duration-200 ease-in-out"
                  ref={dropdownRef}
                >
                  <div
                    className="cursor-pointer hover:bg-slate-300 px-2 py-1 rounded-md"
                    onClick={() => {
                      setIsOpen(false); // Close the dropdown when "Profile" is clicked
                    }}
                  >
                    <Link to="/profile">Profile</Link> {/* Link to Profile */}
                  </div>
                  <div
                    className="cursor-pointer hover:bg-slate-300 px-2 py-1 rounded-md"
                    onClick={handleLogout}
                  >
                    Logout
                  </div>
                </div>
              )}
            </div>

            {/* Drawer for Mobile Navigation */}
            <div className="lg:hidden">
              <BsList size={35} onClick={showDrawer} />
              <Drawer
                title={
                  <div className="flex justify-between items-center w-full">
                    <span>Navigation</span>
                    <CloseOutlined
                      onClick={onCloseDrawer}
                      style={{ fontSize: "18px", cursor: "pointer" }}
                    />
                  </div>
                }
                placement="right"
                closable={false}
                onClose={onCloseDrawer}
                open={open}
                width={300}
              >
                <div className="flex flex-col gap-4">
                  <Link
                    to="/"
                    className={
                      location.pathname === "/"
                        ? "text-blue-500"
                        : "text-gray-700"
                    }
                    style={{ textDecoration: "none" }}
                  >
                    <div className="flex items-center gap-2">
                      {/* Conditionally apply text color, font weight, and bottom border to the text */}
                      <span
                        className={
                          location.pathname === "/"
                            ? " text-blue-500 border-b-2 border-blue-500"
                            : "text-gray-700"
                        }
                      >
                        Dashboard
                      </span>
                    </div>
                  </Link>
                  <Link
                    to="/employees"
                    className={
                      location.pathname === "/employees"
                        ? "text-blue-500"
                        : "text-gray-700"
                    }
                    style={{ textDecoration: "none" }}
                  >
                    <div className="flex items-center gap-2">
                      {/* Conditionally apply the text color, font weight, and border to the text */}
                      <span
                        className={
                          location.pathname === "/employees"
                            ? "text-blue-500  border-b-2 border-blue-500"
                            : "text-gray-700"
                        }
                      >
                        Employees
                      </span>
                    </div>
                  </Link>
                  <div
                    className="cursor-pointer"
                    onClick={handleaddvisitor} // Open modal
                  >
                    <button
                      appearance="primary"
                      color=""
                      className="flex  gap-1 px-2 border py-1 items-center rounded-md bg-emerald-500   text-white "
                    >
                      <PlusRoundIcon /> <span>Add-visitor</span>
                    </button>
                  </div>
                </div>
              </Drawer>
            </div>
          </div>
        </header>

        {/* Add Modal For Add Visitor */}
        <Modal
          size={"lg:calc(100% - 100px)"}
          open={openmodal}
          onClose={handleClose}
          className="lg:px-28 md:px-20 sticky"
        >
          <Modal.Header>
            <Modal.Title>
              <div className="font-bold text-center"> Add a New Visitor</div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Addvisitorpage
              handleClose={handleClose}
              Getvisitors={Getvisitors}
              getload={getload}
              added={added}
            />
          </Modal.Body>
        </Modal>

        {/* CSS for Active Link Styling */}
        <style>
          {`
            .active-link {
              color: #1890ff;
              border-bottom: 2px solid #1890ff;
            }
            .active-link:hover {
              color: #40a9ff;
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default Header;
