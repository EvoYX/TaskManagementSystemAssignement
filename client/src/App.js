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
import ApplicationView from "./components/ApplicationView";
import alertify from "alertifyjs";
import userService from "./services/user.service";

import "./alertify/css/themes/bootstrap.css";
import ApplicationDetail from "./components/ApplicationDetail";
import CreateApplication from "./components/CreateApplication";
import EditApplication from "./components/EditApplication";
import ApplicationDashboard from "./components/ApplicationDashboard";

function App() {
  const [loggedIn, setLoggedIn] = useState(undefined);
  const [isAdmin, setIsAdmin] = useState(false);
  const [accesstoken, setAccessToken] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [isAuthorised, setIsAuthorised] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("setIsLoggedIn");
    if (user) {
      setLoggedIn(user);
    }
  }, setLoggedIn);

  return (
    <>
      <TMSContext.Provider value={{ setLoggedIn, setIsAdmin }}>
        <div className="App">
          <BrowserRouter>
            {localStorage.getItem("setIsLoggedIn") == "true" && loggedIn && (
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
              <Route
                path={"/home/applications"}
                element={<ApplicationView />}
              />
              <Route
                path={`/home/applications/detail`}
                element={<ApplicationDetail />}
              ></Route>
              <Route
                path="/application/createApplication"
                element={<CreateApplication />}
              ></Route>
              <Route
                path="/application/editApplication"
                element={<EditApplication />}
              ></Route>
              <Route
                path="/application/dashboard"
                element={<ApplicationDashboard />}
              ></Route>
            </Routes>
          </BrowserRouter>
        </div>
      </TMSContext.Provider>
    </>
  );
}

export default App;
