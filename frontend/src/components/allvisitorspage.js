import React, { useEffect, useState, useMemo } from "react";
import { Input, InputGroup } from "rsuite";
import SearchIcon from "@rsuite/icons/Search";
import { Select } from "antd";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/slice";
import { useNavigate } from "react-router-dom";

const Allvisitorspage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [onChangepurpose, setOnChangepurpose] = useState("");
  const [cookies, setCookies] = useCookies(["token"]);
  const [latestpersons, setLatestpersons] = useState([]);
  const [searchTerm, setSearchitem] = useState("");
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    if (!cookies.token) {
      navigate("/signin");
      return;
    }

    // Fetch user data
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

  const getvisitors = async () => {
    setLoading(true); // Set loading state to true when starting the fetch
    await axios
      .get("http://127.0.0.1:8090/api/getvisitors")
      .then((response) => {
        setVisitors(response.data);
        setLoading(false); // Set loading state to false when data is fetched
      });
  };

  useEffect(() => {
    getvisitors();
  }, []);

  const filteredVisitors = useMemo(() => {
    let filtered = visitors;
    if (searchTerm) {
      filtered = filtered.filter((person) =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (onChangepurpose) {
      filtered = filtered.filter(
        (person) => person.visitingpurpose === onChangepurpose
      );
    }
    return filtered;
  }, [searchTerm, onChangepurpose, visitors]);

  useEffect(() => {
    setLatestpersons(filteredVisitors);
  }, [filteredVisitors]);

  const handleQuerychange = (value) => {
    setSearchitem(value);
  };

  const onChangepurposeHandler = (value) => {
    setOnChangepurpose(value);
  };

  const visitingpurposeoptions = [
    { value: "Personal", label: "Personal" },
    { value: "Business", label: "Business" },
  ];

  return (
    <div>
      <div
        className="h-full w-full lg:px-28 md:px-2 sm:px-2 "
        style={{ height: "200vh" }}
      >
        <div className="px-2">
          <h1 className="font-bold text-2xl mt-4">Visitors history</h1>
        </div>

        {/* Search Input */}
        <div className="lg:flex lg:flex-row lg:items-center px-2 lg:justify-between w-full mt-5">
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

            <div className="w-full lg:w-1/5 md:w-1/5">
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

        {/* Loading indicator */}
        {loading ? (
          <div className="text-center mt-8">Loading visitors...</div>
        ) : (
          <div className="px-2 mt-3 overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Profile</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Mobile</th>
                  <th className="px-4 py-2 text-left">Emp ID</th>
                  <th className="px-4 py-2 text-left">Check-in Status</th>
                  <th className="px-4 py-2 text-left">Visiting Purpose</th>
                </tr>
              </thead>
              <tbody>
                {latestpersons?.length > 0 ? (
                  latestpersons.map((employee) => (
                    <tr key={employee._id} className="border-b">
                      <td className="px-4 py-2">
                        <img
                          alt="profile"
                          src={employee.photo}
                          className="w-12 h-12 object-cover rounded-full"
                        />
                      </td>
                      <td className="px-4 py-2">{employee.name}</td>
                      <td className="px-4 py-2">{employee.email}</td>
                      <td className="px-4 py-2">{employee.mobile}</td>
                      <td className="px-4 py-2">{employee.empid}</td>
                      <td className="px-4 py-2">
                        {employee.checkin === false
                          ? "Not Checked In"
                          : "Checked In"}
                      </td>
                      <td className="px-4 py-2">{employee.visitingpurpose}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center px-4 py-2 text-lg text-gray-500"
                    >
                      No employees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Allvisitorspage;