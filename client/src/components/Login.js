import React from "react";
import "../css/Login.css.css";
import { useState, useEffect } from "react";
import userService from "../services/user.service";
import { Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userGroups, setUserGroup] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    var loginuser = { username: username, password: password };

    await userService.login(loginuser).then((res) => {
      var result = res.result;
      var resultmessage = res.message;
      if (result != null) {
        if (resultmessage === "Found") {
          if (result.status === "enable") {
            localStorage.setItem("username", result.username);
            localStorage.setItem("access-token", res.accessToken);
            localStorage.setItem("user_group", result.user_group);
            localStorage.setItem("loginEmail", result.email);

            var split = result.user_group.split(",");
            console.log(split);
            setUserGroup(split);
            console.log(userGroups);
            if (split.includes("admin")) {
              navigate(`/admin/home`);
            } else {
              navigate(`/userhome`);
            }
          } else {
            alert("Your account has been disabled! Please contact the admin");
          }
        } else {
          if (resultmessage === "Invalid Password") {
            alert(resultmessage);
          }
        }
      } else {
        alert("Invalid password");
      }
    });
  };
  return (
    <>
      <div className="login-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="avatar"></div>
            <h4 className="modal-title">Login to Your Account</h4>

            <input
              type="text"
              className="form-control"
              name="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required="required"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
    </>
  );
};

export default Login;
