import React from "react";
import "../css/UpdateProfile.css.css";
import { useState, useEffect } from "react";
import userService from "../services/user.service";
import { useNavigate } from "react-router-dom";
import alertify from "alertifyjs";

const UpdateProfile = () => {
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [hasChanges, setChanges] = useState(false);
  const [disableButton, setDisable] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    userService.findUsername(localStorage.getItem("username")).then((res) => {
      if (res.result) {
        setNewEmail(res.result.email);
      }
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
  const handleBack = () => {
    var loginUserRole = localStorage.getItem("user_group").split(",");
    if (loginUserRole.includes("admin")) {
      navigate("/admin/home");
    } else {
      navigate("/home");
    }
  };
  const handlePasswordChange = (e) => {
    e.preventDefault();

    setNewPassword(e.target.value);
  };
  const handleEmailChange = (e) => {
    e.preventDefault();

    setNewEmail(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    await userService.verifyUser().then((res) => {
      if (res.auth) {
        if (newPassword != "") {
          var check = validatePassword(newPassword);
          if (!check.result) {
            alertify
              .alert(check.message.toString())
              .setHeader('<em style="color:black;">Error !</em>');
          } else {
            updateUserProfile(newPassword);
          }
        } else {
          updateUserProfile();
        }
      } else {
        alert("Sorry!,Session Timeout, Please Login Again!");
        navigate("/");
      }
    });
  };

  const updateUserProfile = async (newPassword) => {
    var editUser = {
      username: localStorage.getItem("username"),
      password: newPassword,
      email: newEmail,
    };
    await userService.updateProfile(editUser).then((res) => {
      if (res.result) {
        localStorage.setItem("loginEmail", newEmail);

        alertify.success("Profile Updated Successfully");
      } else {
        alertify.cancel("Profile Updated Failure");
      }
    });
    setChanges(!hasChanges);
    handleBack();
  };
  const handlePasswordPopup = (e) => {
    e.preventDefault();
    setChanges(!hasChanges);
  };
  return (
    <>
      <div className="Container">
        <p className="title">Update Profile</p>
        <div className="profileForm">
          <form>
            {hasChanges && (
              <fieldset>
                <div className="grid-35">
                  <label>New Password:</label>
                </div>
                <div className="grid-35">
                  <input
                    type="password"
                    className="form-control"
                    name="newPassword"
                    placeholder="NewPassword"
                    value={newPassword}
                    onChange={(e) => handlePasswordChange(e)}
                  />
                </div>
              </fieldset>
            )}
            <fieldset>
              <div className="grid-35">
                <label>New Email Address:</label>
              </div>
              <div className="grid-35">
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Email"
                  value={newEmail}
                  onChange={(e) => handleEmailChange(e)}
                  required="required"
                />
              </div>
            </fieldset>
            <button
              className="grid-15"
              onClick={(e) => handlePasswordPopup(e)}
              disabled={hasChanges ? true : false}
            >
              Change Password
            </button>
            <button className="cancelBtn" onClick={handleBack}>
              {" "}
              Cancel
            </button>
            <button type="submit" className="updateBtn" onClick={handleSubmit}>
              {" "}
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateProfile;
