//Data Service
import localstorage from "react";
import axios from "axios";
const API_URL = "http://localhost:8080/";

class UserService {
  getCurrentUser() {
    return JSON.parse(localstorage.getItem("user"));
  }
  getAllUsers() {
    return axios.get(API_URL + "admin/getAllUsers").then((res) => {
      return res.data;
    });
  }
  getAllGroup() {
    return axios.get(API_URL + "admin/getAllGroup").then((responds) => {
      return responds.data;
    });
  }
  getUser(id) {
    return axios.get(API_URL + `${id}`).then((responds) => {
      return responds.data;
    });
  }
  findUsername(username) {
    console.log("find the usern", username);
    return axios.get(API_URL + `${username}`).then((responds) => {
      console.log("the joke service layer is ", responds.data);
      return responds.data;
    });
  }
  createUser(newUser) {
    return axios
      .post(API_URL + "admin/usermanagement/createuser", newUser)
      .then((responds) => {
        console.log("the responds at client is ", responds.data);
        return responds.data;
      });
  }
  login(user) {
    return axios.post(API_URL + "login", user).then((responds) => {
      console.log("the responds at client is ", responds.data);
      return responds.data;
    });
  }

  verifyUser() {
    return axios
      .get(API_URL + "verifytoken", {
        headers: { "x-access-token": localStorage.getItem("access-token") },
      })
      .then((responds) => {
        console.log("the responds at client is ", responds);
        return responds.data;
      });
  }
  createGroup(newGroup) {
    return axios
      .post(API_URL + "admin/groupManagement/createGroup", newGroup)
      .then((responds) => {
        return responds.data;
      });
  }
  checkGroup(username, groupname) {
    return axios
      .get(API_URL + `checkgroup/${username}/${groupname}`)
      .then((responds) => {
        return responds.data;
      });
  }
  disableGroup(group) {
    return axios
      .post(API_URL + "admin/groupMangment/disableGroup", group)
      .then((responds) => {
        console.log("the responds at client is ", responds.data);
        return responds.data;
      });
  }
  disableUser(user) {
    return axios
      .post(API_URL + "admin/userManagement/disableUser", user)
      .then((responds) => {
        console.log("the responds at client is ", responds.data);
        return responds.data;
      });
  }

  updateProfile(user) {
    console.log("the user in updating profile is ", user);
    return axios
      .post(API_URL + `${user.username}` + "/updateProfile", user)
      .then((responds) => {
        console.log("the responds at client is ", responds.data);
        return responds.data;
      });
  }
  deleteGroupByUser(user) {
    console.log("deleting in progress ");
    return axios
      .post(API_URL + "admin/deleteGroupMember", user)
      .then((responds) => {
        console.log("the responds at client is ", responds.data);
        return responds.data;
      });
  }
  createGroupByUser(user) {
    console.log("adding in progress");
    return axios
      .post(API_URL + "admin/updateGroupMember", user)
      .then((responds) => {
        console.log("the responds at client is ", responds.data);
        return responds.data;
      });
  }

  getGroupData() {
    console.log("finding group");
    return axios
      .get(API_URL + "admin/groupmanagement/data")
      .then((responds) => {
        console.log("the responds at client is ", responds.data);
        return responds.data;
      });
  }
  getUsersByGroupname(groupname) {
    return axios
      .get(API_URL + "admin/groupManagement/" + `${groupname}` + "/data")
      .then((responds) => {
        console.log("the service layer is ", responds.data);
        return responds.data;
      });
  }
  updateUserUserGroup(user) {
    console.log("request", user);
    return axios
      .post(API_URL + "admin/userManagement/updateGroupname")
      .then((responds) => {
        console.log("the service layer is ", responds.data);
        return responds.data;
      });
  }

  getAllApplication() {
    console.log("getting all applications");
    return axios.get(API_URL + "application/getAll").then((responds) => {
      return responds.data;
    });
  }
  getApplication(app_acronym) {
    console.log("find the user", app_acronym);
    return axios
      .get(API_URL + "application/" + `${app_acronym}`)
      .then((responds) => {
        console.log("the joke service layer is ", responds.data);
        return responds.data;
      });
  }
  createApplication(application) {
    console.log("Creating");
    return axios
      .post(API_URL + "application/createApplication", application)
      .then((responds) => {
        return responds.data;
      });
  }

  updateApplication(application) {
    return axios
      .post(API_URL + "application/update", application)
      .then((responds) => {
        return responds.data;
      });
  }
  createPlan(plan) {
    console.log("Creating");
    return axios.post(API_URL + "plan/createPlan", plan).then((responds) => {
      return responds.data;
    });
  }
  updatePlan(plan) {
    console.log("updating");
    return axios.post(API_URL + "plan/update", plan).then((responds) => {
      return responds.data;
    });
  }
  retrieveAllPlan(plan_app_Acronoym) {
    return axios
      .get(API_URL + `${plan_app_Acronoym}` + "/getPlans")
      .then((responds) => {
        console.log("s", responds.data);
        return responds.data;
      });
  }

  retrieveTasksByStatus(task) {
    return axios.post(API_URL + "task/getTasks", task).then((responds) => {
      return responds.data;
    });
  }
  retrieveTasksByApplication(task) {
    return axios.post(API_URL + "task/getAppTasks", task).then((responds) => {
      return responds.data;
    });
  }

  changeTaskStatus(task) {
    return axios.post(API_URL + "task/changeStatus", task).then((responds) => {
      return responds.data;
    });
  }
  updateTask(task) {
    return axios.post(API_URL + "task/updateTask", task).then((responds) => {
      return responds.data;
    });
  }
  createTask(task) {
    return axios.post(API_URL + "task/createTask", task).then((responds) => {
      return responds.data;
    });
  }
}
export default new UserService();
