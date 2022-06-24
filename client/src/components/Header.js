import React from "react";
import { Link } from "react-router-dom";

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
      {/*       <header className="header-bar bg-primary mb-3">
        <div className="container d-flex flex-column flex-md-row align-items-center p-3">
          <h4 className="my-0 mr-md-auto font-weight-normal">
            <Link to="/" className="text-white">
              TMS
            </Link>
          </h4>
          {props.loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />} 
        </div>
        
      </header> */}
      <Navbar className="navbar">
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
      </Navbar>
    </>
  );
};

export default Header;
