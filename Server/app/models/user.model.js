const sql = require("../config/db");

/* Retreive */
const findByUsername = (req, response) => {
  sql.query(`SELECT * FROM accounts WHERE username = '${req}'`, (err, res) => {
    if (err) {
      response(err, null);
    } else {
      if (res.length) {
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
      response(err, null);
    } else {
      if (res.length) {
        response(null, { message: "Found", result: res });
      } else {
        response(null, { message: "User not found", result: null });
      }
    }
  });
};
const getGroupStatusByGroupname = (req, response) => {
  sql.query(`SELECT * FROM user_group WHERE name = '${req}'`, (err, res) => {
    if (err) {
      response(err, { message: err.sqlMessage.toString(), result: null });
    } else {
      if (res.length) {
        response(null, { message: "Found", result: res[0] });
      } else {
        response(null, {
          message: "Group not found",
          result: null,
        });
      }
    }
  });
};

const findAllGroup = (req, response) => {
  sql.query(`SELECT * FROM user_group`, (err, res) => {
    if (err) {
      response(err, null);
    }
    if (res.length) {
      response(null, {
        message: "Found",
        result: res.map((result) => result),
      });
    } else {
      response(null, { message: "No available groups", result: null });
    }
  });
};
const findAllUsersByGroup = (response) => {
  sql.query(
    `SELECT * FROM account_user_group  order By groupname`,
    (err, res) => {
      if (err) {
        response(err, { message: "No available groups", result: null });
      }
      if (res.length) {
        response(null, {
          message: "Found",
          result: res.map((result) => result),
        });
        return;
      } else {
        response(null, { message: "No available groups", result: null });
      }
    }
  );
};
/* Finding the users that belong to the specfic groups */
const findUsersByGroupname = (req, response) => {
  sql.query(
    `SELECT Distinct(username) FROM account_user_group WHERE groupname = '${req}'`,
    (err, res) => {
      if (err) {
        response(err, null);
      } else {
        if (res.length) {
          response(null, {
            message: "Found",
            result: res.map((result) => result),
          });
        } else {
          response(null, {
            message: "No users has been assigned to this group",
            result: null,
          });
        }
      }
    }
  );
};
const checkGroup = (req, response) => {
  sql.query(
    `SELECT * FROM account_user_group WHERE groupname = '${req.groupname}' && username = '${req.username}'`,
    (err, res) => {
      if (err) {
        response(err, { result: false });
      } else {
        if (res.length) {
          response(null, {
            message: "Found",
            result: true,
          });
        } else {
          response(null, {
            message: "Not Found",
            result: false,
          });
        }
      }
    }
  );
};

/* Create */
const createUsers = (req, response) => {
  sql.query(
    `insert into accounts (username,email,password,status,user_group)  values ('${req.username}','${req.email}','${req.password}','Enable','${req.userGroups}')`,
    (err, res) => {
      if (err) {
        response(err, null);
      } else {
        response(null, { message: "User Created Successfully", result: true });
      }
    }
  );
};

const createGroup = (req, response) => {
  sql.query(
    `insert into user_group (name,status)  values ('${req.groupname}','Enable')`,
    (err, res) => {
      if (err) {
        response(err, null);
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
        response(err, null);
        // return;
      } else {
        response(null, { message: "Disable successfully", result: true });
      }
    }
  );
};
const disableUser = (req, response) => {
  sql.query(
    `update accounts set status ='${req.status}' where username = '${req.username}'`,
    (err, res) => {
      if (err) {
        response(err, null);
      } else {
        response(null, { message: "Disable successfully", result: true });
      }
    }
  );
};

const updateProfile = (req, response) => {
  if (req.password == null) {
    if (req.user_group) {
      query = `update accounts set email ='${req.email}',user_group= '${req.user_group}' where username = '${req.username}' `;
    } else {
      query = `update accounts set email ='${req.email}' where username = '${req.username}' `;
    }
  } else {
    if (req.user_group) {
      query = `update accounts set email ='${req.email}',password= '${req.password}',user_group= '${req.user_group}' where username = '${req.username}' `;
    } else {
      query = `update accounts set email ='${req.email}',password= '${req.password}' where username = '${req.username}' `;
    }
  }
  sql.query(query, (err, res) => {
    if (err) {
      response(err, null);
      // return;
    } else {
      response(null, {
        message: "Profile updated successfully",
        result: true,
      });
    }
  });
};
/* Update the usergroup column in accounts table */
const updateAccountUserGroup = (req, response) => {
  query = `update accounts set user_group ='${req.user_group}' where username = '${req.username}' `;
  sql.query(query, (err, res) => {
    if (err) {
      response(err, null);
    } else {
      response(null, {
        message: "Profile updated successfully",
        result: true,
      });
    }
  });
};

const deleteGroupByUsername = (req, response) => {
  sql.query(
    `DELETE FROM account_user_group WHERE username ='${req.username}' `,
    (err, res) => {
      if (err) {
        response(err, null);
        // return;
      } else {
        response(null, {
          message: "Delete successfully",
          result: true,
        });
      }
    }
  );
};

/* Application, Plans, Task Tables */
const createApplication = (req, response) => {
  sql.query(
    `insert into application (App_Acronym,App_Description,App_Rnumber,App_startDate,App_endDate,App_permit_Open,App_permit_toDoList,App_permit_Doing,App_permit_Done,App_permit_create)  
    values ('${req.App_Acronym}','${req.App_Description}','${req.App_Rnumber}','${req.App_startDate}','${req.App_endDate}','${req.App_permit_Open}','${req.App_permit_toDoList}','${req.App_permit_Doing}','${req.App_permit_Done}','${req.App_permit_Create}')`,
    (err, res) => {
      if (err) {
        /* return error message if there's error */
        response(err, null);
      } else {
        response(null, {
          message: "Application Created Successfully",
          result: true,
        });
      }
    }
  );
};
const retrieveAllApplication = (req, response) => {
  sql.query(`SELECT * FROM application`, (err, res) => {
    if (err) {
      response(err, { result: false });
    } else {
      if (res.length) {
        response(null, {
          message: "Found",
          result: res,
        });
      } else {
        response(null, {
          message: "Not Found",
          result: false,
        });
      }
    }
  });
};

const retrieveApplicationByName = (req, response) => {
  sql.query(
    `SELECT * FROM application WHERE App_Acronym = '${req.app_acronym}'`,
    (err, res) => {
      if (err) {
        response(err, null);
      } else {
        if (res.length) {
          response(null, {
            message: "Found",
            result: res,
          });
        } else {
          response(null, {
            message: "Not Found",
            result: false,
          });
        }
      }
    }
  );
};

const updateRNumber = (req, response) => {
  sql.query(
    `update application set App_Rnumber ='${req.App_Rnumber}' where App_Acronym ='${req.App_Acronym}'`,
    (err, res) => {
      if (err) {
        response(err, null);
      } else {
        response(null, {
          message: "RNumber Updated Successfully",
          result: true,
        });
      }
    }
  );
};

const updateApplication = (req, response) => {
  sql.query(
    `update application set App_Description ='${req.App_Description}',App_startDate ='${req.App_startDate}',App_endDate ='${req.App_endDate}',App_permit_Open ='${req.App_permit_Open}',App_permit_toDoList ='${req.App_permit_toDoList}',App_permit_Doing ='${req.App_permit_Doing}',App_permit_Done= '${req.App_permit_Done}',App_permit_create ='${req.App_permit_Create}' where App_Acronym ='${req.App_Acronym}'`,
    (err, res) => {
      if (err) {
        response(err, null);
      } else {
        response(null, {
          message: "Application Updated Successfully",
          result: true,
        });
      }
    }
  );
};

const createPlan = (req, response) => {
  sql.query(
    `insert into plan (Plan_MVP_name,Plan_startDate,Plan_endDate,Plan_app_Acronym,Plan_description)  
    values ('${req.Plan_MVP_name}','${req.Plan_startDate}','${req.Plan_endDate}','${req.Plan_app_Acronym}','${req.Plan_description}')`,
    (err, res) => {
      if (err) {
        response(err, null);
      } else {
        response(null, { message: "Plan Created Successfully", result: true });
      }
    }
  );
};
const updatePlan = (req, response) => {
  sql.query(
    `update plan set Plan_startDate = '${req.Plan_startDate}', Plan_endDate = '${req.Plan_endDate}', Plan_description ='${req.Plan_description}' where Plan_MVP_name = '${req.Plan_MVP_name}'`,
    (err, res) => {
      if (err) {
        response(err, null);
      } else {
        response(null, {
          message: "Application Updated Successfully",
          result: true,
        });
      }
    }
  );
};
const retrieveAllPlansByApplication = (req, response) => {
  sql.query(
    `SELECT * FROM plan WHERE Plan_app_Acronym = '${req.plan_app_Acronym}'`,
    (err, res) => {
      if (err) {
        response(err, null);
      } else {
        if (res.length) {
          response(null, {
            message: "Found",
            result: res,
          });
        } else {
          response(null, {
            message: "Not Found",
            result: false,
          });
        }
      }
    }
  );
};

const createTask = (req, response) => {
  sql.query(
    `insert into task (Task_id,Task_name,Task_description,Task_notes,Task_plan,Task_app_acronym,Task_state,Task_creator,Task_owner,Task_createDate)  
    values ('${req.Task_id}','${req.Task_name}','${req.Task_description}','${req.Task_notes}','${req.Task_plan}','${req.Task_app_acronym}','${req.Task_state}','${req.Task_creator}','${req.Task_owner}','${req.Task_createDate}')`,
    (err, res) => {
      if (err) {
        response(err, null);
      } else {
        sql.query(
          `update application set App_Rnumber ='${req.App_Rnumber}' where App_Acronym = '${req.Task_app_acronym}'`
        );
        response(null, { message: "Task Created Successfully", result: true });
      }
    }
  );
};
const retrieveTaskByState = (req, response) => {
  sql.query(
    `SELECT * FROM task WHERE Task_state = '${req.Task_state}' && Task_app_acronym = '${req.Task_app_acronym}'`,
    (err, res) => {
      if (err) {
        response(err, null);
      } else {
        if (res.length) {
          response(null, {
            message: "Found",
            result: res,
          });
        } else {
          response(null, {
            message: "Not Found",
            result: false,
          });
        }
      }
    }
  );
};
const retrieveTaskByApplication = (req, response) => {
  sql.query(
    `SELECT * FROM task WHERE Task_app_acronym = '${req.Task_app_acronym}'`,
    (err, res) => {
      if (err) {
        response(err, null);
      } else {
        if (res.length) {
          response(null, {
            message: "Found",
            result: res,
          });
        } else {
          response(null, {
            message: "Not Found",
            result: false,
          });
        }
      }
    }
  );
};
const changeTaskState = (req, response) => {
  var updateNotes = req.Task_notes + "\n\n" + req.oldNotes;
  sql.query(
    `update task set Task_state = '${req.Task_state}' ,Task_notes = '${req.Task_notes}' ,Task_owner = '${req.Task_owner}', Task_notes = '${updateNotes}' where Task_id = '${req.Task_id}'`,
    (err, res) => {
      if (err) {
        response(err, null);
      } else {
        response(null, {
          message: "Task State Change successfullly",
          result: true,
        });
      }
    }
  );
};
const updateTask = (req, response) => {
  var updateNotes = req.Task_notes + "\n\n" + req.oldNotes;
  sql.query(
    `update task set Task_name ='${req.Task_name}',Task_description = '${req.Task_description}',Task_notes ='${updateNotes}', Task_plan = '${req.Task_plan}', Task_owner ='${req.Task_owner}' where Task_id = '${req.Task_id}'`,
    (err, res) => {
      if (err) {
        response(err, null);
      } else {
        response(null, {
          message: "Task Updated Successfully",
          result: true,
        });
      }
    }
  );
};
const retrieveAllUserEmail = (req, response) => {
  sql.query(
    `SELECT email FROM accounts WHERE user_group like '%Project Lead%'`,
    (err, res) => {
      if (err) {
        response(err, { result: false });
      } else {
        if (res.length) {
          response(null, {
            message: "Found",
            result: res,
          });
        } else {
          response(null, {
            message: "Not Found",
            result: false,
          });
        }
      }
    }
  );
};

const retrieveApplicationByAppAcronym = (req, response) => {
  sql.query(
    `SELECT * FROM application WHERE App_Acronym = '${req.App_acronym}'`,
    (err, res) => {
      if (err) {
        response(err, null);
      } else {
        if (res.length) {
          response(null, {
            message: "Found",
            result: res,
          });
        } else {
          response(null, {
            message: "Not Found",
            result: false,
          });
        }
      }
    }
  );
};

const retrieveTaskById = (req, response) => {
  sql.query(
    `SELECT * FROM task WHERE Task_id = '${req.Task_id}'`,
    (err, res) => {
      if (err) {
        response(err, null);
      } else {
        if (res.length) {
          response(null, {
            message: "Found",
            result: res,
          });
        } else {
          response(null, {
            message: "Not Found",
            result: false,
          });
        }
      }
    }
  );
};
module.exports = {
  findByUsername,
  findAllGroup,
  findAllUsers,
  findAllUsersByGroup,
  findUsersByGroupname,
  createUsers,
  createGroup,
  createGroupWithUsername,
  disableGroup,
  disableUser,
  updateProfile,
  updateAccountUserGroup,
  getGroupStatusByGroupname,
  deleteGroupByUsername,
  checkGroup,
  createApplication,
  createPlan,
  createTask,
  retrieveAllApplication,
  retrieveApplicationByName,
  retrieveAllPlansByApplication,
  updateApplication,
  updatePlan,
  retrieveTaskByState,
  retrieveTaskByApplication,
  changeTaskState,
  updateTask,
  retrieveAllUserEmail,
  retrieveApplicationByAppAcronym,
  retrieveTaskById,
};
