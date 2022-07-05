import React from "react";
import { useState, useEffect } from "react";
import alertify from "alertifyjs";
import "../../../src/alertify/css/themes/bootstrap.css";
import userService from "../../services/user.service";
import { useNavigate } from "react-router-dom";
import Offcanvas from "react-bootstrap/Offcanvas";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";

const ViewMembers = (props) => {
  const navigate = useNavigate();

  const [memberList, setMemberList] = useState([]); // get group member list
  const [userList, setUserList] = useState([]);
  const [selectUsers, setSelectUsers] = useState([]);
  const [showAddModal, setAddModal] = useState(false);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  useEffect(() => {
    userService
      .getUsersByGroupname(localStorage.getItem("selectedGroup"))
      .then((res) => {
        if (res.result != null) {
          setMemberList(res.result.map((result) => result.username));
          setSelectUsers(res.result.map((res) => res.username));
        } else {
          setMemberList([]);
          setSelectUsers([]);
        }
      });
    userService.getAllUsers().then((res) => {
      if (res.message === "Found") {
        setUserList(res.result.map((res) => res.username));
      }
    });
  }, [props.selectedGroup]);
  const handleSubmit = async (e) => {
    for (let i = 0; i < selectUsers.length; i++) {
      await userService.findUsername(selectUsers[i]).then((res) => {
        if (res.result) {
          var user_group = res.result.user_group.split(",");
          if (!user_group.includes(localStorage.getItem("selectedGroup"))) {
            userService.updateUserUserGroup(
              localStorage.getItem("selectedGroup")
            );
          }
        }
      });
      if (!memberList.includes(selectUsers[i])) {
        const groupdetail = {
          username: selectUsers[i],
          groupname: localStorage.getItem("selectedGroup"),
        };
        await userService.createGroupByUser(groupdetail).then((res) => {
          userService
            .getUsersByGroupname(localStorage.getItem("selectedGroup"))
            .then((res) => {
              if (res.result != null) {
                setMemberList(res.result.map((result) => result.username));
                setSelectUsers(res.result.map((res) => res.username));
              } else {
                setMemberList([]);
                setSelectUsers([]);
              }
            });
        });
      }
    }
  };
  const handleCancel = () => {
    navigate("/admin/groupmanagement");
  };
  const handleAddModal = () => {
    setAddModal(!showAddModal);
  };
  const handleChange = (e) => {
    const value = e.target.value;
    setSelectUsers(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <>
      <div className="wrapperView">
        <div className="viewContainer">
          <div className="content">
            <p className="formTitle">Group Information</p>
            <div className="sectionContent">
              <p className="contentLabel">
                Group Name: {localStorage.getItem("selectedGroup")}
              </p>
              <p className="contentLabel">No. Of Users: {memberList.length}</p>
              <p className="contentLabel">Member Names:</p>
              {memberList.length == 0 && "No one is in this group"}
              {memberList.length != 0 && (
                <ul className="scroll">
                  {memberList.map(
                    (name) => (
                      <li className="list-item">{name}</li>
                    )
                    // <ListItemText primary={name} />
                  )}
                </ul>
              )}
              {/* <button onClick={handleCancel} className="editBtn">
                Cancel
              </button>
              <button onClick={handleAddModal} className="editBtn">
                Add Users
              </button> */}
            </div>
          </div>
        </div>
      </div>
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
            <Offcanvas.Title className="canvasTitle">Add Users</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <FormControl sx={{ m: 1, width: 300 }}>
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
            <button
              type="submit"
              className="addBtn"
              onClick={(e) => handleSubmit(e)}
            >
              Add Users
            </button>
          </Offcanvas.Body>
        </Offcanvas>
      ))}
    </>
  );
};

export default ViewMembers;
