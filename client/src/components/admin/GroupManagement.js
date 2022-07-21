import React from "react";
import { useState, useEffect } from "react";
import { Table } from "@mui/material";
import userService from "../../services/user.service";
import "../../css/GroupManagement.css.css";
import alertify from "alertifyjs";
import "../../../src/alertify/css/themes/bootstrap.css";

import ViewMembers from "./ViewMembers";
import "../../css/GroupManagement.css.css";

const GroupManagement = () => {
  /* Contain the users username per group */
  const [groupDetailList, setGroupDetailList] = useState([]); // get table data
  const [groupList, setGroupList] = useState([]); // get all the group name
  const [userList, setUserList] = useState([]); // get all the users
  const [memberList, setMemberList] = useState([]); // get group member list

  const [selectedGroupname, setSelectedGroup] = useState(""); //selected group name
  const [selectedGroupStatus, setSelectedGroupStatus] = useState("");
  const [viewModal, setViewModal] = useState(false);
  const [addPopup, setAddPopup] = useState(false);
  const [selectUsers, setSelectUsers] = useState([]);

  const [groupName, setGroupname] = useState(""); // for new create group
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
  useEffect(() => {
    userService.getGroupData().then((res) => {
      if (res.message === "Found") {
        setGroupDetailList(res.result.map((result) => result));
        setGroupList(res.result.map((result) => result.groupname));
      }
    });
    userService.getAllUsers().then((res) => {
      if (res.message === "Found") {
        setUserList(res.result.map((res) => res.username));
      }
    });
  }, []);

  const handleViewMore = (groupname, status) => {
    setSelectedGroup(groupname);
    localStorage.setItem("selectedGroup", groupname);
    localStorage.setItem("selectedGroupStatus", status);
  };

  const handleChange = (e) => {
    e.preventDefault();
    setSelectUsers(
      // On autofill we get a stringified value.
      typeof e.target.value === "string"
        ? e.target.value.split(",")
        : e.target.value
    );
  };

  const handleDisable = (groupname, status) => {
    alertify
      .confirm(
        "Confirmation",
        "Confirm Enable/ Disable this group?",
        async function () {
          const disablingGroup = {
            name: groupname,
            status: status == "Enable" ? "Disable" : "Enable",
          };
          await userService.disableGroup(disablingGroup).then((res) => {
            if (res.result) {
              alertify.success(`Group ${groupname} has been disable`);
              userService.getGroupData().then((res) => {
                if (res.message === "Found") {
                  setGroupDetailList(res.result.map((result) => result));
                  setGroupList(res.result.map((result) => result.groupname));
                }
              });
            }
          });
        },
        function () {
          alertify.error("Cancel");
        }
      )
      .set("labels", { ok: "YES", cancel: "NO" });
  };
  const handleNewGroup = () => {
    alertify.prompt(
      "Enter the new group name",
      "",
      "",
      function (evt, value) {
        if (value == "" || value == null) {
          alertify
            .alert("Please enter the new group name!")
            .setHeader('<em style="color:black;">Error !</em>');
        } else {
          var newGroup = { groupname: value };
          if (!groupList.includes(value)) {
            userService.createGroup(newGroup).then((res) => {
              if (res.result) {
                userService.getGroupData().then((res) => {
                  if (res.message === "Found") {
                    setGroupDetailList(res.result.map((result) => result));
                    setGroupList(res.result.map((result) => result.groupname));
                  }
                });
                alertify.success("Group Successsfully created");
              }
            });
          } else {
            alertify
              .alert("Duplicated Group name")
              .setHeader('<em style="color:black;">Error !</em>');
          }
        }
      },
      function () {
        alertify.error("Cancel");
      }
    );
  };
  return (
    <>
      <div>
        <div
          className={
            selectedGroupname == "" ? "grid-container" : "grid-container1"
          }
        >
          <button
            className={selectedGroupname == "" ? "createBtn" : "createBtn1"}
            onClick={handleNewGroup}
          >
            Add New Group
          </button>

          <div
            className={
              selectedGroupname == "" ? "table_container1" : "table-container"
            }
          >
            <Table striped bordered hover size="sm" className="table-auto">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Group</th>
                  <th>Status</th>
                  <th>No. Of Users</th>
                  <th>Actions</th>
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
                        <button
                          className="actionBtn"
                          onClick={(e) =>
                            handleDisable(doc.groupname, doc.status)
                          }
                        >
                          {doc.status == "Enable" ? "Disable" : "Enable"}
                        </button>

                        <button
                          className="viewBtn"
                          onClick={(e) =>
                            handleViewMore(doc.groupname, doc.status)
                          }
                        >
                          View Details{" "}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>{" "}
          </div>
          <div className="view-container">
            {selectedGroupname != "" && (
              <ViewMembers selectedGroup={selectedGroupname} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default GroupManagement;
