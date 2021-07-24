import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/test/";
const API_URL_ALL_USERS = "http://localhost:8080/api/user/allUsers";
const API_URL_USER_DELETE = "http://localhost:8080/api/user/remove/";
const API_URL_USER_FIND = "http://localhost:8080/api/userDetails/";
const API_URL_USER_UPDATE = "http://localhost:8080/api/userUpdate/";
const API_URL_USER_RECIPES = "http://localhost:8080/api/users/getUserRecipes/";


const getPublicContent = () => {
  return axios.get(API_URL + "all");
};

const getUserBoard = () => {
  return axios.get(API_URL + "user", { headers: authHeader() });
};

const getModeratorBoard = () => {
  return axios.get(API_URL + "mod", { headers: authHeader() });
};

const getAdminBoard = () => {
  return axios.get(API_URL + "admin", { headers: authHeader() });
};

const getAllUsers = () => {
  return axios.post(API_URL_ALL_USERS);
};

const removeUser = (params) => {
  return axios.delete(API_URL_USER_DELETE + params);
};

const findOneUser = (params) => {
  return axios.get(API_URL_USER_FIND + params);
};

const updateUser = (id, update) => {
  return axios.put(API_URL_USER_UPDATE + id, update);
};

const getUserRecipes = (params) => {
  return axios.get(API_URL_USER_RECIPES + params);
};

const myObject = {
  getPublicContent,
  getUserBoard,
  getModeratorBoard,
  getAdminBoard,
  getAllUsers,
  removeUser,
  findOneUser,
  updateUser,
  getUserRecipes
};

export default myObject;