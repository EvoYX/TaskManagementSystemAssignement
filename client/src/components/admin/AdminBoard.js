import React from "react";
import "../../css/AdminBoard.css.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const AdminBoard = () => {
  const [userGroup, setUserGroup] = useState([]);
  useEffect(() => {
    ///asdnkjndsa
    var splitGroup = localStorage.getItem("user_group").split(",");
    setUserGroup(splitGroup);
  }, []);
  console.log("the result is ", userGroup);
  return (
    <div>
      {/* Profile Container */}
      <div className="card-container">
        <span className="pro">Log Out</span>
        <img
          className="round"
          src="https://randomuser.me/api/portraits/women/79.jpg"
          alt="user"
        />
        <h3>{localStorage.getItem("username")}</h3>
        <h6>Email Address:</h6>
        <p>{localStorage.getItem("loginEmail")}</p>
        <div className="buttons">
          <button className="primary">Edit Profile</button>
          <button className="primary ghost">My Tasks</button>
        </div>
        <br />
        <div className="buttons">
          <Link to="/admin/usermanagement">
            {" "}
            <button className="primary ghost">User Managment</button>
          </Link>
        </div>
        <div className="skills">
          <h6>Groups:</h6>
          <ul>
            {userGroup.map((name) => (
              <li>{name}</li>
            ))}
          </ul>
        </div>
      </div>
      {/* User Managmenet */}
      <div className="groupSection">
        <Link to="/admin/groupmanagement">
          {" "}
          <button className="primary ghost">Group Management</button>
        </Link>
      </div>
    </div>
  );
};

export default AdminBoard;
