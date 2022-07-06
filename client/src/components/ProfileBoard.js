import React from "react";
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import TMSContext from "./TMSContext";
import alertify from "alertifyjs";
import "../alertify/css/themes/bootstrap.css";
import userService from "../services/user.service";

const ProfileBoard = () => {
  const [userGroup, setUserGroup] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  const { setLoggedIn } = useContext(TMSContext);

  useEffect(() => {
    // var splitGroup =
    //   localStorage.getItem("user_group").length !== 0
    //     ? localStorage.getItem("user_group").split(",")
    //     : [];
    // setUserGroup(splitGroup);
    userService.findUsername(localStorage.getItem("username")).then((res) => {
      if (res.message === "Found") {
        setUserGroup(
          res.result.user_group.length != 0
            ? res.result.user_group.split(",")
            : []
        );
        setUserEmail(res.result.email);
        // setEditGroup(res.result);
      }
    });
  }, []);
  const logout = () => {
    setLoggedIn(false);
    localStorage.clear();

    alertify.success("Sign Out Successfully");
    navigate("/");
  };

  return (
    <div>
      {/* Profile Container */}
      <div className="card-container">
        <span className="pro" onClick={logout}>
          Log Out
        </span>

        <h3>{localStorage.getItem("username")}</h3>
        <h6>Email Address:</h6>
        {userEmail == "" ? <p>No Email </p> : <p>{userEmail}</p>}
        <div className="buttons">
          <Link to="/updateprofile">
            {" "}
            <button className="primary">Edit Profile</button>
          </Link>{" "}
          <button className="primary">My Tasks</button>
        </div>
        <br />

        {localStorage.getItem("setIsAdmin") == "true" && (
          <div className="managementButtons">
            <Link to="/admin/usermanagement">
              <button className="primary">User {<br />} Managment</button>
            </Link>{" "}
            <Link to="/admin/groupmanagement">
              <button className="primary">Group {<br />} Management</button>
            </Link>
          </div>
        )}

        <div className="skills">
          <h6>Groups:</h6>
          {userGroup.length != 0 ? (
            <ul>
              {userGroup.map((name) => (
                <li>{name}</li>
              ))}
            </ul>
          ) : (
            <p>No Assigned Groups</p>
          )}
        </div>
      </div>
      {/* User Managmenet */}
      <div className="groupSection"></div>
    </div>
  );
};

export default ProfileBoard;
