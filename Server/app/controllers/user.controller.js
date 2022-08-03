const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const config = require("../config/auth");
const nodemailer = require("nodemailer");

exports.findUser = (req, res) => {
  User.findByUsername(req.params.username, (err, data) => {
    if (err) {
      res.send({ message: err.sqlMessage.toString(), result: null });
    } else {
      res.send(data);
    }
  });
};

exports.findAllUser = (req, res) => {
  User.findAllUsers(req, (err, data) => {
    if (err) {
      res.send({ message: err.sqlMessage.toString(), result: null });
    } else {
      res.send(data);
    }
  });
};

exports.findAllGroup = (req, res) => {
  User.findAllGroup(req, (err, data) => {
    if (err) {
      res.send({ message: "No available groups", result: null });
    } else {
      res.send(data);
    }
  });
};

exports.findUsersByGroupname = (req, res) => {
  User.findUsersByGroupname(req.params.groupname, (err, data) => {
    if (err) {
      res.send({ message: err.sqlMessage.toString(), result: null });
    } else {
      res.send(data);
    }
  });
};

exports.createUser = async (req, res) => {
  req.body.password = await bcrypt.hash(req.body.password, 10);

  User.createUsers(req.body, (err, data) => {
    if (err) {
      res.send({ message: err.sqlMessage, result: false });
    } else {
      res.send(data);
    }
  });
};
exports.verifyToken = (req, res) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
      auth: false,
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.send({
        message: "Unauthorized!",
        auth: false,
      });
    } else {
      req.username = decoded.username;
      return res.send({ message: "Authenticated", auth: true });
    }
  });
};

