import axios from "axios";

const API_URL = "http://localhost:8080/api/recipes/";

const getRecipe = () => {
  return axios.get(API_URL);
};

const myObject = {
    getRecipe
}

export default myObject;