import React, { useEffect } from "react";
import { ButtonToolbar, Input, InputGroup } from "rsuite";
import SearchIcon from "@rsuite/icons/Search";
import "rsuite/dist/rsuite.min.css";
import { Dropdown } from "rsuite";
import Visitorprofile from "./Visitorprofile";

import Header from "../components/Header";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  console.log("user", user);

  const Checkuser = () => {
    if (user._id === "") {
      navigate("/signin");
    }
  };

  useEffect(() => {
    Checkuser();
  });

  const styles = {
    marginBottom: 10,
    height: 40,
    width: 700,
  };

  const CustomDropdown = ({ ...props }) => (
    <div className="w-full md:w-48">
      <Dropdown {...props} className="bg-slate-100 w-full mb-2">
        <Dropdown.Item className="bg-slate-200 p-2 w-full rounded">
          <Input className="w-full" placeholder="Search Here" />
        </Dropdown.Item>
        <Dropdown.Item>Checked-IN</Dropdown.Item>
        <Dropdown.Item>Pending...</Dropdown.Item>
      </Dropdown>
    </div>
  );

  const Purpose = ({ ...props }) => (
    <Dropdown {...props} className="w-full md:w-48 bg-slate-100">
      <Dropdown.Item>
        <Input className="w-full" placeholder="Search Here" />
      </Dropdown.Item>
      <Dropdown.Item>Business</Dropdown.Item>
      <Dropdown.Item>Personal</Dropdown.Item>
    </Dropdown>
  );

  return (
    <div className=" pt-28">
      <Header />
      <div
        className="h-full w-full lg:px-28 md:px-2 sm:px-2 "
        style={{ height: "200vh" }}
      >
        {/* Header Section */}
        <div className=" ">
          <h1 className="font-bold text-2xl">Visitors</h1>
          <p className="text-gray-500">
            All the visitors that are currently on the premises
          </p>
        </div>

        {/* Main Section for Search and Dropdowns */}
        <div className="mt-4  flex  justify-between flex-col lg:flex-row gap-4 ">
          {/* Search Input */}
          <div className="w-full px-2  lg:hidden md:w-96">
            <InputGroup className="" style={{ width: 350 }}>
              <InputGroup.Addon className="bg-slate-100">
                <SearchIcon />
              </InputGroup.Addon>
              <Input
                className="bg-slate-100 w-full"
                placeholder="Search visitors..."
              />
            </InputGroup>
          </div>

          <div className="w-full hidden lg:block md:w-96">
            <InputGroup className="" style={{ width: 700 }}>
              <InputGroup.Addon className="bg-slate-100">
                <SearchIcon />
              </InputGroup.Addon>
              <Input
                className="bg-slate-100 w-full"
                placeholder="Search visitors..."
              />
            </InputGroup>
          </div>

          {/* Dropdown Section */}
          <div className="flex flex-col  md:flex-row md:justify-around gap-4 px-2 md:w-96 ">
            {/* Status Dropdown */}
            <ButtonToolbar className="w-full md:w-48  ">
              <CustomDropdown title="Status" trigger={["click", "hover"]} />
            </ButtonToolbar>

            {/* Purpose Dropdown */}
            <ButtonToolbar className="w-full md:w-48 ">
              <Purpose title="Purpose" trigger={["click", "hover"]} />
            </ButtonToolbar>
          </div>
        </div>
        <Visitorprofile />
      </div>
    </div>
  );
};

export default Home;
