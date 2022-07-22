import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState, useEffect } from "react";
import userService from "../services/user.service";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import alertify from "alertifyjs";
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import KanbanBoard from "./KanbanBoard";
import { BsClipboardPlus, BsCalendar2Plus } from "react-icons/bs";
import Plan from "./Plan";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
const ApplicationDashboard = () => {
  const [openPlanDialog, setPlanDialog] = useState(false);
  const [Plan_MVP_name, setPlan_MVP_name] = useState("");
  const [Plan_startDate, setPlan_startDate] = useState(null);
  const [Plan_endDate, setPlan_endDate] = useState(null);
  const [Plan_app_Acronym, setPlan_app_Acronym] = useState("");
  const [Plan_description, setPlanDescription] = useState("");
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
  const [hasCreateTask, setHasCreateTask] = useState(false);
  const handlePlanChange = (e) => {
    setTaskPlan(e.target.value);
  };
  const handleCreateTaskOpen = () => {
    if (
      localStorage
        .getItem("user_group")
        .split(",")
        .includes(applicationDetail.App_permit_create)
    ) {
      setCreateTaskDialog(true);
    } else {
      alertify.error(
        "You are not authorised to create new Task! Please contact admin for help!"
      );
    }
  };
  const handleCreateTaskClose = () => {
    setTaskName("");
    setTaskDescription("");
    setTaskPlan("");
    setTaskCreator("");
    setTaskOwner("");
    setTaskCreateDate(null);
    setCreateTaskDialog(false);
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    localStorage.removeItem("hasCreateTask");
    if (taskName == "") {
      alertify.error("Please Enter The Task Name!");
    } else {
      var rnum = "R" + (parseInt(applicationDetail.App_Rnumber.slice(1)) + 1);
      var task_id = applicationDetail.App_Acronym + "_" + rnum;
      var user = localStorage.getItem("username");
      var notes =
        "Current State: Open, " +
        new Date().toUTCString() +
        " Task Created By " +
        user;

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
          userService
            .getApplication(localStorage.getItem("selectedApplication"))
            .then((res) => {
              setApplicationDetail(res.result[0]);
              handleCreateTaskClose();
            });
        } else {
          alertify.error("Fail to create task! Please try again!");
        }
      });
    }
  };

  useEffect(() => {
    userService
      .retrieveAllPlan(localStorage.getItem("selectedApplication"))
      .then((res) => {
        if (res.result == false) {
          setPlanList([]);
        }
        if (res.result.length) {
          setPlanList(res.result);
        }
      });
    userService
      .getApplication(localStorage.getItem("selectedApplication"))
      .then((res) => {
        setApplicationDetail(res.result[0]);
      });
  }, []);
  const handleClickOpen = (e) => {
    e.preventDefault();
    if (
      localStorage.getItem("user_group").split(",").includes("Project Manager")
    ) {
      setPlanDialog(true);
    } else {
      alertify.error(
        "You are not authorised to create new Plan! Please contact admin for help!"
      );
    }
  };
  const handleUpdateOpen = (plan) => {
    setPlan_MVP_name(plan.Plan_MVP_name);
    setPlan_startDate(plan.Plan_startDate);
    setPlan_endDate(plan.Plan_endDate);
    setPlanDescription(plan.Plan_description);

    setUpdateDialog(true);
  };
  const handleUpdateClose = () => {
    setPlan_MVP_name("");
    setPlan_startDate(null);
    setPlan_endDate(null);
    setPlanDescription("");
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
      Plan_description: Plan_description,
    };
    userService.updatePlan(plan).then((res) => {
      if (res.result) {
        alertify.success(`${Plan_MVP_name} update successfully`);
        userService
          .retrieveAllPlan(localStorage.getItem("selectedApplication"))
          .then((res) => {
            if (res.result == false) {
              setPlanList([]);
            }
            if (res.result.length) {
              setPlanList(res.result);
            }
          });
        handleUpdateClose();
      } else {
        alertify.error("Failed to update! Please try again!");
      }
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    var app_acronym = localStorage.getItem("selectedApplication");
    if (Plan_MVP_name == "") {
      alertify.error("Please Enter The Plan Name!");
    } else {
      const plan = {
        Plan_MVP_name: Plan_MVP_name,
        Plan_startDate: Plan_startDate,
        Plan_endDate: Plan_endDate,
        Plan_app_Acronym: app_acronym,
        Plan_description: Plan_description,
      };
      userService.createPlan(plan).then((res) => {
        if (res.result) {
          alertify.success(`${Plan_MVP_name} Created Successfully`);
          setPlan_MVP_name("");
          setPlan_startDate(null);
          setPlan_endDate(null);
          setPlanDescription("");
          userService
            .retrieveAllPlan(localStorage.getItem("selectedApplication"))
            .then((res) => {
              if (res.result == false) {
                setPlanList([]);
              }
              if (res.result.length) {
                setPlanList(res.result);
              }
            });
        } else {
          alertify.error(
            "Duplicated Plan Found! Please enter different plan name!"
          );
        }
      });
      setPlanDialog(false);
    }
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
  const btnStyle = {
    "border-top": "none",
    background: "transparent",
    "margin-right": "20px",
    border: "1px solid #f9fafb",
  };
  return (
    <div>
      <div className="breadCrumb">
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            underline="hover"
            color="white"
            className="customLink"
            href={
              localStorage.getItem("setIsAdmin") == "true"
                ? "/admin/home"
                : "/home"
            }
          >
            Home
          </Link>
          <Link
            underline="hover"
            className="customLink"
            color="white"
            href="/home/applications"
          >
            Applications
          </Link>
          <Link
            underline="hover"
            color="white"
            className="customLink"
            href="/home/applications/detail"
          >
            {localStorage.getItem("selectedApplication")}
          </Link>
          <Typography className="linkText">Kanban Board</Typography>
        </Breadcrumbs>
      </div>
      <div className="planContainer">
        <div className="planContainerHeader">
          <div></div>
          <div>
            <p className="planHeader">
              {localStorage.getItem("selectedApplication")} Plans
            </p>
          </div>
          <div>
            <Button
              variant="contained"
              endIcon={<BsClipboardPlus />}
              onClick={handleClickOpen}
              className="icnAddBtn"
              style={btnStyle}
            >
              Add Plan
            </Button>
          </div>
        </div>
        {planList.length == 0 && (
          <div className="noTask">
            <h2>No Plans</h2>
          </div>
        )}
        {planList.length != 0 && (
          <div className="scrollPlan">
            {planList.length != 0 &&
              planList.map((res) => {
                return (
                  <div
                    onClick={(e) => {
                      handleUpdateOpen(res);
                    }}
                  >
                    <Plan data={res} />
                  </div>
                );
              })}
          </div>
        )}
      </div>

      <div className="planContainerHeader">
        <div></div>
        <div> </div>
        <div>
          <Button
            variant="contained"
            endIcon={<BsCalendar2Plus />}
            onClick={handleCreateTaskOpen}
            style={btnStyle}
          >
            Add Task
          </Button>
          {/* <button
            type="button"
            className="icnBtn"
            data-toggle="tooltip"
            data-placement="top"
            title="Add New Task"
            
          >
            <BsCalendar2Plus
              onClick={handleCreateTaskOpen}
              className="addIconMedium"
            />
            Add New Task
          </button> */}
        </div>
      </div>

      <div className="flex-display">
        <div className="kanbanContainer">
          <KanbanBoard
            hasCreate={hasCreateTask}
            application={applicationDetail}
            setApplicationDetail={setApplicationDetail}
            appPlan={planList}
          ></KanbanBoard>
        </div>
      </div>

      {/* Create Dialog */}
      <Dialog open={openPlanDialog} onClose={handleClose}>
        <DialogTitle>Create New Plan</DialogTitle>
        <DialogContent>
          <div>
            <label className="formInputTitle">App Name:</label>
            <label>{localStorage.getItem("selectedApplication")}</label>
          </div>
          <div className="formSection">
            <label className="formInputTitle">Plan Name:</label>
            <input
              type="text"
              className="form-control formInputText"
              name="appName"
              placeholder="Plan Name"
              value={Plan_MVP_name}
              onChange={(e) => setPlan_MVP_name(e.target.value)}
              required
            />
          </div>
          <div className="formSection">
            <label className="formInputTitle">Description:</label>
            <textarea
              id="txtArea"
              rows="5"
              cols="55"
              value={Plan_description}
              className="formTextArea"
              onChange={(e) => setPlanDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="formSection">
            <label className="formInputTitle">Start Date:</label>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={Plan_startDate}
                inputFormat="dd/MM/yyyy"
                onChange={(newValue) => {
                  setPlan_startDate(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </div>
          <div className="formSection">
            <label className="formInputTitle">End Date:</label>

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
          <button onClick={handleClose} className="editBtn">
            Cancel
          </button>
          <button
            onClick={(e) => {
              handleSubmit(e);
            }}
            className="editBtn"
          >
            Create
          </button>
        </DialogActions>
      </Dialog>
      {/* Update Dialog */}
      <Dialog open={updateDialog} onClose={handleUpdateClose}>
        <DialogTitle>Update {Plan_MVP_name}</DialogTitle>
        <DialogContent>
          <div className="formSection">
            <label className="formInputTitle">App Name:</label>
            <label>{localStorage.getItem("selectedApplication")}</label>
          </div>
          <div className="formSection">
            <label className="formInputTitle">Plan Name:</label>
            <label>{Plan_MVP_name ?? "NO PLan"}</label>
          </div>
          <div className="formSection">
            <label className="formInputTitle">Description:</label>
            <textarea
              id="txtArea"
              rows="5"
              cols="55"
              value={Plan_description}
              className="formTextArea"
              onChange={(e) => setPlanDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="formSection">
            <label className="formInputTitle">Start Date</label>
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
          <div className="formSection">
            <label className="formInputTitle">End Date</label>
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
          <div className="formSection">
            <label className="formInput200">App Aconoym:</label>
            <label>{localStorage.getItem("selectedApplication")}</label>
          </div>
          <div className="formSection">
            <label className="formInput200">Task Name:</label>
            <input
              type="text"
              className="form-control formResizeInput"
              name="taskName"
              placeholder="Task Name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
            />
          </div>
          <div className="formSection">
            <label className="formInput200">Task Description:</label>
            <textarea
              id="txtArea"
              rows="5"
              cols="55"
              value={taskDescription}
              className="formTextArea"
              onChange={(e) => setTaskDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="formSection">
            <label className="formInput200">Plan Aconoym</label>
            <FormControl sx={{ m: 0, width: 250 }}>
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
                {planList.length > 0
                  ? planList.map((name) => (
                      <MenuItem
                        key={name.Plan_MVP_name}
                        value={name.Plan_MVP_name}
                      >
                        <ListItemText primary={name.Plan_MVP_name} />
                      </MenuItem>
                    ))
                  : []}
              </Select>
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <button onClick={handleCreateTaskClose} className="editBtn">
            Cancel
          </button>
          <button
            onClick={(e) => {
              handleCreateTask(e);
            }}
            className="editBtn"
          >
            Create
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ApplicationDashboard;
