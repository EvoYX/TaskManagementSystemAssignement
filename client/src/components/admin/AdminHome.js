import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "../../css/AdminHome.css.css";

import {
  Navbar,
  NavDropdown,
  Nav,
  Container,
  Button,
  NavItem,
} from "react-bootstrap";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "../../css/AdminHome.css.css";
import Image from "react-bootstrap/Image";
import AdminBoard from "./AdminBoard";
import GroupManagement from "./GroupManagement";
import CreateUser from "./CreateUser";
import UserManagment from "./UserManagment";
import EditUser from "./EditUser";
import ProfileBoard from "../ProfileBoard";
const AdminHome = () => {
  return (
    <>
      <div className="profile_section">
        <ProfileBoard className="profileBoard"></ProfileBoard>
      </div>
    </>
  );
};

export default AdminHome;
