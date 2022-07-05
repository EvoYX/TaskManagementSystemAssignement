import React from "react";
import { useState, useEffect } from "react";
import { Table } from "@mui/material";
import userService from "../../services/user.service";
import Button from "@mui/material/Button";
import { Link, NavLink } from "react-router-dom";
import "../../css/GroupManagement.css.css";
import alertify from "alertifyjs";
import "../../../src/alertify/css/themes/bootstrap.css";

import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ViewMembers from "./ViewMembers";
const GroupManagement = () => {
  /* Contain the users username per group */
  const [groupDetailList, setGroupDetailList] = useState([]); // get table data
  const [groupList, setGroupList] = useState([]); // get all the group name
  const [userList, setUserList] = useState([]); // get all the users
  const [memberList, setMemberList] = useState([]); // get group member list

  const [selectedGroupname, setSelectedGroup] = useState(""); //selected group name
  const [selectedGroupStatus, setSelectedGroupStatus] = useState("");
  const [viewModal, setViewModal] = useState(false);
  const [addPopup, setAddPopup] = useState(false);
  const [selectUsers, setSelectUsers] = useState([]);

  const [groupName, setGroupname] = useState(""); // for new create group
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 2.5 + ITEM_PADDING_TOP,
        width: 200,
      },
    },
  };
  useEffect(() => {
    userService.getGroupData().then((res) => {
      if (res.message === "Found") {
        setGroupDetailList(res.result.map((result) => result));
        setGroupList(res.result.map((result) => result.groupname));
      }
    });
    userService.getAllUsers().then((res) => {
      if (res.message === "Found") {
        setUserList(res.result.map((res) => res.username));
      }
    });
  }, []);

  const handleViewMore = (groupname, status) => {
    setSelectedGroup(groupname);
    localStorage.setItem("selectedGroup", groupname);
    localStorage.setItem("selectedGroupStatus", status);

    // setSelectedGroupStatus(status);
    // await userService.getUsersByGroupname(groupname).then((res) => {
    //   if (res.result != null) {
    //     setMemberList(res.result.map((result) => result.username));
    //     setSelectUsers(res.result.map((res) => res.username));
    //   } else {
    //     setMemberList([]);
    //     setSelectUsers([]);
    //   }
    // });
    // handleModal();
  };
  const handleModal = () => {
    if (selectedGroupname == "") {
      setViewModal(!viewModal);
    }
  };
  const openCreateGroup = async (e) => {
    e.preventDefault();
    /* Steps:
    retrieve all the groupname from user_group table
    if there's no duplicate then add into the database.
  */
    if ((groupName == "") | (groupName == null)) {
      alertify
        .alert("Please enter the new group name!")
        .setHeader('<em style="color:black;">Error !</em>');
    } else {
      var newGroup = { groupname: groupName };
      if (!groupList.includes(groupName)) {
        userService.createGroup(newGroup).then((res) => {
          console.log(res);
          if (res.result) {
            userService.getGroupData().then((res) => {
              if (res.message === "Found") {
                setGroupDetailList(res.result.map((result) => result));
                setGroupList(res.result.map((result) => result.groupname));
              }
            });
            alertify.success("Group Successsfully created");
          }
        });
      } else {
        alertify
          .alert("Duplicated Group name")
          .setHeader('<em style="color:black;">Error !</em>');
      }
    }
  };

  // const Transition = React.forwardRef(function Transition(
  //   props: TransitionProps & {
  //     children: React.ReactElement<any, any>,
  //   },
  //   ref: React.Ref<unknown>
  // ) {
  //   return <Slide direction="up" ref={ref} {...props} />;
  // });

  const handleAddPopup = () => {
    // setAddPopup(!addPopup);
  };
  const handleClose = () => {
    setAddPopup(false);
    window.location.reload();
  };
  const handleChange = (e) => {
    e.preventDefault();
    setSelectUsers(
      // On autofill we get a stringified value.
      typeof e.target.value === "string"
        ? e.target.value.split(",")
        : e.target.value
    );
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    for (let i = 0; i < selectUsers.length; i++) {
      await userService.findUsername(selectUsers[i]).then((res) => {
        if (res.result) {
          var user_group = res.result.user_group.split(",");
          if (!user_group.includes(selectedGroupname)) {
            userService.updateUserUserGroup(selectedGroupname);
          }
        }
      });
      if (!memberList.includes(selectUsers[i])) {
        const groupdetail = {
          username: selectUsers[i],
          groupname: selectedGroupname,
        };
        await userService.createGroupByUser(groupdetail);
      }
    }
    alertify.success("Group updated successfully");
    window.location.reload();
  };
  const handleDisable = (groupname, status) => {
    alertify
      .confirm(
        "Confirmation",
        "Confirm Enable/ Disable this group?",
        async function () {
          const disablingGroup = {
            name: groupname,
            status: status == "Enable" ? "Disable" : "Enable",
          };
          await userService.disableGroup(disablingGroup).then((res) => {
            console.log("responds ", res);
            if (res.result) {
              alertify.success(`Group ${groupname} has been disable`);
              userService.getGroupData().then((res) => {
                if (res.message === "Found") {
                  setGroupDetailList(res.result.map((result) => result));
                  setGroupList(res.result.map((result) => result.groupname));
                }
              });
            }
          });
        },
        function () {
          alertify.error("Cancel");
        }
      )
      .set("labels", { ok: "YES", cancel: "NO" });
  };
  return (
    <>
      <div className="grid-container">
        <div
          className={
            selectedGroupname == "" ? "table_container1" : "table-container"
          }
        >
          <Table striped bordered hover size="sm" className="table-auto">
            <thead>
              <tr>
                <th>#</th>
                <th>Group</th>
                <th>Status</th>
                <th>Users</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {groupDetailList.map((doc, index) => {
                return (
                  <tr key={doc.id}>
                    <td>{index + 1}</td>
                    <td>{doc.groupname}</td>
                    <td>{doc.status}</td>
                    <td>{doc.users.length}</td>
                    <td>
                      <button
                        className="actionBtn"
                        onClick={(e) =>
                          handleDisable(doc.groupname, doc.status)
                        }
                      >
                        {doc.status == "Enable" ? "Disable" : "Enable"}
                      </button>

                      {/* <Link to="/admin/groupmanagement/viewgroup"> */}
                      <button
                        className="viewBtn"
                        onClick={(e) =>
                          handleViewMore(doc.groupname, doc.status)
                        }
                      >
                        View Details{" "}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>{" "}
        </div>
        <div className="view-container">
          {selectedGroupname != "" && (
            <ViewMembers selectedGroup={selectedGroupname} />
          )}
        </div>
      </div>

      {/* <div className="grid-container">
        <div className="group_container"></div>
        {selectedGroupname != "" && (
          <ViewMembers selectedGroup={selectedGroupname} />
        )} */}
      {/* <div className="create_container">
          <p className="createTitle">Create New Group</p>
          <form onSubmit={openCreateGroup}>
            <input
              type="text"
              className="form-control"
              name="groupname"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupname(e.target.value)}
            />
            <button className="addBtn">Add Group</button>
          </form>
        </div> */}
      {/* </div> */}
      {viewModal && (
        <div className="modalContent">
          <p className="groupTitle">{selectedGroupname}</p>
          <p className="groupSubHeading">Members:</p>
          {memberList.length == 0 && "No one is in this group"}
          {/* <ul className="listview">
              {memberList.length != 0 &&
                memberList.map(
                  (name) => <li>{name}</li>
                  // <ListItemText primary={name} />
                )}
            </ul> */}

          {memberList.length != 0 &&
            memberList.map(
              (name) => <ListItemText primary={name} />
              // <ListItemText primary={name} />
            )}
          <div className="managementButtons">
            <button onClick={handleAddPopup} className="primaryBtn">
              {" "}
              Add User
            </button>
            <button onClick={handleDisable} className="secondaryBtn">
              {" "}
              Disable Group
            </button>
          </div>
        </div>

        // <div>
        //   <div className="overlay" onClick={handleModal}></div>
        //   <div className="spacing"></div>
        //   <div className="modal-header">{selectedGroupname}</div>
        //   <div className="modal_content">
        //     {userList.map((name) => (
        //       <ListItemText primary={name} />
        //     ))}
        //   </div>
        // </div>
        // <div>
        //   <div className="overlay" onClick={handleModal}></div>
        //   <div className="spacing"></div>
        //   <div className="modal_content">
        //     {userList.map((name) => (
        //       <ListItemText primary={name} />
        //     ))}
        //   </div>
        // </div>
      )}

      {/* {addPopup && (
        <div className="addUserForm">
          <form onSubmit={handleSubmit}>
            <FormControl sx={{ m: 0, width: 230 }} className="grid-35">
              <InputLabel id="demo-multiple-checkbox-label">Group</InputLabel>

              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={selectUsers}
                onChange={(e) => handleChange(e)}
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
                className="customSelectGroup"
              >
                {userList.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={selectUsers.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <button type="submit" className="addBtn">
              Add Users
            </button>
          </form>
        </div>
      )} */}
    </>
  );
};

export default GroupManagement;
