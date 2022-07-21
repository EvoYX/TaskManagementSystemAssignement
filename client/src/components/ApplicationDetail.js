import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../services/user.service";
import IconButton from "@mui/material/IconButton";

import EditIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
const ApplicationDetail = (props) => {
  const [applicationDetail, setApplicationDetail] = useState([]);
  const [planList, setPlanList] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    userService
      .getApplication(localStorage.getItem("selectedApplication"))
      .then((res) => {
        setApplicationDetail(res.result[0]);
        var moment = require("moment");
        setStartDate(
          moment(new Date(res.result[0].App_startDate)).format("DD/MM/YYYY")
        );
        setEndDate(
          moment(new Date(res.result[0].App_endDate)).format("DD/MM/YYYY")
        );
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
      <div className="breadCrumb">
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            underline="hover"
            color="white"
            className="customLink"
            href={
              localStorage.getItem("setIsAdmin") == "true"
                ? "/admin/home"
                : "/home"
            }
          >
            Home
          </Link>
          <Link
            underline="hover"
            className="customLink"
            color="white"
            href="/home/applications"
          >
            Applications
          </Link>
          <Typography className="linkText">
            {localStorage.getItem("selectedApplication")}
          </Typography>
        </Breadcrumbs>
      </div>
      <div className="applicationViewContainer">
        {localStorage
          .getItem("user_group")
          .split(",")
          .includes("Project Lead") && (
          <IconButton className="applicationIcon" onClick={navigateEdit}>
            <EditIcon />
            {"Edit"}
          </IconButton>
        )}
        <h1 className="applicationTitle">{applicationDetail.App_Acronym}</h1>
        <p className="applicationDesc">{applicationDetail.App_Description}</p>
        <div className="applicationDate">
          <div className="applicationStart">
            <p className="permisionTitle">Start date</p>
            <p>{startDate}</p>
          </div>
          <div className="applicationEnd">
            <p className="permisionTitle">End Date</p>
            <p>{endDate}</p>
          </div>
        </div>
        <div className="applicationPermission">
          <div className="permissionContent">
            <p className="permisionTitle">App Permit Create</p>
            <p className="permissionDesc">
              {applicationDetail.App_permit_create == ""
                ? "NIL"
                : applicationDetail.App_permit_create}
            </p>
          </div>
          <div className="permissionContent">
            <p className="permisionTitle">App Permit Open</p>
            <p>
              {applicationDetail.App_permit_Open == ""
                ? "NIL"
                : applicationDetail.App_permit_Open}
            </p>
          </div>
          <div className="permissionContent">
            <p className="permisionTitle">App Permit To-Do</p>
            <p className="permissionDesc">
              {applicationDetail.App_permit_toDoList == ""
                ? "NIL"
                : applicationDetail.App_permit_toDoList}
            </p>
          </div>
          <div className="permissionContent">
            <p className="permisionTitle">App Permit Doing</p>
            <p className="permissionDesc">
              {applicationDetail.App_permit_Doing == ""
                ? "NIL"
                : applicationDetail.App_permit_Doing}
            </p>
          </div>
          <div className="permissionContent">
            <p className="permisionTitle">App Permit Done</p>
            <p className="permissionDesc">
              {applicationDetail.App_permit_Done == ""
                ? "NIL"
                : applicationDetail.App_permit_Done}
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
