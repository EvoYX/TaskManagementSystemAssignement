import React from "react";
import { useState, useEffect } from "react";
import { Table } from "@mui/material";
import { Link } from "react-router-dom";
import "../../css/UserManagement.css.css";
import userService from "../../services/user.service";

import Offcanvas from "react-bootstrap/Offcanvas";
import CreateUser from "./CreateUser";
import alertify from "alertifyjs";
import "../../../src/alertify/css/themes/bootstrap.css";
const UserManagment = () => {
  const [userList, setUserList] = useState([]);
  const [popupModal, setPopup] = useState(false);
  const [selectedUser, setUser] = useState([]);
  const [showAddModal, setAddModal] = useState(false);

  /* getting all the group */
  useEffect(() => {
    //getting all users
    userService.getAllUsers().then((res) => {
      if (res.message === "Found") setUserList(res.result);
    });
  }, []);
  const handleDisable = (username, status) => {
    const msg = `Confirm changing this user access to ${
      status == "Enable" ? "Disable" : "Enable"
    }?`;

    alertify
      .confirm(
        `Confirmation`,
        msg,
        async function () {
          await userService
            .disableUser({
              username: username,
              status: status == "Enable" ? "Disable" : "Enable",
            })
            .then((res) => {
              if (res.result) {
                alertify.success(
                  `${status == "Enable" ? "Disable" : "Enable"} successfuly`
                );
                setPopup(false);
                userService.getAllUsers().then((res) => {
                  if (res.message === "Found") setUserList(res.result);
                });
              } else {
                alert("Unable to disable");
              }
            });
        },
        function () {
          alertify.error("Cancel");
        }
      )
      .set("labels", { ok: "YES", cancel: "NO" });
  };

  const editHandler = (username) => {
    setPopup(true);
    localStorage.setItem("selectedUsername", username);
  };
  const handleAddModal = () => {
    setAddModal(!showAddModal);
  };
  const tableStyle = {
    "border-top": "none",
  };
  return (
    <>
      {["end"].map((placement, idx) => (
        <Offcanvas
          key={idx}
          placement={placement}
          name={placement}
          show={showAddModal}
          onHide={handleAddModal}
          className="offcanvas offcanvas-end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title className="canvasTitle">
              Add New User
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <CreateUser setUserList={setUserList} />
          </Offcanvas.Body>
        </Offcanvas>
      ))}
      <div className="table">
        <div>
          <button className="createBtn" onClick={handleAddModal}>
            Add User
          </button>
        </div>
        <div style={tableStyle}>
          <Table striped bordered hover size="sm" className="table-auto">
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Email</th>
                <th>Status</th>
                <th>Groups</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {userList.map((doc, index) => {
                return (
                  <tr key={doc.id}>
                    <td>{index + 1}</td>
                    <td>{doc.username}</td>
                    <td>{doc.email}</td>
                    <td>{doc.status}</td>
                    <td>{doc.user_group}</td>

                    <td>
                      <button
                        className="actionBtn"
                        onClick={(e) => handleDisable(doc.username, doc.status)}
                        disabled={
                          doc.user_group.includes("admin") ? true : false
                        }
                      >
                        {doc.status == "Enable" ? "Disable" : "Enable"}
                      </button>
                      <Link to="/admin/usermanagement/edituser">
                        <button
                          className="edit"
                          onClick={(e) => editHandler(doc.username)}
                        >
                          Edit Profile
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
    </>
  );
};

export default UserManagment;
