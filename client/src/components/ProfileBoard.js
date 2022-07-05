import React from "react";
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import TMSContext from "./TMSContext";
import alertify from "alertifyjs";
import "../alertify/css/themes/bootstrap.css";

const ProfileBoard = () => {
  const [userGroup, setUserGroup] = useState([]);
  const navigate = useNavigate();
  const { setLoggedIn } = useContext(TMSContext);

  useEffect(() => {
    var splitGroup =
      localStorage.getItem("user_group").length !== 0
        ? localStorage.getItem("user_group").split(",")
        : [];
    setUserGroup(splitGroup);
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
        <p>{localStorage.getItem("loginEmail")}</p>
        <div className="buttons">
          <Link to="/updateprofile">
            {" "}
            <button className="primary">Edit Profile</button>
          </Link>{" "}
          <button className="primary ghost">My Tasks</button>
        </div>
        <br />

        {localStorage.getItem("setIsAdmin") == "true" && (
          <div className="managementButtons">
            <Link to="/admin/usermanagement">
              {" "}
              <button className="ghost">User {<br />} Managment</button>
            </Link>

            <Link to="/admin/groupmanagement">
              {" "}
              <button className="ghost">Group {<br />} Management</button>
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
