import React, { useEffect } from "react";
import { SelectPicker } from "rsuite";
import { Input, InputGroup } from "rsuite";
import SearchIcon from "@rsuite/icons/Search";
import "rsuite/dist/rsuite.min.css";

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

  // const styles = {
  //   marginBottom: 10,
  //   height: 40,
  //   width: 700,
  // };
  const data = ["Checked-In", "Pending"].map((item) => ({
    label: item,
    value: item,
  }));
  const styles1 = { width: 224, display: "block", marginBottom: 10 };
  const data1 = ["Business", "Personal", "interview"].map((item) => ({
    label: item,
    value: item,
  }));

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

          <div className="w-full hidden lg:block md:w-full">
            <InputGroup className=" md:w-full" style={{ width: "100%" }}>
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
            <SelectPicker
              size="md"
              placeholder="Status"
              data={data}
              style={styles1}
            />

            <SelectPicker
              size="md"
              placeholder="Purpose"
              data={data1}
              style={styles1}
            />
          </div>
        </div>
        <Visitorprofile />
      </div>
    </div>
  );
};

export default Home;
