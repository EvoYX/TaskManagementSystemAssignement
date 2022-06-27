const { result } = require("lodash");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const config = require("../config/auth");
const { Console } = require("console");

exports.findUser = (req, res) => {
  console.log("finding user by username");
  User.findByUsername(req.params.username, (err, data) => {
    if (err) {
      res.status(500).send({ message: err.message });
    } else {
      res.send(data);
    }
  });
};

exports.findAllUser = (req, res) => {
  console.log("finding user by username");
  User.findAllUsers(req, (err, data) => {
    if (err) {
      res.status(500).send({ message: err.message });
    } else {
      res.send(data);
    }
  });
};

exports.findAllGroup = (req, res) => {
  console.log("find all group");
  User.findAllGroup(req, (err, data) => {
    if (err) {
      res.status(500).send({ message: err.message });
    } else {
      res.send(data);
    }
  });
};
exports.findUserGroupByFilter = (req, res) => {
  console.log("finding user by group");
  User.findUserGroupByFilter(req, (err, data) => {
    if (err) {
      res.status(500).send({ message: err.message });
    } else {
      console.log("the result is ", data);
      res.send(data);
    }
  });
};

exports.createUser = async (req, res) => {
  console.log("creating user");
  req.body.password = await bcrypt.hash(req.body.password, 10);

  User.createUsers(req.body, (err, data) => {
    if (err) {
      res.send("error", { message: err.message });
    } else {
      res.send(data);
    }
  });
};
exports.verifyToken = (req, res) => {
  let token = req.headers["x-access-token"];
  console.log("the token is ", token);
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
      console.log("the decoded is ", decoded.username);
      req.username = decoded.username;
      return res.send({ message: "Authenticated", auth: true });
    }
  });
};

exports.login = async (req, res) => {
  console.log("login");
  User.findByUsername(req.body.username, (err, data) => {
    if (err) {
      res.status(500).send({ message: err.message });
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
                expiresIn: 300, //5mins
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
  console.log("creating group");
  User.createGroup(req.body, (err, data) => {
    if (err) {
      res.send("error", { message: err.message });
    } else {
      res.send(data);
    }
  });
};

exports.disableGroup = async (req, res) => {
  console.log("disabling group");
  User.disableGroup(req.body, (err, data) => {
    if (err) {
      res.send("error", { message: err.message });
    } else {
      res.send(data);
    }
  });
};
exports.disableUser = async (req, res) => {
  console.log("disable user");

  User.disableUser(req.body, (err, data) => {
    if (err) {
      res.send("error", { message: err.message });
    } else {
      res.send(data);
    }
  });
};
exports.updateProfile = async (req, res) => {
  console.log("updating profile");
  if (req.body.password != null) {
    req.body.password = await bcrypt.hash(req.body.password, 10);
  }

  User.updateProfile(req.body, (err, data) => {
    if (err) {
      res.send("error", { message: err.message });
    } else {
      res.send(data);
    }
  });
};
//Update accounts table group member columns
exports.updateGroupMember = async (req, res) => {
  console.log("updating groupmember");
  User.updateGroupMember(req.body, (err, data) => {
    if (err) {
      res.send("error", { message: err.message });
    } else {
      res.send(data);
    }
  });
};
//update account_user_group_table data
exports.updatingGroupByUsername = async (req, res) => {
  console.log("adding group by username");
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
  console.log("deleting the group that the user belong to");
  User.deleteGroupByUsername(req.body, (err, data) => {
    if (err) {
      res.send("error", { message: err.message });
    } else {
      res.send(data);
    }
  });
};

exports.getGroupByUser = async (req, res) => {
  console.log("getting user group", req.params);
  User.findGroupByUsername(req.params.username, (err, data) => {
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
        User.findUserGroupByFilter((err, usersdata) => {
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
