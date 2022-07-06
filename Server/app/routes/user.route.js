var bodyParser = require("body-parser");
const { Router } = require("express");

var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = (app) => {
  const users = require("../controllers/user.controller");

  var router = require("express").Router();
  //Need put this verifytoken above find user as it will run finduser instead if we put below.
  router.get("/verifytoken", users.verifyToken);

  //find the username from database
  router.get("/:username", users.findUser);

  /* ADMIN Route */
  /* Get */
  router.get("/admin/getAllGroup", users.findAllGroup);
  router.get("/admin/getAllUsers", users.findAllUser);
  router.post("/admin/groupManagement/createGroup", users.createGroup);
  router.post("/admin/groupMangment/disableGroup", users.disableGroup);
  /* update accounts table usergroup columns */
  router.post(
    "/admin/userManagement/updateGroupname",
    users.updateAccountUserGroup
  );
  /* find all the users from specific group */
  router.get(
    "/admin/groupManagement/:groupname/data",
    users.findUsersByGroupname
  );

  router.post("/admin/userManagement/disableUser", users.disableUser);

  router.post("/:username/updateProfile", users.updateProfile);
  router.get("/admin/getGroupStatus", users.getGroupStatus);

  /* for update and delete on account_user_group table */
  router.post("/admin/deleteGroupMember", users.deleteGroupByUsername);
  router.post("/admin/updateGroupMember", users.updatingGroupByUsername);
  router.get("/admin/groupmanagement/data", users.getGroupData);
  /* Check group function */
  router.get("/checkgroup/data", users.checkGroup);

  /* Application route */
  router.post("/application/createApplication", users.createApplication);

  /* Plan route */
  router.post("/plan/createPlan", users.createPlan);

  /* Task route */
  router.post("/task/createTask", users.createTask);

  /* Post */
  router.post("/admin/usermanagement/createuser", users.createUser);
  router.post("/login", users.login);
  app.use("/", router);
};
