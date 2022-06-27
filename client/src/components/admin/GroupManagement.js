import React from "react";
import { useState, useEffect } from "react";
import { Table } from "@mui/material";
import userService from "../../services/user.service";
import Button from "@mui/material/Button";
import { Link, NavLink } from "react-router-dom";

const GroupManagement = () => {
  /* table data */
  const [groupTableList, setGroupTableList] = useState([]);
  /* Contain the users per group */
  const [groupDetailList, setGroupDetailList] = useState([]);
  /* Contain only the groupname */
  const [groupList, setGroupList] = useState([]);
  const [groupUsers, setGroupUsers] = useState([]);
  useEffect(() => {
    var groups;
    userService.getGroupData().then((res) => {
      if (res.message === "Found") {
        setGroupDetailList(res.result.map((result) => result));
      }
    });
  }, []);
  console.log(groupTableList);
  return (
    <>
      <div className="table">
        <Table striped bordered hover size="sm" className="table-auto">
          <thead>
            <tr>
              <th>#</th>
              <th>Group</th>
              <th>Status</th>
              <th>Users</th>
            </tr>
          </thead>
          <tbody>
            {groupDetailList.map((doc, index) => {
              return (
                <tr key={doc.id}>
                  <td>{index + 1}</td>
                  <td>{doc.groupname}</td>
                  <td>{doc.status}</td>
                  <td>{doc.users.length}</td>
                  <td>
                    <Button
                      variant="secondary"
                      className="disable"
                      // onClick={(e) => handleDialog(doc.username, doc.status)}
                    >
                      {doc.status}
                    </Button>
                    <Link to="/admin/usermanagement/edituser">
                      <Button
                        variant="danger"
                        className="Edit"
                        // onClick={(e) => editHandler(doc.username)}
                      >
                        Edit
                      </Button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default GroupManagement;
