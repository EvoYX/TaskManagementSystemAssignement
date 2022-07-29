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

  const errorHandler = (error, request, response, next) => {
    response.send({ code: 600, Message: error.message });
  };
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
  router.get("/checkgroup/:username/:groupname", users.checkGroup);

  /* Application route */
  router.post("/application/createApplication", users.createApplication);
  router.get("/application/getAll", users.retreiveAllApplication);
  router.get("/application/:app_acronym", users.retreiveApplication);
  router.post("/application/update", users.updateApplication);

  /* Plan route */
  router.post("/plan/createPlan", users.createPlan);
  router.get("/:plan_app_Acronym/getPlans", users.retreivePlans);
  router.post("/plan/update", users.updatePlan);

  /* Task route */
  router.post("/task/createTask", users.createTask);
  router.post("/task/getTasks", users.retrieveTasks);
  router.post("/task/changeStatus", users.changeTaskStatus);
  router.post("/task/updateTask", users.updateTask);
  router.post("/task/getAppTasks", users.retrieveApplicationTasks);
  router.post("/sendEmail", users.sendEmail);

  /* Post */
  router.post("/admin/usermanagement/createuser", users.createUser);
  router.post("/login", users.login);

  /* Assignment 3 */
  router.post(
    "/api/CreateTask/:Username/:Password/:App_acronym",
    [users.verifyUser, users.verifyPermission],
    users.createTaskAssignement3
  );

  router.post(
    "/api/GetTaskByState/:Username/:Password/:App_acronym/:Task_state",
    [users.verifyUser],
    users.retrieveTaskAssignment3
  );
  router.post(
    "/api/PromoteTask2Done/:Username/:Password/:Task_id",
    [users.verifyUser],
    users.updateTaskAssignment3
  );
  app.use("/", router);
  app.use("/api", errorHandler);
};
