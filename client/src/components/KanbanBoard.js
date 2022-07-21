import React from "react";
import userService from "../services/user.service";
import { useState, useEffect, useRef } from "react";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Task from "./Task";

const KanbanBoard = (props) => {
  const [taskList, setTaskList] = useState([]);
  const [openList, setOpenList] = useState([]);
  const [todoList, setTodoList] = useState([]);
  const [doingList, setDoingList] = useState([]);
  const [doneList, setDoneList] = useState([]);
  const [closeList, setCloseList] = useState([]);

  const [dragging, setDragging] = useState(false);
  const dragItem = useRef();
  const dragItemNode = useRef();

  useEffect(() => {
    retrieveTasks();
  }, [props.application]);
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
    setTaskList([openList, toDoList, doingList, doneList, closeList]);
  };

  const getStyles = (task) => {
    if (
      dragItem.current.index === task.index &&
      dragItem.current.taskIndex === task.taskIndex
    ) {
      return "task-item-current";
    }
    return "task-item";
  };

  return (
    <>
      <div className="openStateSection">
        <div className="stateHeader">Open</div>
        <div className="stateContainer">
          {taskList
            .filter((taskList) => taskList.name == "Open")
            .map((result) => {
              <div>{result.name}</div>;
              return result.task.map((task) => {
                return (
                  <div>
                    <Task
                      data={task}
                      setTaskList={setTaskList}
                      application={props.application}
                      showEdit={
                        localStorage
                          .getItem("user_group")
                          .split(",")
                          .includes(props.application.App_permit_Open)
                          ? true
                          : false
                      }
                      showRight={
                        localStorage
                          .getItem("user_group")
                          .split(",")
                          .includes(props.application.App_permit_Open)
                          ? true
                          : false
                      }
                      setApplicationDetail={props.setApplicationDetail}
                      appPlan={props.appPlan}
                    />
                  </div>
                );
              });
            })}
        </div>
      </div>
      <div className="toDoStateSection">
        <div className="stateHeader">To Do</div>
        <div className="stateContainer">
          {taskList
            .filter((taskList) => taskList.name == "To Do")
            .map((result) => {
              <div>{result.name}</div>;
              return result.task.map((task) => {
                return (
                  <div>
                    <Task
                      data={task}
                      setTaskList={setTaskList}
                      application={props.application}
                      showEdit={
                        localStorage
                          .getItem("user_group")
                          .split(",")
                          .includes(props.application.App_permit_toDoList)
                          ? true
                          : false
                      }
                      showRight={
                        localStorage
                          .getItem("user_group")
                          .split(",")
                          .includes(props.application.App_permit_toDoList)
                          ? true
                          : false
                      }
                      setApplicationDetail={props.setApplicationDetail}
                      appPlan={props.appPlan}
                    />
                  </div>
                );
              });
            })}
        </div>
      </div>
      <div className="doingStateSection">
        <div className="stateHeader">Doing</div>
        <div className="stateContainer">
          {taskList
            .filter((taskList) => taskList.name == "Doing")
            .map((result) => {
              <div>{result.name}</div>;
              return result.task.map((task) => {
                return (
                  <div>
                    <Task
                      data={task}
                      setTaskList={setTaskList}
                      application={props.application}
                      showEdit={
                        localStorage
                          .getItem("user_group")
                          .split(",")
                          .includes(props.application.App_permit_Doing)
                          ? true
                          : false
                      }
                      showRight={
                        localStorage
                          .getItem("user_group")
                          .split(",")
                          .includes(props.application.App_permit_Doing)
                          ? true
                          : false
                      }
                      showLeft={
                        localStorage
                          .getItem("user_group")
                          .split(",")
                          .includes(props.application.App_permit_Doing)
                          ? true
                          : false
                      }
                      setApplicationDetail={props.setApplicationDetail}
                      appPlan={props.appPlan}
                    />
                  </div>
                );
              });
            })}
        </div>
      </div>
      <div className="doneStateSection">
        <div className="stateHeader">Done</div>
        <div className="stateContainer">
          {taskList
            .filter((taskList) => taskList.name == "Done")
            .map((result) => {
              <div>{result.name}</div>;
              return result.task.map((task) => {
                return (
                  <div>
                    <Task
                      data={task}
                      setTaskList={setTaskList}
                      application={props.application}
                      showEdit={
                        localStorage
                          .getItem("user_group")
                          .split(",")
                          .includes(props.application.App_permit_Done)
                          ? true
                          : false
                      }
                      showRight={
                        localStorage
                          .getItem("user_group")
                          .split(",")
                          .includes(props.application.App_permit_Done)
                          ? true
                          : false
                      }
                      showLeft={
                        localStorage
                          .getItem("user_group")
                          .split(",")
                          .includes(props.application.App_permit_Done)
                          ? true
                          : false
                      }
                      setApplicationDetail={props.setApplicationDetail}
                      appPlan={props.appPlan}
                    />
                  </div>
                );
              });
            })}
        </div>
      </div>
      <div className="closeStateSection">
        <div className="stateHeader">Close</div>
        <div className="stateContainer">
          {taskList
            .filter((taskList) => taskList.name == "Close")
            .map((result) => {
              <div>{result.name}</div>;
              return result.task.map((task) => {
                return (
                  <div>
                    <Task
                      data={task}
                      setTaskList={setTaskList}
                      application={props.application}
                      setApplicationDetail={props.setApplicationDetail}
                      showLeft={false}
                      showRight={false}
                      showEdit={false}
                      appPlan={props.appPlan}
                    />
                  </div>
                );
              });
            })}
        </div>
      </div>
    </>
  );
};

export default KanbanBoard;
