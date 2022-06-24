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
import { TransitionProps } from "@mui/material/transitions";
import { useNavigate } from "react-router-dom";

const UserManagment = () => {
  const navigate = useNavigate();

  const [userList, setUserList] = useState([]);
  const [popupModal, setPopup] = useState(false);
  const [selectedUser, setUser] = useState([]);
  const [dialogMessage, setDiaglog] = useState("");
  const [dialogTitle, setTitle] = useState("");
  /* getting all the group */
  useEffect(() => {
    userService.getAllUsers().then((res) => {
      if (res.message === "Found") setUserList(res.result);
    });
  }, []);
  const handleDialog = (username, status) => {
    setPopup(true);
    setUser({ username: username, status: status });

    const msg = `Confirm changing this user access to ${
      status == "enable" ? "Disable" : "Enable"
    }?`;
    setDiaglog(msg);
  };

  const handleClose = () => {
    setPopup(false);
    window.location.reload();
  };
  const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>,
    },
    ref: React.Ref<unknown>
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  const disableHandler = () => {
    userService
      .disableUser({
        username: selectedUser.username,
        status: selectedUser.status == "enable" ? "disable" : "enable",
      })
      .then((res) => {
        if (res.result) {
          alert(
            `${
              selectedUser.status == "enable" ? "disable" : "enable"
            } successfuly`
          );
          setPopup(false);
          window.location.reload();
        } else {
          alert("Unable to disable");
          window.location.reload();
        }
      });
  };
  const editHandler = (username) => {
    console.log("the selected is", username);
    setPopup(true);
    localStorage.setItem("selectedUsername", username);
  };

  return (
    <>
      <div>User Management</div>
      <div>
        <Link to="/admin/usermanagement/createuser">
          <button className="createBtn">Create User</button>
        </Link>
      </div>

      <div className="table">
        <Table striped bordered hover size="sm" className="table-auto">
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Email</th>
              <th>Status</th>
              <th>Groups</th>
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
                    <Button
                      variant="secondary"
                      className="disable"
                      onClick={(e) => handleDialog(doc.username, doc.status)}
                    >
                      {doc.status}
                    </Button>
                    <Link to="/admin/usermanagement/edituser">
                      <Button
                        variant="danger"
                        className="Edit"
                        onClick={(e) => editHandler(doc.username)}
                      >
                        Edit
                      </Button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
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
