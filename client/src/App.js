import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import GuestHome from "./components/GuestHome";
import Login from "./components/Login";
import Header from "./components/Header";
import AdminHome from "./components/admin/AdminHome";
import UserManagment from "./components/admin/UserManagment";
import CreateUser from "./components/admin/CreateUser";
import EditUser from "./components/admin/EditUser";
import GroupManagement from "./components/admin/GroupManagement";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GuestHome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/home" element={<AdminHome />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
