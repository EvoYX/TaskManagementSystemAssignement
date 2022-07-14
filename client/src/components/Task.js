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
const Task = (props) => {
  const [updateTaskDialog, setUpdateTaskDialog] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskAppAcronym, setTaskAppAcronym] = useState("");
  const [taskNotes, setTaskNotes] = useState("");
  const [taskPlan, setTaskPlan] = useState("");
  const [taskOwner, setTaskOwner] = useState(""); // last person who edit it
  const [planList, setPlanList] = useState("");
  const [currentNotes, setCurrentNotes] = useState("");

  useEffect(() => {
    userService
      .retrieveAllPlan(localStorage.getItem("selectedApplication"))
      .then((res) => {
        setPlanList(res.result);
      });
  }, []);
  const handleUpdateTaskClose = () => {
    setUpdateTaskDialog(false);
  };
  const handleUpdateTaskOpen = (task) => {
    setTaskName(task.Task_name);
    setTaskDescription(task.Task_description);
    setTaskAppAcronym(task.Task_app_acronym);
    setTaskPlan(task.Task_plan);
    setCurrentNotes(task.Task_notes);
    alert(task.Task_notes);
    setUpdateTaskDialog(true);
  };
  const handlePlanChange = (e) => {
    setTaskPlan(e.target.value);
  };
  const handleUpdateTask = () => {
    var user = localStorage.getItem("username");
    var notes = new Date().toUTCString() + " " + taskNotes;
    alert(notes);
    const task = {
      Task_id: props.task.Task_id,
      Task_name: taskName,
      Task_description: taskDescription,
      Task_notes: notes,
      Task_plan: taskPlan,
      Task_owner: user,
      oldNotes: props.task.Task_notes,
    };
    userService.updateTask(task).then((res) => {
      if (res.result) {
        alertify.success("update successfully");
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
  const handleTest = (test) => {
    alertify.alert(test.Task_notes);
  };
  return (
    <>
      <div className="task" draggable="true">
        <div className="task__tags">
          <span className="task__tag task__tag--copyright">
            {props.data.Task_name}
          </span>
          <p>Notes is {props.data.Task_notes}</p>
        </div>
        <div class="task__stats">
          <p>Start Date:</p>
          <p>{props.data.Task_createDate}</p>
        </div>
        <button
          onClick={(e) => {
            handleUpdateTaskOpen(props.data);
          }}
        >
          Edit
        </button>
        <button
          onClick={(e) => {
            handleTest(props.data);
          }}
        >
          Test
        </button>
      </div>

      <Dialog open={updateTaskDialog} onClose={handleUpdateTaskClose}>
        <DialogTitle>Update Task</DialogTitle>
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
          <pre>{currentNotes}</pre>
          <fieldset>
            <div className="grid-35">
              <label>Notes:</label>
            </div>
            <div className="grid-65">
              <textarea
                id="txtArea"
                rows="10"
                cols="70"
                value={taskNotes}
                onChange={(e) => setTaskNotes(e.target.value)}
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
          </fieldset>
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
    </>
  );
};

export default Task;