exports.login = async (req, res) => {
  User.findByUsername(req.body.username, (err, data) => {
    if (err) {
      res.send({ message: "Not Found", result: null });
    } else {
      if (data.result == null) {
        res.send(data);
      } else {
        bcrypt
          .compare(req.body.password, data.result.password)
          .then((doMatch) => {
            if (doMatch) {
              const username = data.result.username;
              const token = jwt.sign({ username }, config.secret, {
                expiresIn: 3600, //1hr
              });
              return res.json({
                message: "Found",
                result: data.result,
                accessToken: token,
                auth: true,
              });
            } else {
              return res.json({
                message: "Invalid Password",
                result: null,
                auth: false,
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  });
};

exports.createGroup = async (req, res) => {
  User.createGroup(req.body, (err, data) => {
    if (err) {
      res.send({ message: "Error in creating group", result: false });
    } else {
      res.send(data);
    }
  });
};

exports.disableGroup = async (req, res) => {
  User.disableGroup(req.body, (err, data) => {
    if (err) {
      res.send({
        message: "Errors in disabling the group",
        result: false,
      });
    } else {
      res.send(data);
    }
  });
};
exports.disableUser = async (req, res) => {
  User.disableUser(req.body, (err, data) => {
    if (err) {
      res.send({ message: "Unable to disable", result: false });
    } else {
      res.send(data);
    }
  });
};
exports.updateProfile = async (req, res) => {
  if (req.body.password != null) {
    req.body.password = await bcrypt.hash(req.body.password, 10);
  }
  User.updateProfile(req.body, (err, data) => {
    if (err) {
      res.send({ message: "Errors in updating profile", result: false });
    } else {
      res.send(data);
    }
  });
};
//Update accounts table group member columns
exports.updateAccountUserGroup = async (req, res) => {
  User.updateAccountUserGroup(req.body, (err, data) => {
    if (err) {
      res.send({ message: "Errors in updating profile", result: false });
    } else {
      res.send(data);
    }
  });
};
//update account_user_group_table data
exports.updatingGroupByUsername = async (req, res) => {
  User.createGroupWithUsername(req.body, (err, data) => {
    if (err) {
      res.send("error", { message: err.message });
    } else {
      res.send(data);
    }
  });
};
//delete account_user_group table data
exports.deleteGroupByUsername = async (req, res) => {
  User.deleteGroupByUsername(req.body, (err, data) => {
    if (err) {
      res.send({
        message: "Unable to delete the group",
        result: false,
      });
    } else {
      res.send(data);
    }
  });
};

/* Finding group status */
exports.getGroupStatus = async (req, res) => {
  User.getGroupStatusByGroupname(req.params.username, (err, data) => {
    if (err) {
      res.send(data);
    } else {
      res.send(data);
    }
  });
};
exports.getGroupData = async (req, res) => {
  var groups = []; //get the usergroups table data (consist of only status &name)
  var groupsData = []; // the data tat will be sent to front end (group name, status, users)
  var users = []; //temp array to store the username
  var userGroups = []; //mapping the account_usergroup data table into temp array
  User.findAllGroup(req, (err, data) => {
    if (err) {
      res.status(500).send({ message: err.message });
    } else {
      if (data.result != null) {
        groups = data.result.map((result) => result);
        User.findAllUsersByGroup((err, usersdata) => {
          if (err) {
            res.status(500).send({ message: err.message });
          } else {
            userGroups = usersdata.result.map((result) => result);
            for (let index = 0; index < groups.length; index++) {
              for (let uIndex = 0; uIndex < userGroups.length; uIndex++) {
                if (userGroups[uIndex].groupname == groups[index].name) {
                  users.push(userGroups[uIndex].username);
                }
              }
              const groupData = {
                groupname: groups[index].name,
                status: groups[index].status,
                users: users,
              };
              groupsData.push(groupData);
              users = [];
            }
            res.send({ message: "Found", result: groupsData });
          }
        });
      } else {
        res.send({
          message: "unable to find groups in group table",
          result: false,
        });
      }
    }
  });
};

exports.checkGroup = async (req, res) => {
  User.checkGroup(req.params, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
};

/* Assignment 2  Application/Plan/Task controller */
exports.createApplication = async (req, res) => {
  User.createApplication(req.body, (err, data) => {
    if (err) {
      res.send({
        message: "Duplicate Entry Found! Please Try Again, Thank You!",
        result: false,
      });
    } else {
      res.send(data);
    }
  });
};
exports.createPlan = async (req, res) => {
  User.createPlan(req.body, (err, data) => {
    if (err) {
      res.send({ message: err.message, result: false });
    } else {
      res.send(data);
    }
  });
};
exports.createTask = async (req, res) => {
  User.createTask(req.body, (err, data) => {
    if (err) {
      res.send({ message: err.message, result: false });
    } else {
      res.send(data);
    }
  });
};
exports.retreiveAllApplication = async (req, res) => {
  User.retrieveAllApplication(req, (err, data) => {
    if (err) {
      res.send({ message: err.message });
    } else {
      res.send(data);
    }
  });
};
exports.retreiveApplication = async (req, res) => {
  User.retrieveApplicationByName(req.params, (err, data) => {
    if (err) {
      res.send({ message: "Error in SQL Query", result: false });
    } else {
      res.send(data);
    }
  });
};
exports.retreivePlans = async (req, res) => {
  User.retrieveAllPlansByApplication(req.params, (err, data) => {
    if (err) {
      res.send({ message: "Error in SQL Query", result: false });
    } else {
      res.send(data);
    }
  });
};

exports.updateApplication = async (req, res) => {
  User.updateApplication(req.body, (err, data) => {
    if (err) {
      res.send({
        message: "Fail To Update! Please try again",
        result: false,
      });
    } else {
      res.send(data);
    }
  });
};
exports.updatePlan = async (req, res) => {
  User.updatePlan(req.body, (err, data) => {
    if (err) {
      res.send({
        message: "Fail To Update! Please try again",
        result: false,
      });
    } else {
      res.send(data);
    }
  });
};

exports.changeTaskStatus = async (req, res) => {
  User.changeTaskState(req.body, (err, data) => {
    if (err) {
      res.send({
        message: "Change Status Fail",
        result: false,
      });
    } else {
      res.send(data);
    }
  });
};
exports.updateTask = async (req, res) => {
  User.updateTask(req.body, (err, data) => {
    if (err) {
      res.send({
        message: "Update Failure",
        result: false,
      });
    } else {
      res.send(data);
    }
  });
};

exports.retrieveTasks = async (req, res) => {
  User.retrieveTaskByState(req.body, (err, data) => {
    if (err) {
      res.send({
        message: "Change Status Fail",
        result: false,
      });
    } else {
      res.send(data);
    }
  });
};
exports.retrieveApplicationTasks = async (req, res) => {
  User.retrieveTaskByApplication(req.body, (err, data) => {
    if (err) {
      res.send({
        message: "No Task",
        result: false,
      });
    } else {
      res.send(data);
    }
  });
};
exports.sendEmail = async (req, res) => {
  User.retrieveAllUserEmail(req.body, (err, data) => {
    if (err) {
      res.send({
        message: "No user",
        result: false,
      });
    } else {
      var receiverEmail = data.result.reduce(
        (prev, current) => prev + `${current.email},`,
        ""
      );

      main(
        req.body.username,
        req.body.email,
        receiverEmail,
        req.body.task
      ).catch(console.error);

      res.send({ Message: "Email Sent", result: true });
    }
  });
};
async function main(username, senderEmail, receiverEmail, taskid) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport

  var transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "ca0de56830d3e5",
      pass: "285b2058a2d2fd",
    },
  });
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `${username} 👻 ${senderEmail}`, // sender address
    to: `${receiverEmail}`, //"bar@example.com, baz@example.com", // list of receivers
    subject: `Task ${taskid} Completion ✔`, // Subject line
    text: `${username} has finish the task on '${new Date().toUTCString()}'`, // plain text body
    html: `${username} has finish the task on ${new Date().toUTCString()}`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

/* Assignment 3 */

exports.verifyUser = (req, res, next) => {
  console.log("veiry user");
  User.findByUsername(req.params.Username, (err, data) => {
    if (err) {
      res.send({ code: 401 });
    } else {
      if (data.result == null) {
        res.send({ code: 401 });
      } else {
        bcrypt
          .compare(req.params.Password, data.result.password)
          .then((doMatch) => {
            if (doMatch) {
              if (data.result.status == "Disable") {
                res.send({ code: 403 });
              } else {
                next();
              }
            } else {
              res.send({ code: 400 });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  });
};

exports.verifyPermission = (req, res, next) => {
  console.log("verifying ");
  User.findByUsername(req.params.Username, (err, data) => {
    console.log("s", data.result);
    if (data.result != null) {
      User.retrieveApplicationByAppAcronym(req.params, (err, data1) => {
        if (data1.result) {
          var group = data.result.user_group.split(",");
          if (group.includes(data1.result[0].App_permit_create)) {
            next();
          } else {
            res.send({ code: 402 });
          }
        } else {
          console.log("error");
          res.send({ code: 501 });
        }
      });
    } else {
      res.send({ code: 401 });
    }
  });
};
exports.verifyDonePermission = (req, res, next) => {
  User.findByUsername(req.params.Username, (err, data) => {
    if (data.result) {
      User.retrieveApplicationByAppAcronym(req.params, (err, data1) => {
        if (data1.result) {
          var group = data.result.user_group.split(",");
          if (group.includes(data1.result[0].App_permit_Done)) {
            next();
          } else {
            res.send({ code: 402 });
          }
        } else {
          console.log("error");
          res.send({ code: 501 });
        }
      });
    }
  });
};
exports.createTaskAssignement3 = async (req, res) => {
  console.log("Entering createTask");
  if (req.body.Task_name == "") {
    res.send({ code: 500 });
  } else {
    User.findByUsername(req.params.Username, (err, data) => {
      if (data.result) {
        if (req.body.Task_plan == "") {
          User.retrieveApplicationByAppAcronym(req.params, (err1, data1) => {
            if (data1.result) {
              // else {
              var rnum =
                "R" + (parseInt(data1.result[0].App_Rnumber.slice(1)) + 1);
              var Task_id = data1.result[0].App_Acronym + "_" + rnum;
              var notes =
                "Current State: Open, " +
                new Date().toUTCString() +
                " Task Created By " +
                req.params.Username;
              var Task = {
                Task_id: Task_id,
                Task_name: req.body.Task_name,
                Task_description: req.body.Task_description,
                Task_notes: notes,
                Task_plan: req.body.Task_plan,
                Task_app_acronym: req.params.App_acronym,
                Task_state: "Open",
                Task_owner: req.params.Username,
                Task_creator: req.params.Username,
                Task_createDate: new Date().toLocaleDateString(),
                App_Rnumber: rnum,
              };
              User.createTask(Task, (err2, data2) => {
                if (data2.result) {
                  res.send({
                    code: 200,
                  });
                } else {
                  //not sure need cater for duplicate task_id anot
                }
              });
              // }
            } else {
              res.send({ code: 500 });
            }
          });
        } else {
          var planName = {
            plan_app_Acronym: req.params.App_acronym,
          };
          User.retrieveAllPlansByApplication(planName, (err, data) => {
            if (data.result) {
              var validPlan = data.result
                .map((res) => res.Plan_MVP_name)
                .includes(req.body.Task_plan);
              if (validPlan) {
                User.retrieveApplicationByAppAcronym(
                  req.params,
                  (err1, data1) => {
                    if (data1.result) {
                      if (req.body.Task_id == "") {
                        res.send({ code: 500, result: false });
                      } else {
                        var rnum =
                          "R" +
                          (parseInt(data1.result[0].App_Rnumber.slice(1)) + 1);
                        var Task_id = data1.result[0].App_Acronym + "_" + rnum;
                        var notes =
                          "Current State: Open, " +
                          new Date().toUTCString() +
                          " Task Created By " +
                          req.params.Username;
                        var Task = {
                          Task_id: Task_id,
                          Task_name: req.body.Task_name,
                          Task_description: req.body.Task_description,
                          Task_notes: notes,
                          Task_plan: req.body.Task_plan,
                          Task_app_acronym: req.params.App_acronym,
                          Task_state: "Open",
                          Task_owner: req.params.Username,
                          Task_creator: req.params.Username,
                          Task_createDate: new Date().toLocaleDateString(),
                          App_Rnumber: rnum,
                        };
                        User.createTask(Task, (err2, data2) => {
                          if (data2.result) {
                            res.send({
                              code: 200,
                            });
                          } else {
                            //not sure need cater for duplicate task_id anot
                          }
                        });
                      }
                    }
                  }
                );
              } else {
                res.send({
                  code: 502,
                });
              }
            } else {
              res.send({
                code: 501,
              });
            }
          });
        }
      }
    });
  }
};
exports.retrieveTaskAssignment3 = async (req, res) => {
  var taskState = req.params.Task_state;
  if (
    taskState == "Open" ||
    taskState == "Doing" ||
    taskState == "To Do" ||
    taskState == "Done" ||
    taskState == "Close"
  ) {
    User.retrieveApplicationByAppAcronym(req.params, (err1, data1) => {
      if (data1.result) {
        var retreiveTask = {
          Task_state: req.params.Task_state,
          Task_app_acronym: req.params.App_acronym,
        };
        User.retrieveTaskByState(retreiveTask, (err, data2) => {
          // if (data2.result) {
          res.send({
            code: 210,
            result: data2.result,
          });
          // }
        });
      } else {
        res.send({ code: 501 });
      }
    });
  } else {
    res.send({ code: 505 });
  }
};
exports.updateTaskAssignment3 = async (req, res) => {
  User.findByUsername(req.params.Username, (err, data) => {
    if (data.result) {
      var email = data.result.email;
      User.retrieveTaskById(req.params, (err, data1) => {
        if (data1.result) {
          if (data1.result[0].Task_state != "Doing") {
            res.send({
              code: 503,
            });
          } else {
            var appName = {
              App_acronym: data1.result[0].Task_app_acronym,
            };
            User.retrieveApplicationByAppAcronym(appName, (err, data3) => {
              if (data3.result) {
                var group = data.result.user_group.split(",");
                if (group.includes(data3.result[0].App_permit_Doing)) {
                  var newNote =
                    "Current state: Done, " +
                    new Date().toUTCString() +
                    " " +
                    req.params.Username +
                    " " +
                    "change from Doing state to To Do state";
                  var task = {
                    Task_id: data1.result[0].Task_id,
                    Task_state: "Done",
                    Task_owner: req.params.Username,
                    Task_notes: newNote,
                    oldNotes: data1.result[0].Task_notes,
                  };
                  User.changeTaskState(task, (err, data2) => {
                    if (data2.result) {
                      User.retrieveAllUserEmail(req, (err, data2) => {
                        var receiverEmail = data2.result.reduce(
                          (prev, current) => prev + `${current.email},`,
                          ""
                        );
                        main(
                          req.params.Username,
                          email,
                          receiverEmail,
                          req.params.Task_id
                        ).catch(console.error);

                        res.send({
                          code: 220,
                        });
                      });
                    }
                  });
                } else {
                  res.send({ code: 402 });
                }
              } else {
                res.send({ code: 600 });
              }
            });
          }
        } else {
          res.send({
            code: 504,
          });
        }
      });
    }
  });
};
