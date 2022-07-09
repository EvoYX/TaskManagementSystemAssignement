import React from "react";
import { Container } from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import TMSContext from "../TMSContext";

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

const CreateUser = (props) => {
  const navigate = useNavigate();
  const { setLoggedIn } = useContext(TMSContext);

  const [newusers, setNewUsers] = useState([]);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [userGroup, setUserGroup] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [userList, setUserList] = useState([]);

  const ITEM_HEIGHT = 40;
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
    userService.getAllUsers().then((res) => {
      if (res.message === "Found") {
        setUserList(res.result.map((res) => res.username));
      }
    });
  }, []);
  const validatePassword = (value) => {
    console.log("s", value);

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
    var validate = validatePassword(newPassword);
    if (!validate.result) {
      alertify
        .alert(validate.message)
        .setHeader('<em style="color:black;">Error !</em>');
    } else if (userList.includes(newUsername)) {
      alertify
        .alert("Duplicate Username Found")
        .setHeader('<em style="color:black;">Error !</em>');
    } else {
      var newUser = {
        username: newUsername,
        email: newEmail,
        password: newPassword,
        status: "Enable",
        userGroups: userGroup,
      };
      await userService.verifyUser().then((res) => {
        if (res.auth) {
          userService.createUser(newUser).then((res) => {
            for (let i = 0; i < userGroup.length; i++) {
              const groupdetail = {
                username: newUsername,
                groupname: userGroup[i],
              };
              userService.createGroupByUser(groupdetail).then((res) => {
                console.log("added");
              });
            }
            userService.getAllUsers().then((res) => {
              if (res.message === "Found") props.setUserList(res.result);
            });
            alertify.success(
              "User " + newUsername + " is created successfully"
            );
          });
        } else {
          localStorage.clear();
          setLoggedIn(false);
          alertify.error("Session Timeout, Please Login Again!");
          navigate("/");
        }
      });
      setNewUsername("");
      setNewEmail("");
      setNewPassword("");
      setNewEmail("");
      setUserGroup([]);
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
      <form onSubmit={handleSubmit}>
        <fieldset>
          <input
            type="text"
            name="username"
            className="grid-100"
            placeholder="Username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value.trim())}
            required="required"
          />
        </fieldset>
        <fieldset>
          <input
            type="password"
            className="grid-100"
            name="password"
            placeholder="Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required="required"
          />
        </fieldset>
        <fieldset>
          <input
            type="text"
            className="grid-100"
            name="email"
            placeholder="Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value.trim())}
          />
        </fieldset>
        <fieldset>
          <InputLabel id="demo-multiple-checkbox-label" className="groupTitle">
            Groups
          </InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={userGroup}
            onChange={handleChange}
            input={<OutlinedInput label="Groups" />}
            renderValue={(selected) => selected.join(", ")}
            MenuProps={MenuProps}
            className="grid-100"
          >
            {groupList.map((name) => (
              <MenuItem key={name} value={name}>
                <Checkbox checked={userGroup.indexOf(name) > -1} />
                <ListItemText primary={name} />
              </MenuItem>
            ))}
          </Select>
        </fieldset>

        <div className="btnGroup">
          <button type="submit" className="addBtn">
            Add
          </button>
        </div>
      </form>
    </>
  );
};

export default CreateUser;
