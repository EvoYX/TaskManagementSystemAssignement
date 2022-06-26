import React from "react";
import "../../css/EditUser.css.css";
import { useState, useEffect } from "react";
import userService from "../../services/user.service";
import { useNavigate } from "react-router-dom";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";

const EditUser = () => {
  const navigate = useNavigate();
  const [editUser, setEditUser] = useState([]);
  const [editUsername, setEditUsername] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editGroup, setEditGroup] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [groupDetailList, setGroupDetailList] = useState([]);
  const [openPasswordField, setOpenPasswordField] = useState(false);

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
  const handleChange = (event: SelectChangeEvent<typeof editGroup>) => {
    const {
      target: { value },
    } = event;
    setEditGroup(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  console.log("the edit group is", editGroup);
  const handleChangePasswordField = (e) => {
    e.preventDefault();
    setOpenPasswordField(!openPasswordField);
  };
  useEffect(() => {
    userService
      .findUsername(localStorage.getItem("selectedUsername"))
      .then((res) => {
        if (res.message === "Found") {
          setEditUser(res.result);
          setEditEmail(res.result.email);
          setEditGroup(res.result.user_group.split(","));
          // setEditGroup(res.result);
        }
      });
    /* getting all the group */
    userService.getAllGroup().then((res) => {
      if (res.message === "Found")
        setGroupList(res.result.map((res) => res.name));
      setGroupDetailList(res.result.map((res) => res));
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

    await userService.verifyUser().then((res) => {
      if (res.auth) {
        if (editPassword != "") {
          var check = validatePassword(editPassword);
          if (!check.result) {
            alertify.alert(check.message.toString());
          } else {
            updateprofile(editPassword);
          }
        } else {
          updateprofile();
        }
      } else {
        alert("Sorry!,Session Timeout, Please Login Again!");
        navigate("/");
      }
    });
  };
  const updateprofile = (editPassword) => {
    var editUser = {
      username: localStorage.getItem("selectedUsername"),
      password: editPassword,
      email: editEmail,
      user_group: editGroup,
    };

    userService.updateProfile(editUser).then((res) => {
      if (res.result) {
        var user = {
          username: localStorage.getItem("selectedUsername"),
        };
        userService.deleteGroupByUser(user).then((res) => {
          if (res.result) {
            for (let i = 0; i < editGroup.length; i++) {
              var groupdetail = {
                username: localStorage.getItem("selectedUsername"),
                groupname: editGroup[i],
              };
              userService.createGroupByUser(groupdetail).then((res) => {
                if (res.result) {
                  console.log("create succcesfully");
                }
              });
            }
          }
        });
        alertify.success(
          localStorage.getItem("selectedUsername") +
            " profile is being updated successfully"
        );
      }
    });
  };
  const handleCancel = () => {};
  return (
    <>
      <div className="wrapper">
        <div className="profile">
          <div className="content">
            <h1>Edit Profile</h1>
            <form action="">
              <fieldset>
                <div className="grid-50">
                  <label>{localStorage.getItem("selectedUsername")}</label>
                </div>
              </fieldset>

              {openPasswordField && (
                <fieldset>
                  <div className="grid-35">
                    <label>NewPassword:</label>
                  </div>
                  <div className="grid-65">
                    <input
                      type="password"
                      className="form-control"
                      name="newPassword"
                      placeholder="NewPassword"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      required="required"
                    />
                  </div>
                </fieldset>
              )}
              <fieldset>
                <div className="grid-35">
                  <label>Email:</label>
                </div>
                <div className="grid-65">
                  <input
                    type="text"
                    className="form-control"
                    name="email"
                    placeholder="Email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    required="required"
                  />
                </div>
              </fieldset>
              <fieldset>
                <div className="grid-35">
                  <label>Group:</label>
                </div>
                <FormControl sx={{ m: 0, width: 230 }} className="grid-35">
                  <InputLabel id="demo-multiple-checkbox-label">
                    Group
                  </InputLabel>

                  <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={editGroup}
                    onChange={handleChange}
                    input={<OutlinedInput label="Tag" />}
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={MenuProps}
                    className="customSelectGroup"
                  >
                    {groupList.map((name) => (
                      <MenuItem key={name} value={name}>
                        <Checkbox checked={editGroup.indexOf(name) > -1} />
                        <ListItemText primary={name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <div className="preview">
                  <p className="previewTitle">Selected Group:</p>
                  <p className="previewText">{editGroup}</p>
                </div>
              </fieldset>

              <button onClick={handleChangePasswordField} className="linkBtn">
                Click Here To Change Password
              </button>
              <br />
              {/* <input type="button" class="Btn cancel" value="Cancel" />
              <input type="submit" className="Btn" value="Save Changes" /> */}
              <button onClick={handleCancel} className="editBtn">
                Cancel
              </button>
              <button onClick={handleSubmit} className="editBtn">
                Upate
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditUser;
