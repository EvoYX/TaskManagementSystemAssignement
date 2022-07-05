import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React, { useEffect, useState } from "react";
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
import UpdateProfile from "./components/UpdateProfile";
import UserHome from "./components/UserHome";
import TMSContext from "./components/TMSContext";
import ViewMembers from "./components/admin/ViewMembers";
function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [accesstoken, setAccessToken] = useState("");
  const [loginUsername, setLoginUsername] = useState("");

  console.log(localStorage.getItem("setIsLoggedIn"));
  return (
    <>
      <TMSContext.Provider value={{ setLoggedIn, setIsAdmin }}>
        <div className="App">
          <BrowserRouter>
            {localStorage.getItem("setIsLoggedIn") == "true" && (
              <Header isAdmin={isAdmin}></Header>
            )}

            <Routes>
              <Route path="/" element={<GuestHome />} />
              <Route path="/login" element={<Login />} />

              <Route path="/home" element={<UserHome />} />
              <Route path="/admin/home" element={<AdminHome />} />

              <Route path="/admin/usermanagement" element={<UserManagment />} />
              <Route
                path="/admin/usermanagement/createuser"
                element={<CreateUser />}
              />
              <Route
                path="/admin/groupmanagement/viewgroup"
                element={<ViewMembers />}
              />
              <Route
                path="/admin/usermanagement/edituser"
                element={<EditUser />}
              />
              <Route
                path="/admin/groupmanagement"
                element={<GroupManagement />}
              />
              <Route path="/updateprofile" element={<UpdateProfile />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TMSContext.Provider>
    </>
  );
}

export default App;
