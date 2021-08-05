import axios from "axios";
import authHeader from "./auth-header";
import {API_BASE} from "./constants"

const API_URL = API_BASE + "test/";
const API_URL_ALL_USERS = API_BASE + "user/allUsers";
const API_URL_USER_DELETE = API_BASE + "user/remove/";
const API_URL_USER_FIND = API_BASE + "userDetails/";
const API_URL_USER_UPDATE = API_BASE + "userUpdate/";
const API_URL_USER_RECIPES = API_BASE + "users/getUserRecipes/";
const API_URL_USER_USERNAME = API_BASE + "findUserByUsername/";

const API_URL_REMOVE_RECIPE = API_BASE + "recipes/";




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

const getUserByUsername = (params) => {
  return axios.get(API_URL_USER_USERNAME + params);
};

const removeRecipe = (params) => {
  return axios.delete(API_URL_REMOVE_RECIPE + params);
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
  getUserRecipes,
  removeRecipe,
  getUserByUsername
};

export default myObject;