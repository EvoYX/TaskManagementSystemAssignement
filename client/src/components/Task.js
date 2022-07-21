import React from "react";
import { useState, useEffect } from "react";
import userService from "../services/user.service";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import alertify from "alertifyjs";
import { ListItem } from "@mui/material";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useDrag, useDrop } from "react-dnd";
import { BsFillArrowRightSquareFill, BsEyeFill } from "react-icons/bs";
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/ModeEditOutlineOutlined";

const Task = (props) => {
  const [updateTaskDialog, setUpdateTaskDialog] = useState(false);
  const [viewTaskDialog, setViewTaskDialog] = useState(false);

  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskAppAcronym, setTaskAppAcronym] = useState("");
  const [taskNotes, setTaskNotes] = useState("");
  const [taskPlan, setTaskPlan] = useState("");
  const [taskOwner, setTaskOwner] = useState(""); // last person who edit it
  const [planList, setPlanList] = useState("");
  const [currentNotes, setCurrentNotes] = useState("");
  const [hasApproveBtn, setApproveBtn] = useState(false);
  const [oldDesc, setOldDesc] = useState("");
  const [oldPlan, setOldPlan] = useState("");
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
  }, [props.appPlan]);
  const handleViewTaskClose = () => {
    setViewTaskDialog(false);
  };
  const handleViewTaskOpen = () => {
    setViewTaskDialog(true);
  };

  const handleUpdateTaskClose = () => {
    setTaskName("");
    setTaskDescription("");
    setTaskAppAcronym("");
    setTaskPlan("");
    setTaskNotes("");
    setUpdateTaskDialog(false);
  };
  const handleUpdateTaskOpen = (task) => {
    setTaskName(task.Task_name);
    setTaskDescription(task.Task_description);
    setOldDesc(task.Task_description);
    setTaskAppAcronym(task.Task_app_acronym);
    setTaskPlan(task.Task_plan);
    setOldPlan(task.Task_plan);
    setCurrentNotes(task.Task_notes);

    setUpdateTaskDialog(true);
  };
  const handlePlanChange = (e) => {
    setTaskPlan(e.target.value);
  };
  const handleUpdateTask = () => {
    var user = localStorage.getItem("username");
    var notes = "";
    if (oldDesc != taskDescription) {
      notes += " " + user + " change description to " + taskDescription + "\n";
    }
    if (taskNotes != "") {
      notes += " " + user + " add notes: " + taskNotes + "\n";
    }
    if (oldPlan != taskPlan) {
      notes += " " + user + " change the plan to" + taskPlan + "\n";
    }
    const task = {
      Task_id: props.data.Task_id,
      Task_name: taskName,
      Task_description: taskDescription,
      Task_notes:
        "Current state: " +
        props.data.Task_state +
        ", " +
        new Date().toUTCString() +
        notes,
      Task_plan: taskPlan,
      Task_owner: user,
      oldNotes: props.data.Task_notes,
    };
    userService.updateTask(task).then((res) => {
      if (res.result) {
        alertify.success("update successfully");
        userService
          .getApplication(localStorage.getItem("selectedApplication"))
          .then((res) => {
            props.setApplicationDetail(res.result[0]);
            handleUpdateTaskClose();
          });
      } else {
        alertify.error("fail");
      }
    });
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
  const retrieveTasks = async () => {
    var appName = localStorage.getItem("selectedApplication");
    let openList = [];
    let doingList = [];
    let doneList = [];
    let toDoList = [];
    let closeList = [];
    const openTask = {
      Task_app_acronym: appName,
      Task_state: "Open",
    };
    const toDoTask = {
      Task_app_acronym: appName,
      Task_state: "To Do",
    };
    const doingTask = {
      Task_app_acronym: appName,
      Task_state: "Doing",
    };
    const doneTask = {
      Task_app_acronym: appName,
      Task_state: "Done",
    };
    const closeTask = {
      Task_app_acronym: appName,
      Task_state: "Close",
    };
    await userService.retrieveTasksByStatus(openTask).then((res) => {
      if (res.result.length) {
        openList = { name: "Open", task: res.result };
      } else {
        openList = { name: "Open", task: [] };
      }
    });
    await userService.retrieveTasksByStatus(toDoTask).then((res) => {
      if (res.result.length) {
        toDoList = { name: "To Do", task: res.result };
      } else {
        toDoList = { name: "To Do", task: [] };
      }
    });
    await userService.retrieveTasksByStatus(doingTask).then((res) => {
      if (res.result.length) {
        doingList = { name: "Doing", task: res.result };
      } else {
        doingList = { name: "Doing", task: [] };
      }
    });
    await userService.retrieveTasksByStatus(doneTask).then((res) => {
      if (res.result.length) {
        doneList = { name: "Done", task: res.result };
      } else {
        doneList = { name: "Done", task: [] };
      }
    });
    await userService.retrieveTasksByStatus(closeTask).then((res) => {
      if (res.result.length) {
        closeList = { name: "Close", task: res.result };
      } else {
        closeList = { name: "Close", task: [] };
      }
    });
    props.setTaskList([openList, toDoList, doingList, doneList, closeList]);
  };
  const handleApprove = (e) => {
    e.preventDefault();
    const task = { Task_id: props.data.Task_id, Task_state: "To Do" };
  };
  const handleStateChangeNext = (e) => {
    e.preventDefault();
    switch (props.data.Task_state) {
      case "Open": {
        var loginUser = localStorage.getItem("username");

        var notes =
          "Current state: To Do, " +
          new Date().toUTCString() +
          " " +
          loginUser +
          " change from Open state to To Do state";
        var loginUser = localStorage.getItem("username");
        const task = {
          Task_id: props.data.Task_id,
          Task_state: "To Do",
          Task_notes: notes,
          Task_owner: loginUser,
          oldNotes: props.data.Task_notes,
        };
        userService.changeTaskStatus(task).then((respond) => {
          if (respond.result) {
            alertify.success("Task Update Successfully");
            retrieveTasks();
          } else {
            alertify.error("Update Fail! Please try again!");
          }
        });
        break;
      }

      case "To Do": {
        var loginUser = localStorage.getItem("username");
        var notes =
          "Current state: Doing, " +
          new Date().toUTCString() +
          " " +
          loginUser +
          " change from To Do state to Doing state";
        const task = {
          Task_id: props.data.Task_id,
          Task_state: "Doing",
          Task_notes: notes,
          Task_owner: loginUser,
          oldNotes: props.data.Task_notes,
        };
        userService.changeTaskStatus(task).then((respond) => {
          if (respond.result) {
            alertify.success("Task Update Successfully");
            retrieveTasks();
          } else {
            alertify.error("Update Fail! Please try again!");
          }
        });

        break;
      }
      case "Doing": {
        var loginUser = localStorage.getItem("username");
        var notes =
          "Current state: Done, " +
          new Date().toUTCString() +
          " " +
          loginUser +
          " change from Doing state to Done state";
        const task = {
          Task_id: props.data.Task_id,
          Task_state: "Done",
          Task_notes: notes,
          Task_owner: loginUser,
          oldNotes: props.data.Task_notes,
        };
        userService.changeTaskStatus(task).then((respond) => {
          if (respond.result) {
            alertify.success("Task Update Successfully");
          } else {
            alertify.error("Update Fail! Please try again!");
          }
        });
        var username = localStorage.getItem("username");
        var userEmail = localStorage.getItem("loginEmail");
        const email = {
          username: username,
          email: userEmail,
          task: props.data.Task_id,
        };
        userService.sendEmail(email);
        retrieveTasks();
        break;
      }
      case "Done": {
        var loginUser = localStorage.getItem("username");
        var notes =
          "Current state: Close, " +
          new Date().toUTCString() +
          " " +
          loginUser +
          " change from Done state to Close state";
        const task = {
          Task_id: props.data.Task_id,
          Task_state: "Close",
          Task_notes: notes,
          Task_owner: loginUser,
          oldNotes: props.data.Task_notes,
        };
        userService.changeTaskStatus(task).then((respond) => {
          if (respond.result) {
            alertify.success("Task Update Successfully");
            retrieveTasks();
          } else {
            alertify.error("Update Fail! Please try again!");
          }
        });
        break;
      }
      default:
        return;
    }
  };
  const handleStateChangeBack = (e) => {
    e.preventDefault();
    switch (props.data.Task_state) {
      case "Doing": {
        var loginUser = localStorage.getItem("username");
        var notes =
          "Current state: To Do, " +
          new Date().toUTCString() +
          " " +
          loginUser +
          " " +
          "change from Doing state to To Do state";
        const task = {
          Task_id: props.data.Task_id,
          Task_state: "To Do",
          Task_notes: notes,
          Task_owner: loginUser,
          oldNotes: props.data.Task_notes,
        };
        userService.changeTaskStatus(task).then((respond) => {
          if (respond.result) {
            alertify.success("Task Update Successfully");
            retrieveTasks();
          } else {
            alertify.error("Update Fail! Please try again!");
          }
        });
        break;
      }
      case "Done": {
        var loginUser = localStorage.getItem("username");
        var notes =
          "Current state: Doing, " +
          new Date().toUTCString() +
          " " +
          loginUser +
          " change from Doing state to Doing state";
        const task = {
          Task_id: props.data.Task_id,
          Task_state: "Doing",
          Task_notes: notes,
          Task_owner: loginUser,
          oldNotes: props.data.Task_notes,
        };
        userService.changeTaskStatus(task).then((respond) => {
          if (respond.result) {
            alertify.success("Task Update Successfully");
            retrieveTasks();
          } else {
            alertify.error("Update Fail! Please try again!");
          }
        });
      }
      default:
        return;
    }
  };
  return (
    <>
      <div className="taskCard">
        <div className="cardName">
          {props.data.Task_name}
          <div className="cardRightSection">
            <button
              type="button"
              className="icnBtn"
              data-toggle="tooltip"
              data-placement="top"
              title="View Detail"
            >
              <BsEyeFill
                onClick={(e) => {
                  handleViewTaskOpen(props.data);
                }}
                className="cardIcon"
              />
            </button>
            {props.showEdit && (
              <button
                type="button"
                className="icnBtn"
                data-toggle="tooltip"
                data-placement="top"
                title="Edit"
              >
                <EditIcon
                  onClick={(e) => {
                    handleUpdateTaskOpen(props.data);
                  }}
                  className="icnBtnZoom"
                />
              </button>
            )}
          </div>
        </div>
        <div className="cardContent">
          <p className="cardDesc">{props.data.Task_description}</p>
          <p>Last edited: {props.data.Task_owner}</p>
        </div>
        <div className="cardFooter">
          {props.showLeft == true && (
            <button
              type="button"
              className="icnBtn"
              data-toggle="tooltip"
              data-placement="top"
              title="Shift Left"
            >
              <FaArrowAltCircleLeft
                onClick={(e) => {
                  handleStateChangeBack(e);
                }}
                className="cardIcon"
              />
            </button>
          )}
          {props.showRight == true && (
            <button
              type="button"
              className="icnBtn"
              data-toggle="tooltip"
              data-placement="top"
              title="Shift Right"
            >
              <FaArrowAltCircleRight
                onClick={(e) => {
                  handleStateChangeNext(e);
                }}
                className="cardIcon"
              />
            </button>
          )}
        </div>
      </div>
      <Dialog open={updateTaskDialog} onClose={handleUpdateTaskClose}>
        <DialogTitle>Update Task</DialogTitle>
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
              disabled
              required
            />
          </div>
          <div className="formSection">
            <label className="formInput200">Description:</label>

            <textarea
              id="txtArea"
              rows="5"
              cols="55"
              value={taskDescription}
              className="formTextArea"
              onChange={(e) => setTaskDescription(e.target.value)}
            ></textarea>
          </div>
          {/* <div className="formSection">
            <label className="formInput200">Task History:</label>
            <pre>{currentNotes}</pre>
          </div> */}
          <div className="formSection">
            <label className="formInput200">Notes:</label>
            <textarea
              id="txtArea"
              rows="5"
              cols="55"
              value={taskNotes}
              placeholder="Some comments"
              className="formTextArea"
              onChange={(e) => setTaskNotes(e.target.value)}
            ></textarea>
          </div>
          {(props.data.Task_state == "Open" ||
            props.data.Task_state == "Done") && (
            <div className="formSection">
              <label className="formInput200">Plan Aconoym:</label>
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
                  {planList.length != 0
                    ? planList.map((name) => (
                        <MenuItem
                          key={name.Plan_MVP_name}
                          value={name.Plan_MVP_name}
                        >
                          <ListItemText primary={name.Plan_MVP_name} />
                        </MenuItem>
                      ))
                    : ""}
                </Select>
              </FormControl>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <button onClick={handleUpdateTaskClose} className="editBtn">
            Cancel
          </button>
          <button onClick={handleUpdateTask} className="editBtn">
            Update
          </button>
        </DialogActions>
      </Dialog>
      {/* View Task */}
      <Dialog open={viewTaskDialog} onClose={handleViewTaskClose}>
        <DialogTitle>{props.data.Task_name}</DialogTitle>
        <DialogContent>
          <div className="formSection">
            <label className="formInput200">Task ID:</label>
            <label className="formInput200">{props.data.Task_id}</label>
            <label className="formInput200">Create On:</label>
            <label className="formInputTitle">
              {props.data.Task_createDate}
            </label>
          </div>
          <div className="formSection">
            <label className="formInput200">App Aconoym:</label>
            <label className="formInput200">
              {props.data.Task_app_acronym}
            </label>
            <label className="formInput200">Plan Aconoym:</label>
            <label className="formInputTitle">
              {props.data.Task_plan == "" ? "No Plans" : props.data.Task_plan}
            </label>
          </div>
          <div className="formSection">
            <label className="formInput200">Creator:</label>
            <label className="formInput200">{props.data.Task_creator}</label>
            <label className="formInput200"> Current State:</label>
            <label className="formInputTitle">{props.data.Task_state}</label>
          </div>
          <div className="formSection">
            <label className="formInput200">Last Edited By:</label>
            <label className="formInput200">{props.data.Task_owner}</label>
          </div>
          {/* <div className="formSection">
            <label className="formInput200">App Aconoym:</label>
            <label>{props.data.Task_app_acronym}</label>
          </div> */}

          <div className="formSection">
            <label className="formInput200">Task Description</label>
            <label className="formDisplayTextArea">
              {props.data.Task_description}
            </label>
          </div>

          <div className="formSection">
            <label className="formInput200">History</label>
            <pre className="formDisplayText">{props.data.Task_notes}</pre>
          </div>
        </DialogContent>
        <DialogActions>
          <button onClick={handleViewTaskClose} className="editBtn">
            Ok
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Task;
