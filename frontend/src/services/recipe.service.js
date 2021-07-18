import axios from "axios";

const API_URL = "http://localhost:8080/api/recipes/paginatedRecipes/";
const API_URL_VOTE = "http://localhost:8080/api/recipes/";
const API_URL_SEARCH = "http://localhost:8080/api/recipes/filteredRecipes"

const getRecipe = (params) => {
  return axios.get(API_URL, { params });
};

const voteRecipe = (id, update) => {
  return axios.put(API_URL_VOTE + id, update);
};

const searchRecipe = (params) => {
  return axios.post(API_URL_SEARCH, params);
};

const myObject = {
    getRecipe,
    voteRecipe,
    searchRecipe
}

export default myObject;