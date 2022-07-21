import React from "react";
import EditIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import { BsEyeFill } from "react-icons/bs";
import { useState, useEffect, useContext } from "react";
import userService from "../services/user.service";
import alertify from "alertifyjs";

const Plan = (props) => {
  const [Plan_MVP_name, setPlan_MVP_name] = useState("");
  const [Plan_startDate, setPlan_startDate] = useState(null);
  const [Plan_endDate, setPlan_endDate] = useState(null);
  const [Plan_app_Acronym, setPlan_app_Acronym] = useState("");
  const [Plan_description, setPlanDescription] = useState("");
  const [planList, setPlanList] = useState([]);
  const [updateDialog, setUpdateDialog] = useState(false);
  const [openPlanDialog, setPlanDialog] = useState(false);

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

  const handleClickOpen = (e) => {
    e.preventDefault();
    userService
      .checkGroup(localStorage.getItem("username"), "Project Manager")
      .then((res) => {
        if (res.result) {
          setPlanDialog(true);
        } else {
          alertify.error(
            "You are not authorised to create new Plan! Please contact admin for help!"
          );
        }
      });
  };
  var moment = require("moment");
  let startDate = moment(new Date(props.data.Plan_startDate)).format(
    "DD/MM/YYYY"
  );
  let endDate = moment(new Date(props.data.Plan_endDate)).format("DD/MM/YYYY");

  return (
    <div className="planCard">
      <div className="planTitle">
        <p className="applicationTitlePtag">{props.data.Plan_MVP_name}</p>
        <p>Start On: {startDate}</p>
        <p>End On: {endDate}</p>
      </div>
      {/* <div className="planContent">
      </div>
      <div className="planFooter">
   
      </div> */}
    </div>
  );
};

export default Plan;
