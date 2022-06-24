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
const AdminHome = () => {
  return (
    <>
      ddd
      {/* <Navbar className="navbar">
        <Container fluid>
          <Navbar.Brand href="#home">TMS</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavDropdown title="Management" id="basic-nav-dropdown">
                <Link to="/admin/usermanagement" className="navLink">
                  <NavDropdown.Item href="#action/3.1">
                    User Management
                  </NavDropdown.Item>
                </Link>
                <Link to="/admin/groupManagement" className="navLink">
                  <NavDropdown.Item href="#action/3.2">
                    Group Management
                  </NavDropdown.Item>
                </Link>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar> */}
      <AdminBoard className="profileBoard"></AdminBoard>
      <Routes>
        <Route path="/admin/groupmanagement" element={<GroupManagement />} />
        <Route path="/admin/usermanagement" element={<UserManagment />} />
        <Route
          path="/admin/usermanagement/createuser"
          element={<CreateUser />}
        />
        <Route path="/admin/usermanagement/edituser" element={<EditUser />} />
        <Route path="/admin/groupmanagement" element={<GroupManagement />} />
      </Routes>
    </>
  );
};

export default AdminHome;
