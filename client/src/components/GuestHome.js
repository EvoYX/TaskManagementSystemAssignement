import React from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import "../css/GuestHome.css.css";

const GuestHome = () => {
  const [popupModal, setPopupModal] = useState(false);

  console.log("the result is  ", popupModal);
  const openModal = () => {
    setPopupModal(!popupModal);
  };
  return (
    <>
      {/* <Navbar bg="light" variant="dark">
          <Container>
            <Navbar.Brand href="#home">TMS</Navbar.Brand>
          </Container>
        </Navbar> */}

      <Link to="/Login">
        <button type="submit" className="loginBtn">
          Login
        </button>
      </Link>

      {/* <button type="submit" className="loginBtn" onClick={(e) => openModal(e)}>
        Login
      </button> */}
      {popupModal && (
        <div>
          <div className="overlay"></div>
          <div className="spacing"></div>
          <div className="modal_content">
            <div className="modal_container">
              {/* <button className={classes.closeBtn} onClick={showStartModal}>
                X
              </button> */}
              <div className="modalTitle">
                <h2>Choose Your Speed & Algorithm</h2>
                <p>
                  Based on your preference,choose the suitable running speed &
                  the algorithm to use.
                </p>
              </div>
              <div className="speedContainer">
                <p>Speed</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup Login Modal */}
      {!popupModal && (
        <div id="myModal" className="modal fade">
          <div className="modal-dialog modal-login">
            <div className="modal-content">
              <div className="modal-header">
                <div className="avatar">
                  <img
                    src="https://www.tutorialrepublic.com/examples/images/avatar.png"
                    alt="Avatar"
                  />
                </div>
                <h4 className="modal-title">Member Login</h4>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-hidden="true"
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <form action="/examples/actions/confirmation.php" method="post">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      name="username"
                      placeholder="Username"
                      required="required"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      placeholder="Password"
                      required="required"
                    />
                  </div>
                  <div className="form-group">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg btn-block login-btn"
                    >
                      Login
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GuestHome;
