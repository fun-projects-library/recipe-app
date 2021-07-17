import axios from "axios";

const API_URL = "http://localhost:8080/api/recipes/paginatedRecipes/";
const API_URL_VOTE = "http://localhost:8080/api/recipes/";

const getRecipe = (params) => {
  return axios.get(API_URL, { params });
};

const voteRecipe = (id, update) => {
  return axios.put(API_URL_VOTE + id, update);
};

const myObject = {
    getRecipe,
    voteRecipe
}

export default myObject;