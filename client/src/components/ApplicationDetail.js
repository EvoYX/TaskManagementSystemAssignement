import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../services/user.service";

const ApplicationDetail = (props) => {
  const [applicationDetail, setApplicationDetail] = useState([]);
  const [planList, setPlanList] = useState([]);
  useEffect(() => {
    userService
      .getApplication(localStorage.getItem("selectedApplication"))
      .then((res) => {
        setApplicationDetail(res.result);
      });
  }, []);
  return (
    <>
      <div className="applicationContainer">
        {localStorage.getItem("selectedApplication")}
        <p></p>
      </div>
    </>
  );
};

export default ApplicationDetail;
