import React from "react";
import { Container } from "react-bootstrap";
import { useState, useEffect } from "react";
import "../../css/CreateUser.css.css";
import userService from "../../services/user.service";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { useNavigate } from "react-router-dom";
import alertify from "alertifyjs";
import "../../../src/alertify/css/themes/bootstrap.css";

const API_URL = "http://localhost:8080/";

const CreateUser = () => {
  const navigate = useNavigate();

  const [newusers, setNewUsers] = useState([]);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [userGroup, setUserGroup] = useState([]);
  const [groupList, setGroupList] = useState([]);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 200,
      },
    },
  };

  /* getting all the group */
  useEffect(() => {
    userService.getAllGroup().then((res) => {
      if (res.message === "Found")
        setGroupList(res.result.map((res) => res.name));
    });
  }, []);
  const validatePassword = (value) => {
    var regularExpression =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    if (value.length < 8 || value.length > 10) {
      return {
        result: false,
        message:
          "Password needs to be at least 8 character and must not excceed  10 characters",
      };
    } else if (!regularExpression.test(value)) {
      return {
        result: false,
        message:
          "Password must comprise of alphabets , numbers, and special character ",
      };
    } else
      return {
        result: true,
        message: "Correct password",
      };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(localStorage.getItem("access-token"));
    var validate = validatePassword(newPassword);
    if (!validate.result) {
      alert(validate.message);
    } else {
      var newUser = {
        username: newUsername,
        email: newEmail,
        password: newPassword,
        status: "enable",
        userGroups: userGroup,
      };
      console.log("the final is", userGroup);
      await userService.verifyUser().then((res) => {
        console.log("the responds in verify is ", res);
        if (res.auth) {
          userService.createUser(newUser).then((res) => {
            for (let i = 0; i < userGroup.length; i++) {
              const groupdetail = {
                username: newUsername,
                groupname: userGroup[i],
              };
              userService.createGroupByUser(groupdetail).then((res) => {
                console.log("addded");
              });
            }
            alertify.success(
              "User " + newUsername + " is created successfully"
            );
          });
        } else {
          alert("Session Timeout, please login again!");
          navigate("/");
        }
      });
    }
  };

  const handleSelect = async (e) => {
    e.preventDefault();
    setUserGroup(e.target.value);
  };
  const handleChange = (event: SelectChangeEvent<typeof userGroup>) => {
    const {
      target: { value },
    } = event;
    setUserGroup(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <>
      <Container className="container">
        <div className="title"> Add New User</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group formgroup">
            <input
              type="text"
              className="form-control"
              name="username"
              placeholder="Username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              required="required"
            />
          </div>
          <div className="form-group formgroup">
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required="required"
            />
          </div>
          <div className="form-group formgroup">
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required="required"
            />
          </div>
          <FormControl sx={{ m: 1, width: 250 }}>
            <InputLabel id="demo-multiple-checkbox-label">Group</InputLabel>

            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={userGroup}
              onChange={handleChange}
              input={<OutlinedInput label="Tag" />}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
              className="customSelectGroup"
            >
              {groupList.map((name) => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={userGroup.indexOf(name) > -1} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
            <div className="preview-values">
              <b>Groups: </b>
              {userGroup}
            </div>
          </FormControl>

          <div className="form-group">
            <button type="submit" className="btn">
              Add
            </button>
          </div>
        </form>
      </Container>
      ;
    </>
  );
};

export default CreateUser;
