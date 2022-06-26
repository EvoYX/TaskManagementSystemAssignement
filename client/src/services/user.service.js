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
    return axios.get(API_URL + `${username}`).then((responds) => {
      console.log("the service layer is ", responds.data);
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
        console.log("the responds at client is ", responds.data);
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
  // updateGroupMember(member) {
  //   return axios
  //     .post(API_URL + "admin/groupmanagement/updateGroupMember", member)
  //     .then((responds) => {
  //       console.log("the responds at client is ", responds.data);
  //       return responds.data;
  //     });
  // }
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
}
export default new UserService();
