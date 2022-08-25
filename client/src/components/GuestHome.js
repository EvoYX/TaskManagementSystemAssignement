import React from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./Login";
import Styles from "../css/GuestHome.css.css";
import userService from "../services/user.service";
import { DataGrid } from "@mui/x-data-grid";
const GuestHome = () => {
  const [popupModal, setPopupModal] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userGroups, setUserGroup] = useState([]);
  const [dialog, setDialog] = useState(false);
  const [userTable, setUserTable] = useState([]);
  const [tableRow, setTableRow] = useState();
  const [tableCol, setTableCol] = useState([]);

  const handleModal = () => {
    setPopupModal(!popupModal);
  };
  // const showData = () => {
  //   // userService.getUserTable(1, 2, "username", "asc").then((res) => {
  //   //   console.log("the data is ", res);
  //   // });
  //   const user = {
  //     username: "testing",
  //     email: "ao",
  //     password: "tesing",
  //     status: "Enable",
  //     user_group: "user",
  //   };
  //   userService.createSpringbootUser(user).then((res) => {
  //     console.log("result", res);
  //   });
  // };
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "username", headerName: "First name", width: 130 },
    { field: "email", headerName: "Last name", width: 130 },
    {
      field: "status",
      headerName: "Age",
      width: 90,
    },
    {
      field: "user_group",
      headerName: "Full name",
      width: 130,
    },
  ];

  const rows = [
    { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
    { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
    { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
    { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
    { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
    { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
    { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
    { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
    { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
  ];
  return (
    <>
      <div className="welcomeHeading">
        <button type="submit" className="loginBtn" onClick={showData}>
          show user
        </button>
        <p className="welcomeTitle">TASK MANAGEMENT SYSTEM </p>
        <span className="welcomeSubtitle">@Yong Xin</span>
      </div>

      <button type="submit" className="loginBtn" onClick={handleModal}>
        Login
      </button>

      {popupModal && (
        <div>
          <div className="overlay" onClick={handleModal}></div>
          <div className="spacing"></div>
          <div className="modal_content">
            <Login></Login>
          </div>
        </div>
      )}
      {tableCol != 0 && (
        <DataGrid
          rows={tableRow}
          columns={tableCol}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
        />
      )}
    </>
  );
};

export default GuestHome;
