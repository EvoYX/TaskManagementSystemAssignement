import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import userService from "../services/user.service";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import alertify from "alertifyjs";
import { ListItem } from "@mui/material";
import EditIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import State from "./State";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import KanbanBoard from "./KanbanBoard";

const ApplicationDashboard = () => {
  const [openPlanDialog, setPlanDialog] = useState(false);
  const [Plan_MVP_name, setPlan_MVP_name] = useState("");
  const [Plan_startDate, setPlan_startDate] = useState(null);
  const [Plan_endDate, setPlan_endDate] = useState(null);
  const [Plan_app_Acronym, setPlan_app_Acronym] = useState("");
  const [planList, setPlanList] = useState([]);
  const [updateDialog, setUpdateDialog] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [applicationDetail, setApplicationDetail] = useState([]);
  const [createTaskDialog, setCreateTaskDialog] = useState(false);

  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskAppAcronym, setTaskAppAcronym] = useState("");
  const [taskPlan, setTaskPlan] = useState("");
  const [taskCreator, setTaskCreator] = useState("");
  const [taskOwner, setTaskOwner] = useState(""); // last person who edit it
  const [taskCreateDate, setTaskCreateDate] = useState(null);

  const navigate = useNavigate();
  const handlePlanChange = (e) => {
    setTaskPlan(e.target.value);
  };
  const handleCreateTaskOpen = () => {
    setCreateTaskDialog(true);
  };
  const handleCreateTaskClose = () => {
    setCreateTaskDialog(false);
  };

  const handleCreateTask = () => {
    var rnum = "R" + (parseInt(applicationDetail.App_Rnumber.slice(1)) + 1);
    var task_id = applicationDetail.App_Acronym + "_" + rnum;
    var notes = new Date().toUTCString() + " Task Created";
    var user = localStorage.getItem("username");
    alert(new Date().toLocaleDateString());

    const task = {
      Task_id: task_id,
      Task_name: taskName,
      Task_description: taskDescription,
      Task_notes: notes,
      Task_plan: taskPlan,
      Task_app_acronym: applicationDetail.App_Acronym,
      Task_state: "Open",
      Task_owner: user,
      Task_creator: user,
      Task_createDate: new Date().toLocaleDateString(),
      App_Rnumber: rnum,
    };
    userService.createTask(task).then((res) => {
      if (res.result) {
        alertify.success(`${taskName} created successfully`);
        handleCreateTaskClose();
      } else {
        alertify.error("Fail to create task! Please try again!");
      }
    });
  };
  const handleUpdateTask = () => {
    // userService.createTask(task).then((res) => {
    //   if (res.result) {
    //     alertify.success(`${taskName} created successfully`);
    //     handleCreateTaskClose();
    //   } else {
    //     alertify.console.error("Failure! Please try create again!");
    //   }
    // });
  };

  useEffect(() => {
    userService
      .retrieveAllPlan(localStorage.getItem("selectedApplication"))
      .then((res) => {
        setPlanList(res.result);
      });
    userService
      .getApplication(localStorage.getItem("selectedApplication"))
      .then((res) => {
        setApplicationDetail(res.result[0]);
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

  return (
    <div>
      <div className="dashBoardHeader">
        {/* <p>{localStorage.getItem("selectedApplication")}</p> */}
      </div>
      <div className="appContainer">
        <h2>{applicationDetail.App_Acronym}</h2>
        <div>
          <p>Start Date: {applicationDetail.App_startDate}</p>
          <p>End Date: {applicationDetail.App_endDate}</p>
        </div>
        <div className="permissionContainer">
          <div className="permission">
            <p className="permisionTitle">App Permit Create</p>
            <p className="permissionDesc">
              {applicationDetail.App_permit_create}
            </p>
          </div>
          <div className="permission">
            <p className="permisionTitle">App Permit To-Do</p>
            <p className="permissionDesc">
              {applicationDetail.App_permit_toDoList}
            </p>
          </div>
          <div className="permission">
            <p className="permisionTitle">App Permit Doing</p>
            <p className="permissionDesc">
              {applicationDetail.App_permit_Doing}
            </p>
          </div>
          <div className="permission">
            <p className="permisionTitle">App Permit Done</p>
            <p className="permissionDesc">
              {applicationDetail.App_permit_Done}
            </p>
          </div>
        </div>
      </div>
      <div>
        <button className="dashBoardBtn" onClick={handleClickOpen}>
          Create Plan
        </button>
        <button className="dashBoardBtn" onClick={handleCreateTaskOpen}>
          Create Task
        </button>
      </div>

      <div className="flex-display">
        <div className="planContainer">
          <p className="planHeader">Plans</p>
          {planList.length != 0
            ? planList.map((res) => {
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
              })
            : ""}
        </div>
        <div className="kanbanContainer">
          <KanbanBoard></KanbanBoard>
        </div>
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

      {/* Create Task Dialog */}
      <Dialog open={createTaskDialog} onClose={handleCreateTaskClose}>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <div>
            <label>App Aconoym:</label>
            <label>{localStorage.getItem("selectedApplication")}</label>
          </div>
          <div>
            <label>Task Name:</label>
            <input
              type="text"
              className="form-control"
              name="taskName"
              placeholder="Task Name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
            />
          </div>
          <fieldset>
            <div className="grid-35">
              <label>Description:</label>
            </div>
            <div className="grid-65">
              <textarea
                id="txtArea"
                rows="10"
                cols="70"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
              ></textarea>
            </div>
          </fieldset>
          <fieldset>
            <FormControl sx={{ m: 0, width: 250 }} className="grid-100">
              <InputLabel id="demo-multiple-checkbox-label">
                Plan Aconoym
              </InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                value={taskPlan}
                onChange={handlePlanChange}
                input={<OutlinedInput label="Tag" />}
                MenuProps={MenuProps}
                className="customSelectGroup"
              >
                {planList.map((name) => (
                  <MenuItem key={name.Plan_MVP_name} value={name.Plan_MVP_name}>
                    <ListItemText primary={name.Plan_MVP_name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </fieldset>
        </DialogContent>
        <DialogActions>
          <button onClick={handleCreateTaskClose} className="editBtn">
            Cancel
          </button>
          <button onClick={handleCreateTask} className="editBtn">
            Create
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ApplicationDashboard;
