import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
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
  const [login, setLogin] = useState(false);
  return (
    <>
      <div className="App">
        {/* {login && <Header></Header>} */}
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<GuestHome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/home" element={<AdminHome />} />
            <Route
              path="/admin/groupmanagement"
              element={<GroupManagement />}
            />
            <Route path="/admin/usermanagement" element={<UserManagment />} />
            <Route
              path="/admin/usermanagement/createuser"
              element={<CreateUser />}
            />
            <Route
              path="/admin/usermanagement/edituser"
              element={<EditUser />}
            />
            <Route
              path="/admin/groupmanagement"
              element={<GroupManagement />}
            />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
