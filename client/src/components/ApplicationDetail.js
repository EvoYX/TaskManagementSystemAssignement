import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../services/user.service";
import IconButton from "@mui/material/IconButton";

import EditIcon from "@mui/icons-material/ModeEditOutlineOutlined";
const ApplicationDetail = (props) => {
  const [applicationDetail, setApplicationDetail] = useState([]);
  const [planList, setPlanList] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    userService
      .getApplication(localStorage.getItem("selectedApplication"))
      .then((res) => {
        setApplicationDetail(res.result[0]);
      });
  }, []);
  const navigateEdit = () => {
    navigate("/application/editApplication");
  };
  const navigateDashBoard = () => {
    navigate("/application/dashboard");
  };
  return (
    <>
      <div className="applicationContainer">
        <IconButton className="applicationIcon" onClick={navigateEdit}>
          <EditIcon />
          {"Edit"}
        </IconButton>
        <h1 className="applicationTitle">{applicationDetail.App_Acronym}</h1>
        <p className="applicationDesc">{applicationDetail.App_Description}</p>
        <div className="applicationDate">
          <div className="applicationStart">
            <p className="permisionTitle">Start date</p>
            <p>{applicationDetail.App_startDate}</p>
          </div>
          <div className="applicationEnd">
            <p className="permisionTitle">End Date</p>
            <p>{applicationDetail.App_endDate}</p>
          </div>
        </div>
        <div className="applicationPermission">
          <div className="permissionContent">
            <p className="permisionTitle">App Permit Create</p>
            <p className="permissionDesc">
              {applicationDetail.App_permit_create}
            </p>
          </div>
          <div className="permissionContent">
            <p className="permisionTitle">App Permit Open</p>
            <p>{applicationDetail.App_permit_Open}</p>
          </div>
          <div className="permissionContent">
            <p className="permisionTitle">App Permit To-Do</p>
            <p className="permissionDesc">
              {applicationDetail.App_permit_toDoList}
            </p>
          </div>
          <div className="permissionContent">
            <p className="permisionTitle">App Permit Doing</p>
            <p className="permissionDesc">
              {applicationDetail.App_permit_Doing}
            </p>
          </div>
          <div className="permissionContent">
            <p className="permisionTitle">App Permit Done</p>
            <p className="permissionDesc">
              {applicationDetail.App_permit_Done}
            </p>
          </div>
        </div>
        <button className="dashBoardBtn" onClick={navigateDashBoard}>
          View Kanban board
        </button>
      </div>
    </>
  );
};

export default ApplicationDetail;
