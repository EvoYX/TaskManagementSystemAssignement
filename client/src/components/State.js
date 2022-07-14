import React from "react";
import { useState, useEffect } from "react";
import userService from "../services/user.service";
import Task from "./Task";

const State = (props) => {
  const [taskList, setTaskList] = useState([]);

  useEffect(() => {
    var appName = localStorage.getItem("selectedApplication");
    const task = {
      Task_app_acronym: appName,
      Task_state: props.state,
    };
    userService.retrieveTasksByStatus(task).then((res) => {
      console.log("the result here is ", res.result);
      if (res.result) {
        setTaskList(res.result);
      }
    });
  }, []);
  return (
    <>
      <div>
        <p className="stateTitle">{props.state}</p>
        {taskList.length != 0
          ? taskList.map((res) => {
              return <Task task={res}></Task>;
            })
          : ""}
      </div>
    </>
  );
};

export default State;
