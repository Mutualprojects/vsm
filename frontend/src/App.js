import logo from "./logo.svg";
import "./App.css";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useState, useEffect } from "react";
import Signin from "./pages/signinpage";

function App() {
  return (
    <div>
      <div>
     
        <Outlet />
      </div>
    </div>
  );
}

export default App;
