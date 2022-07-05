import React from "react";
import { useState, useEffect } from "react";
import { Table } from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import "../../css/UserManagement.css.css";
import userService from "../../services/user.service";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Offcanvas from "react-bootstrap/Offcanvas";
import { TransitionProps } from "@mui/material/transitions";
import { useNavigate } from "react-router-dom";
import CreateUser from "./CreateUser";
import alertify from "alertifyjs";
import "../../../src/alertify/css/themes/bootstrap.css";
const UserManagment = () => {
  const navigate = useNavigate();

  const [userList, setUserList] = useState([]);
  const [popupModal, setPopup] = useState(false);
  const [selectedUser, setUser] = useState([]);
  const [dialogMessage, setDiaglog] = useState("");
  const [dialogTitle, setTitle] = useState("");
  const [showAddModal, setAddModal] = useState(false);

  /* getting all the group */
  useEffect(() => {
    //getting all users
    userService.getAllUsers().then((res) => {
      if (res.message === "Found") setUserList(res.result);
    });
  }, []);
  const handleDisable = (username, status) => {
    // setPopup(true);

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
                  `${
                    selectedUser.status == "Enable" ? "Disable" : "Enable"
                  } successfuly`
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

  const handleClose = () => {
    setPopup(false);
    userService.getAllUsers().then((res) => {
      if (res.message === "Found") setUserList(res.result);
    });
  };
  const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>,
    },
    ref: React.Ref<unknown>
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  const disableHandler = async () => {
    await userService
      .disableUser({
        username: selectedUser.username,
        status: selectedUser.status == "Enable" ? "Disable" : "Enable",
      })
      .then((res) => {
        if (res.result) {
          alertify.success(
            `${
              selectedUser.status == "Enable" ? "Disable" : "Enable"
            } successfuly`
          );
          setPopup(false);
          userService.getAllUsers().then((res) => {
            if (res.message === "Found") setUserList(res.result);
          });
        } else {
          alert("Unable to disable");
        }
      });
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
      <Dialog
        open={popupModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Enable / Disable this user?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={disableHandler}>Yes</Button>
          <Button onClick={handleClose}>No</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserManagment;
