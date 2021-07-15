import axios from "axios";

const API_URL = "http://localhost:8080/api/recipes/paginatedRecipes/";

const getRecipe = (params) => {
  return axios.get(API_URL, { params });
};

const myObject = {
    getRecipe
}

export default myObject;