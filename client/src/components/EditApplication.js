import React from "react";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../services/user.service";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import alertify from "alertifyjs";

const EditApplication = () => {
  const [appAcronym, setAppAcronym] = useState("");
  const [description, setAppDescription] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [permitOpen, setPermitOpen] = useState([]);
  const [permitToDo, setPermitToDo] = useState([]);
  const [permitDoing, setPermitDoing] = useState([]);
  const [permitDone, setPermitDone] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [permitCreate, setPermitCreate] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    userService
      .getApplication(localStorage.getItem("selectedApplication"))
      .then((res) => {
        setAppAcronym(res.result[0].App_Acronym);
        setAppDescription(res.result[0].App_Description);
        setStartDate(res.result[0].App_startDate);
        setEndDate(res.result[0].App_endDate);
        setPermitOpen(res.result[0].App_permit_Open);
        setPermitToDo(res.result[0].App_permit_toDoList);
        setPermitDoing(res.result[0].App_permit_Doing);
        setPermitDone(res.result[0].App_permit_Done);
        setPermitCreate(res.result[0].App_permit_create);
      });
    userService.getAllGroup().then((res) => {
      setGroupList(res.result.map((res) => res.name));
    });
  }, []);

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

  const handlePermitOpen = (e) => {
    setPermitOpen(e.target.value);
  };
  const handlePermitToDo = (e) => {
    setPermitToDo(e.target.value);
  };
  const handlePermitDoing = (e) => {
    setPermitDoing(e.target.value);
  };
  const handlePermitDone = (e) => {
    setPermitDone(e.target.value);
  };
  const handlePermitCreate = (e) => {
    setPermitCreate(e.target.value);
  };
  const handleCancel = (e) => {
    e.preventDefault();
    navigate("/home/applications/detail");
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const application = {
      App_Acronym: appAcronym,
      App_Description: description,
      App_startDate: startDate,
      App_endDate: endDate,
      App_permit_Open: permitOpen,
      App_permit_toDoList: permitToDo,
      App_permit_Doing: permitDoing,
      App_permit_Done: permitDone,
      App_permit_Create: permitCreate,
    };
    userService.updateApplication(application).then((res) => {
      if (res.result) {
        alertify.success(`${appAcronym} updated successfully`);
        navigate("/home/applications/detail");
      }
    });
  };
  return (
    <div className="applicationContainer">
      <div className="content">
        <p className="formTitle">Update {appAcronym}</p>
        <form action="">
          <div>
            <div className="colSection">
              <p className="colTitle">Basic Details</p>
              <div className="formSection">
                <label className="formInputTitle">App Name:</label>
                <input
                  type="text"
                  className="form-control formInputText"
                  name="appName"
                  placeholder="Application Name"
                  value={appAcronym}
                  onChange={(e) => setAppAcronym(e.target.value)}
                  required
                  disabled
                />
              </div>
              <div className="formSection">
                <label className="formInput200">Description:</label>
                <textarea
                  id="txtArea"
                  rows="5"
                  cols="60"
                  value={description}
                  className="formTextArea"
                  onChange={(e) => setAppDescription(e.target.value)}
                ></textarea>
              </div>
              <div className="formSection">
                <label className="formDateLabel">Start Date:</label>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    inputFormat="dd-MM-yyyy"
                    onChange={(newValue) => {
                      setStartDate(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField className="formInputDateField" {...params} />
                    )}
                  />
                </LocalizationProvider>
              </div>
              <div className="formSection">
                <label className="formDateLabel">End Date:</label>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    inputFormat="dd-MM-yyyy"
                    onChange={(newValue) => {
                      setEndDate(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField className="formInputDateField" {...params} />
                    )}
                  />
                </LocalizationProvider>
              </div>
            </div>
            <div className="colSection">
              <p className="colTitle">Permission Details</p>
              <div className="colPermissionContainer">
                <div className="colLeftPermission">
                  <div className="formPermissionSection">
                    <FormControl sx={{ m: 0, width: 200 }}>
                      <InputLabel id="demo-multiple-checkbox-label">
                        App Permit Create
                      </InputLabel>

                      <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        value={permitCreate}
                        onChange={handlePermitCreate}
                        input={<OutlinedInput label="Tag" />}
                        MenuProps={MenuProps}
                        className="customSelectGroup"
                      >
                        {groupList.map((name) => (
                          <MenuItem key={name} value={name}>
                            <ListItemText primary={name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="formPermissionSection">
                    <FormControl sx={{ m: 0, width: 200 }}>
                      <InputLabel id="demo-multiple-checkbox-label">
                        App Permit Open
                      </InputLabel>

                      <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        value={permitOpen}
                        onChange={handlePermitOpen}
                        input={<OutlinedInput label="Tag" />}
                        MenuProps={MenuProps}
                        className="customSelectGroup"
                      >
                        {groupList.map((name) => (
                          <MenuItem key={name} value={name}>
                            <ListItemText primary={name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>

                <div className="colLeftPermission">
                  <div className="formPermissionSection">
                    <FormControl
                      sx={{ m: 0, width: 200 }}
                      className="formSelectionSection"
                    >
                      <InputLabel id="demo-multiple-checkbox-label">
                        App Permit ToDo
                      </InputLabel>

                      <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        value={permitToDo}
                        onChange={handlePermitToDo}
                        input={<OutlinedInput label="Tag" />}
                        MenuProps={MenuProps}
                        className="customSelectGroup"
                      >
                        {groupList.map((name) => (
                          <MenuItem key={name} value={name}>
                            <ListItemText primary={name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="formPermissionSection">
                    <div className="formSelectionSection">
                      <FormControl sx={{ m: 0, width: 200 }}>
                        <InputLabel id="demo-multiple-checkbox-label">
                          App Permit Doing
                        </InputLabel>

                        <Select
                          labelId="demo-multiple-checkbox-label"
                          id="demo-multiple-checkbox"
                          value={permitDoing}
                          onChange={handlePermitDoing}
                          MenuProps={MenuProps}
                          input={<OutlinedInput label="Tag" />}
                          className="customSelectGroup"
                        >
                          {groupList.map((name) => (
                            <MenuItem key={name} value={name}>
                              <ListItemText primary={name} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="formPermissionSection">
                <FormControl sx={{ m: 0, width: 200 }}>
                  <InputLabel id="demo-multiple-checkbox-label">
                    App Permit Done
                  </InputLabel>

                  <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    value={permitDone}
                    onChange={handlePermitDone}
                    input={<OutlinedInput label="Tag" />}
                    MenuProps={MenuProps}
                    className="customSelectGroup"
                  >
                    {groupList.map((name) => (
                      <MenuItem key={name} value={name}>
                        <ListItemText primary={name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>

          {/* <fieldset>
            <div className="grid-35">
              <label>Description:</label>
            </div>
            <div className="grid-65">
              <textarea
                id="txtArea"
                rows="10"
                cols="70"
                value={description}
                onChange={(e) => setAppDescription(e.target.value)}
              ></textarea>
            </div>
          </fieldset>
          <fieldset>
            <div className="grid-35">
              <label>Start Date:</label>
            </div>
            <div>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => {
                    setStartDate(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </div>
          </fieldset>
          <fieldset>
            <div className="grid-35">
              <label>End Date:</label>
            </div>
            <div>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => {
                    setEndDate(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </div>
          </fieldset>

          <div className="formRight">
            <fieldset>
              <FormControl sx={{ m: 0, width: 250 }} className="grid-100">
                <InputLabel id="demo-multiple-checkbox-label">
                  App Permit Create
                </InputLabel>

                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  value={permitCreate}
                  onChange={handlePermitCreate}
                  input={<OutlinedInput label="Tag" />}
                  MenuProps={MenuProps}
                  className="customSelectGroup"
                >
                  {groupList.map((name) => (
                    <MenuItem key={name} value={name}>
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </fieldset>
            <fieldset>
              <FormControl sx={{ m: 0, width: 250 }} className="grid-100">
                <InputLabel id="demo-multiple-checkbox-label">
                  App Permit Open
                </InputLabel>

                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  value={permitOpen}
                  onChange={handlePermitOpen}
                  input={<OutlinedInput label="Tag" />}
                  MenuProps={MenuProps}
                  className="customSelectGroup"
                >
                  {groupList.map((name) => (
                    <MenuItem key={name} value={name}>
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </fieldset>
          </div>
          <div>
            <fieldset>
              <FormControl sx={{ m: 0, width: 250 }} className="grid-100">
                <InputLabel id="demo-multiple-checkbox-label">
                  App Permit ToDo
                </InputLabel>

                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  value={permitToDo}
                  onChange={handlePermitToDo}
                  input={<OutlinedInput label="Tag" />}
                  MenuProps={MenuProps}
                  className="customSelectGroup"
                >
                  {groupList.map((name) => (
                    <MenuItem key={name} value={name}>
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </fieldset>
            <fieldset>
              <FormControl sx={{ m: 0, width: 250 }} className="grid-100">
                <InputLabel id="demo-multiple-checkbox-label">
                  App Permit Doing
                </InputLabel>

                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  value={permitDoing}
                  onChange={handlePermitDoing}
                  MenuProps={MenuProps}
                  input={<OutlinedInput label="Tag" />}
                  className="customSelectGroup"
                >
                  {groupList.map((name) => (
                    <MenuItem key={name} value={name}>
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </fieldset>
            <fieldset>
              <FormControl sx={{ m: 0, width: 250 }} className="grid-100">
                <InputLabel id="demo-multiple-checkbox-label">
                  App Permit Done
                </InputLabel>

                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  value={permitDone}
                  onChange={handlePermitDone}
                  input={<OutlinedInput label="Tag" />}
                  MenuProps={MenuProps}
                  className="customSelectGroup"
                >
                  {groupList.map((name) => (
                    <MenuItem key={name} value={name}>
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </fieldset>
          </div> */}

          <button onClick={handleCancel} className="editBtn clearFloat">
            Cancel
          </button>
          <button onClick={handleSubmit} className="editBtn">
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditApplication;
