import React from "react";
import ProfileBoard from "../components/ProfileBoard";
import "../css/AdminBoard.css.css";

const UserHome = () => {
  return (
    <>
      <div className="profile_section">
        <ProfileBoard className="profileBoard"></ProfileBoard>
      </div>
    </>
  );
};

export default UserHome;
