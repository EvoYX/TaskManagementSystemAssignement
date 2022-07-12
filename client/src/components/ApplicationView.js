import React from "react";
import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Table } from "@mui/material";

import userService from "../services/user.service";
import "../css/UserManagement.css.css";
import alertify from "alertifyjs";

const ApplicationView = () => {
  const [applicationList, setApplicationList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    userService.getAllApplication().then((res) => {
      setApplicationList(res.result);
    });
  }, []);

  const handleViewMore = (e) => {
    localStorage.setItem("selectedApplication", e.App_Acronym);
  };
  const handleNavigate = () => {
    const user = {
      groupname: "admin",
      username: localStorage.getItem("username"),
    };
    userService
      .checkGroup(localStorage.getItem("username"), "admin")
      .then((res) => {
        console.log(res);
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
      <button onClick={handleNavigate}>Create New Application</button>
      <div className="table">
        <Table striped bordered hover size="sm" className="table-auto">
          <thead>
            <tr>
              <th>#</th>
              <th>App Name</th>
              <th>Description</th>
              <th>R_No.</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Open Permission</th>
              <th>ToDo Permission</th>
              <th>Do Permission</th>
              <th>Done Permission</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applicationList.map((doc, index) => {
              return (
                <tr key={doc.id}>
                  <td>{index + 1}</td>
                  <td>{doc.App_Acronym}</td>
                  <td>{doc.App_Description}</td>
                  <td>{doc.App_Rnumber}</td>
                  <td>{doc.App_startDate}</td>
                  <td>{doc.App_endDate}</td>
                  <td>{doc.App_permit_Open}</td>
                  <td>{doc.App_permit_toDoList}</td>
                  <td>{doc.App_permit_Doing}</td>
                  <td>{doc.App_permit_Done}</td>
                  <td>
                    <Link to="/home/applications/detail">
                      <button
                        className="actionBtn"
                        onClick={(e) => handleViewMore(doc)}
                      >
                        View
                      </button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default ApplicationView;
