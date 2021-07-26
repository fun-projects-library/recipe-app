import axios from "axios";

const API_URL = "http://localhost:8080/api/recipes/paginatedRecipes/";
const API_URL_ALL = "http://localhost:8080/api/recipes/";
const API_URL_SEARCH = "http://localhost:8080/api/recipes/filteredRecipes"
const API_URL_SORTED = "http://localhost:8080/api/recipes/getSortedList"
const API_URL_SAVED = "http://localhost:8080/api/recipes/getSavedRecipes/"


const getAllRecipes = () => {
  return axios.get(API_URL_ALL);
};

const getRecipe = (params) => {
  return axios.get(API_URL, { params });
};

const findOneRecipe = (id) => {
  return axios.get(API_URL_ALL + id);
};

const getSavedRecipes = (id) => {
  return axios.get(API_URL_SAVED + id);
};

const voteRecipe = (id, update) => {
  return axios.put(API_URL_ALL + id, update);
};
const saveForLaterRecipe = (id, update) => {
  return axios.put(API_URL_ALL + id, update);
};

const searchRecipe = (params) => {
  return axios.post(API_URL_SEARCH, params);
};

const sortedList = (params) => {
  return axios.post(API_URL_SORTED, params);
};

const myObject = {
    getRecipe,
    voteRecipe,
    searchRecipe,
    getAllRecipes,
    sortedList,
    saveForLaterRecipe,
    findOneRecipe,
    getSavedRecipes
}

export default myObject;