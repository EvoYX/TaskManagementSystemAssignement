const sql = require("../config/db");

/* Retreive */
const findByUsername = (req, response) => {
  // console.log("the request in model is ", req);
  sql.query(`SELECT * FROM accounts WHERE username = '${req}'`, (err, res) => {
    if (err) {
      response(err, { message: err.sqlMessage.toString(), result: null });
    } else {
      if (res.length) {
        console.log("found User: ", res[0]);
        response(null, { message: "Found", result: res[0] });
      } else {
        response(null, { message: "User not found", result: null });
      }
    }
  });
};
const findAllUsers = (req, response) => {
  sql.query(`SELECT * FROM accounts `, (err, res) => {
    if (err) {
      response(err, { message: err.sqlMessage.toString(), result: null });
    } else {
      if (res.length) {
        console.log("found User: ", res);
        response(null, { message: "Found", result: res });
      } else {
        response(null, { message: "User not found", result: null });
      }
    }
  });
};
const findGroupByUsername = (req, response) => {
  console.log("the request in model is ", req);
  sql.query(`SELECT * FROM user_group WHERE name = '${req}'`, (err, res) => {
    if (err) {
      response(err, { message: err.sqlMessage.toString(), result: null });
    } else {
      if (res.length) {
        console.log("the responds is ", res);
        response(null, { message: "Found", result: res[0] });
      } else {
        response(null, {
          message: "User does not have any group",
          result: null,
        });
      }
    }
  });
};

const findAllGroup = (req, response) => {
  sql.query(`SELECT * FROM user_group`, (err, res) => {
    if (err) {
      response(err, { message: "No available groups", result: null });
    }
    if (res.length) {
      console.log("Group found: ", res);
      response(null, {
        message: "Found",
        result: res.map((result) => result),
      });
      return;
    } else {
      response(null, { message: "No available groups", result: null });
    }
  });
};

/* Create */
const createUsers = (req, response) => {
  sql.query(
    `insert into accounts (username,email,password,status,user_group)  values ('${req.username}','${req.email}','${req.password}','enable','${req.userGroups}')`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        response(err, { message: "Errors in adding new user", result: false });
      } else {
        response(null, { message: "User Created Successfully", result: true });
      }
    }
  );
};

const createGroup = (req, response) => {
  console.log("creating at model");
  sql.query(
    `insert into user_group (name,status)  values ('${req.name}','enable')`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        response(err, { message: "Error in creating group", result: false });
        // return;
      } else {
        response(null, { message: "Group created Successfully", result: true });
      }
    }
  );
};
//update the accounts_group data (for One group with many users relationship)
const createGroupWithUsername = (req, response) => {
  sql.query(
    `insert into account_user_group (username,groupname)  values ('${req.username}','${req.groupname}')`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        response(err, {
          message: "Errors in adding the user group details",
          result: false,
        });
      } else {
        response(null, {
          message: "Group Detail Created Successfully",
          result: true,
        });
      }
    }
  );
};
/* Update */
const disableGroup = (req, response) => {
  sql.query(
    `update user_group set status ='${req.status}' where name = '${req.name}' `,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        response(err, {
          message: "Errors in disabling the group",
          result: false,
        });
        // return;
      } else {
        response(null, { message: "Disable successfully", result: true });
      }
    }
  );
};
const disableUser = (req, response) => {
  console.log("req", req.status, req.username);
  sql.query(
    `update accounts set status ='${req.status}' where username = '${req.username}'`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        response(err, { message: "Unable to disable", result: false });
        // return;
      } else {
        response(null, { message: "Disable successfully", result: true });
      }
    }
  );
};

const updateProfile = (req, response) => {
  if (req.password == null) {
    query = `update accounts set email ='${req.email}',user_group= '${req.user_group}' where username = '${req.username}' `;
  } else {
    query = `update accounts set email ='${req.email}',password= '${req.password}',user_group= '${req.user_group}' where username = '${req.username}' `;
  }
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      response(err, { message: "Errors in updating profile", result: false });
      // return;
    } else {
      response(null, {
        message: "Profile updated successfully",
        result: true,
      });
    }
  });
};
// const updateGroupMember = (req, response) => {
//   sql.query(
//     `update user_group set group_members ='${req.group_members}' where name = '${req.name}' `,
//     (err, res) => {
//       if (err) {
//         console.log("error: ", err);
//         response(err, {
//           message: "Unable to add new group members",
//           result: false,
//         });
//         // return;
//       } else {
//         response(null, {
//           message: "Group member updated successfully",
//           result: true,
//         });
//       }
//     }
//   );
// };
const deleteGroupByUsername = (req, response) => {
  sql.query(
    `DELETE FROM account_user_group WHERE username ='${req.username}' `,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        response(err, {
          message: "Unable to delete the group",
          result: false,
        });
        // return;
      } else {
        response(null, {
          message: "delete successfully",
          result: true,
        });
      }
    }
  );
};

module.exports = {
  findByUsername,
  findAllGroup,
  findAllUsers,
  createUsers,
  createGroup,
  createGroupWithUsername,
  disableGroup,
  disableUser,
  updateProfile,
  findGroupByUsername,
  deleteGroupByUsername,
};
