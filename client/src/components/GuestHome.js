import React from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./Login";
import "../css/GuestHome.css.css";

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
      <p id="head5" class="header">
        Welcome to TMS
      </p>
      <button type="submit" className="loginBtn" onClick={handleModal}>
        Login
      </button>
      {/* <button type="submit" className="loginBtn" onClick={openModal}>
        Login
      </button> */}

      {/* <button type="submit" className="loginBtn" onClick={(e) => openModal(e)}>
        Login
      </button> */}
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
