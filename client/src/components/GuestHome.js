import React from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./Login";
import Styles from "../css/GuestHome.css.css";
import logo from "../../src/logo.png";

const GuestHome = () => {
  const [popupModal, setPopupModal] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userGroups, setUserGroup] = useState([]);
  const handleModal = () => {
    setPopupModal(!popupModal);
  };
  return (
    <>
      <div className="welcomeHeading">
        <p className="welcomeTitle">TASK MANAGEMENT SYSTEM </p>
        <span className="welcomeSubtitle">@Yong Xin</span>
      </div>

      <button type="submit" className="loginBtn" onClick={handleModal}>
        Login
      </button>

      {popupModal && (
        <div>
          <div className="overlay" onClick={handleModal}></div>
          <div className="spacing"></div>
          <div className="modal_content">
            <Login></Login>
          </div>
        </div>
      )}
    </>
  );
};

export default GuestHome;
