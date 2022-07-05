import React from "react";
import "../css/Login.css.css";
import { useState, useContext } from "react";
import userService from "../services/user.service";
import { useNavigate } from "react-router-dom";
import TMSContext from "./TMSContext";
import alertify from "alertifyjs";
import "../../src/alertify/css/themes/bootstrap.css";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { setIsAdmin } = useContext(TMSContext);
  const { setLoggedIn } = useContext(TMSContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    var loginuser = { username: username, password: password };

    await userService.login(loginuser).then((res) => {
      var result = res.result;
      var resultmessage = res.message;
      if (result != null) {
        if (resultmessage === "Found") {
          if (result.status === "Enable") {
            localStorage.setItem("username", result.username);
            localStorage.setItem("setIsLoggedIn", true);
            localStorage.setItem("access-token", res.accessToken);
            localStorage.setItem("user_group", result.user_group);
            localStorage.setItem("loginEmail", result.email);

            var groups = result.user_group.split(",");

            if (groups.includes("admin")) {
              setIsAdmin(true);
              localStorage.setItem("setIsAdmin", true);
              navigate(`/admin/home`);
            } else {
              setIsAdmin(false);
              localStorage.setItem("setIsAdmin", false);
              navigate(`/home`);
            }
            setLoggedIn(true);
          } else {
            alertify
              .alert("Your account has been disabled! Please contact the admin")
              .setHeader('<em style="color:black;">Error !</em>');
          }
        } else {
          if (resultmessage === "Invalid Password") {
            alertify
              .alert(resultmessage)
              .setHeader('<em style="color:black;">Error !</em>');
          }
        }
      } else {
        alertify
          .alert(resultmessage)
          .setHeader('<em style="color:black;">Error !</em>');
      }
    });
  };
  return (
    <>
      <div className="login-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <img src="https://bit.ly/2aQB5uu" alt="login icon" />
            <h4 className="modal-title">Login</h4>

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
            <button type="submit" className="loginFormBtn">
              Login
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
