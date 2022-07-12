import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../services/user.service";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import alertify from "alertifyjs";
import { ListItem } from "@mui/material";
import EditIcon from "@mui/icons-material/ModeEditOutlineOutlined";

const ApplicationDashboard = () => {
  const [openPlanDialog, setPlanDialog] = useState(false);
  const [Plan_MVP_name, setPlan_MVP_name] = useState("");
  const [Plan_startDate, setPlan_startDate] = useState(null);
  const [Plan_endDate, setPlan_endDate] = useState(null);
  const [Plan_app_Acronym, setPlan_app_Acronym] = useState("");
  const [planList, setPlanList] = useState([]);
  const [updateDialog, setUpdateDialog] = useState(false);
  useEffect(() => {
    userService
      .retrieveAllPlan(localStorage.getItem("selectedApplication"))
      .then((res) => {
        setPlanList(res.result);
      });
  }, []);
  const handleClickOpen = () => {
    userService
      .checkGroup(localStorage.getItem("username"), "Project Manager")
      .then((res) => {
        console.log(res);
        if (res.result) {
          setPlanDialog(true);
        } else {
          alertify.error(
            "You are not authorised to create new Plan! Please contact admin for help!"
          );
        }
      });
  };
  const handleUpdateOpen = (plan) => {
    setPlan_MVP_name(plan.Plan_MVP_name);
    setPlan_startDate(plan.Plan_startDate);
    setPlan_endDate(plan.Plan_endDate);
    setUpdateDialog(true);
  };
  const handleUpdateClose = () => {
    setPlan_MVP_name("");
    setPlan_startDate(null);
    setPlan_endDate(null);
    setUpdateDialog(false);
  };
  const handleClose = () => {
    setPlanDialog(false);
  };
  const handleUpdate = () => {
    var app_acronym = localStorage.getItem("selectedApplication");

    const plan = {
      Plan_MVP_name: Plan_MVP_name,
      Plan_startDate: Plan_startDate,
      Plan_endDate: Plan_endDate,
      Plan_app_Acronym: app_acronym,
    };
    userService.updatePlan(plan).then((res) => {
      if (res.result) {
        alertify.success(`${Plan_MVP_name} update successfully`);
        userService
          .retrieveAllPlan(localStorage.getItem("selectedApplication"))
          .then((res) => {
            console.log("res", res.result);
            setPlanList(res.result);
          });
        handleUpdateClose();
      } else {
        alertify.error("Failed to update! Please try again!");
      }
    });
  };
  const handleSubmit = () => {
    var app_acronym = localStorage.getItem("selectedApplication");
    const plan = {
      Plan_MVP_name: Plan_MVP_name,
      Plan_startDate: Plan_startDate,
      Plan_endDate: Plan_endDate,
      Plan_app_Acronym: app_acronym,
    };
    userService.createPlan(plan).then((res) => {
      if (res.result) {
        alertify.success(`${Plan_MVP_name} Created Successfully`);
        setPlan_MVP_name("");
        setPlan_startDate(null);
        setPlan_endDate(null);
        userService
          .retrieveAllPlan(localStorage.getItem("selectedApplication"))
          .then((res) => {
            setPlanList(res.result);
          });
      } else {
        alertify.error(
          "Duplicated Plan Found! Please enter different plan name!"
        );
      }
    });
    setPlanDialog(false);
  };
  return (
    <div>
      <div className="dashBoardHeader">
        {/* <p>{localStorage.getItem("selectedApplication")}</p> */}
      </div>
      <button className="dashBoardBtn" onClick={handleClickOpen}>
        Create Plan
      </button>
      <div className="planContainer">
        <p className="planHeader">Plans</p>
        {planList.map((res) => {
          return (
            <div className="task" draggable="true">
              <div className="task__tags">
                <span className="task__tag task__tag--copyright">
                  {res.Plan_MVP_name}
                </span>

                <button
                  className="project-column-heading__options"
                  onClick={() => {
                    handleUpdateOpen(res);
                  }}
                >
                  <EditIcon />
                </button>
              </div>
              <p>{res.Plan_MVP_name}</p>
              <div class="task__stats">
                <p>Start Date:</p>
                <p>{res.Plan_startDate}</p>
                <p>End Date:</p>
                <p>{res.Plan_endDate}</p>
              </div>
            </div>
          );
        })}
      </div>
      {/* Create Dialog */}
      <Dialog open={openPlanDialog} onClose={handleClose}>
        <DialogTitle>Create New Plan</DialogTitle>
        <DialogContent>
          <div>
            <label>App Name:</label>
            <label>{localStorage.getItem("selectedApplication")}</label>
          </div>
          <div>
            <label>Plan Name:</label>
            <input
              type="text"
              className="form-control"
              name="appName"
              placeholder="Plan Name"
              value={Plan_MVP_name}
              onChange={(e) => setPlan_MVP_name(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Start Date</label>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={Plan_startDate}
                inputFormat="dd-MM-yyyy"
                onChange={(newValue) => {
                  setPlan_startDate(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </div>
          <div>
            <label> End Date</label>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={Plan_endDate}
                inputFormat="dd-MM-yyyy"
                onChange={(newValue) => {
                  setPlan_endDate(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </div>
        </DialogContent>
        <DialogActions>
          <button onClick={handleClose} className="editBtn">
            Cancel
          </button>
          <button onClick={handleSubmit} className="editBtn">
            Create
          </button>
        </DialogActions>
      </Dialog>
      {/* Update Dialog */}
      <Dialog open={updateDialog} onClose={handleUpdateClose}>
        <DialogTitle>Update {Plan_MVP_name}</DialogTitle>
        <DialogContent>
          <div>
            <label>App Name:</label>
            <label>{localStorage.getItem("selectedApplication")}</label>
          </div>
          <div>
            <label>Plan Name:</label>
            <label>{Plan_MVP_name ?? "NO PLan"}</label>
          </div>
          <div>
            <label>Start Date</label>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={Plan_startDate}
                inputFormat="dd-MM-yyyy"
                onChange={(newValue) => {
                  setPlan_startDate(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </div>
          <div>
            <label> End Date</label>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="End Date"
                value={Plan_endDate}
                inputFormat="dd-MM-yyyy"
                onChange={(newValue) => {
                  setPlan_endDate(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </div>
        </DialogContent>
        <DialogActions>
          <button onClick={handleUpdateClose} className="editBtn">
            Cancel
          </button>
          <button onClick={handleUpdate} className="editBtn">
            Update
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ApplicationDashboard;
