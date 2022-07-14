import React from "react";
import userService from "../services/user.service";
import { useState, useEffect } from "react";

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
import Task from "./Task";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
const KanbanBoard = () => {
  const [taskList, setTaskList] = useState([]);
  const [openList, setOpenList] = useState([]);
  const [todoList, setTodoList] = useState([]);
  const [doingList, setDoingList] = useState([]);
  const [doneList, setDoneList] = useState([]);
  const [closeList, setCloseList] = useState([]);

  useEffect(() => {
    retrieveTasks();
  }, []);
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
      if (res.result) {
        openList = { name: "Open", task: res.result };
        console.log("j", openList);
      }
    });
    console.log("sasa", openList);
    await userService.retrieveTasksByStatus(toDoTask).then((res) => {
      if (res.result) {
        toDoList = { name: "To Do", task: res.result };
      }
    });
    await userService.retrieveTasksByStatus(doingTask).then((res) => {
      if (res.result) {
        doingList = { name: "Doing", task: res.result };
      }
    });
    await userService.retrieveTasksByStatus(doneTask).then((res) => {
      if (res.result) {
        doneList = { name: "Done", task: res.result };
      }
    });
    await userService.retrieveTasksByStatus(closeTask).then((res) => {
      if (res.result) {
        closeList = { name: "Close", task: res.result };
      }
    });
    console.log("hi", openList, toDoList, doingList, doneList, closeList);
    setTaskList([openList, toDoList, doingList, doneList, closeList]);
  };
  const onDragEnd = () => {};
  return (
    <>
      <div className="kanbanBoard">
        {taskList.map((tasks, index) => {
          return (
            <div>
              <h4>
                <span>{tasks.name}</span>
              </h4>

              <div>
                {tasks.task.length > 0 &&
                  tasks.task.map((item, iIndex) => {
                    return (
                      <Task
                        key={item.id}
                        data={item}
                        index={iIndex}
                        className="m-3"
                      />
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default KanbanBoard;
