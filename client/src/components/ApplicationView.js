import React from "react";
import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Table } from "@mui/material";
import alertify from "alertifyjs";

import userService from "../services/user.service";
import "../css/UserManagement.css.css";
import EditIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import { BsEyeFill, BsFillFileEarmarkPlusFill } from "react-icons/bs";
import { FaPlusCircle } from "react-icons/fa";

const ApplicationView = () => {
  const [applicationList, setApplicationList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    userService.getAllApplication().then((res) => {
      if (res.result.length) {
        setApplicationList(res.result);
      } else {
        setApplicationList([]);
      }
    });
  }, []);

  const handleViewMore = (e) => {
    localStorage.setItem("selectedApplication", e.App_Acronym);
    navigate("/home/applications/detail");
  };
  const handleNavigate = () => {
    const user = {
      groupname: "admin",
      username: localStorage.getItem("username"),
    };
    userService
      .checkGroup(localStorage.getItem("username"), "admin")
      .then((res) => {
        if (res.result) {
          navigate("/application/createApplication");
        } else {
          alertify.error(
            "You are not authorised to create new application! Please contact admin for help!"
          );
        }
      });
  };
  return (
    <div>
      <div className="sectionHeader">
        <h2 className="pageHeader">All Application</h2>
      </div>
      <div className="allApplicationsContainer">
        {applicationList.length != 0 &&
          applicationList.map((doc, index) => {
            return (
              <div
                className="applicationCard"
                onClick={(e) => {
                  handleViewMore(doc);
                }}
              >
                <div className="applicationCardTitle">
                  <p className="applicationTitlePtag">{doc.App_Acronym}</p>
                </div>
                <div className="applicationCardContent">
                  <p className="applicationContentPtag">
                    {doc.App_Description}
                  </p>
                </div>
                <div className="applicationCardFooter"></div>
              </div>
              // <Link to="/home/applications/detail">
              //   <button
              //     type="button"
              //     className="icnBtn"
              //     data-toggle="tooltip"
              //     data-placement="top"
              //     title="View Detail"
              //     onClick={(e) => {
              //       handleViewMore(doc);
              //     }}
              //   >

              //   </button>
              // </Link>
            );
          })}
        <button
          type="button"
          className="icnBtn"
          data-toggle="tooltip"
          data-placement="top"
          title="Add New Application"
        >
          <BsFillFileEarmarkPlusFill
            onClick={handleNavigate}
            className="addIcon"
          />
        </button>
      </div>
    </div>
  );
};

export default ApplicationView;
