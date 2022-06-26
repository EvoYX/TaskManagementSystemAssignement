import React from "react";
import { Link } from "react-router-dom";
import "../css/Header.css.css";

import {
  Navbar,
  NavDropdown,
  Nav,
  Container,
  Button,
  NavItem,
} from "react-bootstrap";
const Header = (props) => {
  return (
    <>
      <nav>
        <div>
          <nav className="navbar navbar-inverse navbar-static-top">
            <ul className="nav nav-pills">
              <li>
                <Link to="/admin/home">Home</Link>
              </li>
              <li>
                <Link to="/admin/groupmanagement">Group Management</Link>
              </li>
              <li>
                <Link to="/admin/usermanagement">User Management</Link>
              </li>
            </ul>
            <ul className="nav nav-pills">
              <li>
                <Link to="/admin/home">Sign out</Link>
              </li>
            </ul>
          </nav>
        </div>
      </nav>
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

                <NavDropdown.Item href="#action/3.2">
                  Group Management
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar> */}
    </>
  );
};

export default Header;
