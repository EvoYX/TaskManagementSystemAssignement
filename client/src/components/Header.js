import React from "react";
import { Link } from "react-router-dom";
import "../css/Header.css.css";
import TMSContext from "./TMSContext";
import { useContext } from "react";
import alertify from "alertifyjs";
import "../../src/alertify/css/themes/bootstrap.css";
import { useNavigate } from "react-router-dom";
import {
  Navbar,
  NavDropdown,
  Nav,
  Container,
  Button,
  NavItem,
} from "react-bootstrap";
const Header = (props) => {
  const { setIsAdmin } = useContext(TMSContext);
  const { setLoggedIn } = useContext(TMSContext);
  const navigate = useNavigate();

  const handleLoggedOut = () => {
    setLoggedIn(false);
    localStorage.clear();
    alertify.success("Sign Out Successfully");
    navigate("/");
  };
  return (
    <>
      <nav>
        <div>
          <nav className="navbar navbar-inverse navbar-static-top">
            <ul className="nav nav-pills">
              <li>
                <Link
                  to={
                    localStorage.getItem("setIsAdmin") == "true"
                      ? "/admin/home"
                      : "/home"
                  }
                >
                  Home
                </Link>
              </li>
              {localStorage.getItem("setIsAdmin") == "true" && (
                <li>
                  <Link to="/admin/groupmanagement">Group Management</Link>
                </li>
              )}
              {localStorage.getItem("setIsAdmin") == "true" && (
                <li>
                  <Link to="/admin/usermanagement">User Management</Link>
                </li>
              )}
            </ul>
            <ul className="nav nav-pills">
              <li>
                <Link to="/" onClick={handleLoggedOut}>
                  Log out
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </nav>
    </>
  );
};

export default Header;
