import React, { useState, useEffect, useReducer } from "react";
import axios from "axios"
import UserService from "../services/user.service";


let initialState={ ingredients:[], title: "", image_url: "", publisher: "", publisher_id: "" }

const reducer = (state, action) => {
    switch(action.type){
        case "recipeIngredients" : return {...state, ingredients: [...state.ingredients, action.payload]}
        case "recipeTitle" : return {...state, title: action.payload}
        case "recipeImage" : return {...state, image_url: action.payload}
        case "recipePublisher" : return {...state, publisher: action.payload}
        case "publisher_id" : return {...state, publisher_id: action.payload}
        default: 
            return state;
    }
}


const BoardUser = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  //dispatch({type: "recipe", payload: jsonResponse})

  const [content, setContent] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [allRecipes, setAllRecipes] = useState([]);
  const [myRecipes, setMyRecipes] = useState([]);
  const [aaa, setaaa] = useState("");
  


  useEffect(() => {
    UserService.getUserBoard().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setContent(_content);
      }
    );
    dispatch({type: "recipePublisher", payload: props.currentUser.username});
    dispatch({type: "publisher_id", payload: props.currentUser.id});
    
    
  }, []);

  useEffect(() => {
    getMyRecipes()
      
  }, [aaa])

  const getMyRecipes = () => {
    axios.get("http://localhost:8080/api/recipes/getUserRecipes")
    .then(res=>{
      setAllRecipes(res.data.filter(item=>{
        return item.publisher_id===state.publisher_id ? item : ""
      }));
      //console.log(state.publisher_id);

      // setTimeout(() => {
      //   const filteredArray = allRecipes.filter(item=>{
      //     return item.publisher_id===state.publisher_id ? item : ""
      //   })
      //   setMyRecipes(filteredArray);

      // }, 2000);

      
  
      
      // console.log(filteredArray)
      setaaa("q")
    })
    .catch(err=>console.log(err));

    


  }

  const createRecipe = () => {
    if(state.title && state.publisher){
      axios.post("http://localhost:8080/api/recipes", state)
      .then(res=>{
        console.log(res.data);
        setaaa("w")
      })
      .catch(err=>console.log(err))
    }
    
    
    console.log(props);
  }

  const handleChange = (e) => {
    if(e.target.name === "recipeIngredient"){
      setIngredient(e.target.value)
    } else {
      dispatch({type: e.target.name, payload: e.target.value})
    }
    
  }

  const addIngredient = () => {
    dispatch({type: "recipeIngredients", payload: ingredient});
    setIngredient("")
  }

  return (
    <>
      {/* <header className="jumbotron"> */}
      <div>
        <h2>My Recipes</h2>
        <ul>
          {allRecipes.map((item,index)=>{
            return (
              <li key={index}>{item.title}</li>
            )
          })}
        </ul>
      </div>
      
      
      <div id="createRecipeDiv">
          <h2>Create a new recipe...</h2>

          <label style={{width: "100px"}}>Recipe Publisher: </label>
          <input type="text" className="createRecipeInputs" name="recipePublisher" onChange={handleChange} value={props.currentUser.username} style={{border: "none", fontWeight: "bold"}} disabled={true}/>
          <br />

          <label style={{width: "100px"}}>Recipe Title: </label>
          <input type="text" className="createRecipeInputs" name="recipeTitle" onChange={handleChange} />
          <br />

          <label style={{width: "100px"}}>Recipe Image URL: </label>
          <input type="text" className="createRecipeInputs" name="recipeImage" onChange={handleChange} />
          <br />

          <label style={{width: "100px"}}>Ingredients: </label>
          <input type="text" className="createRecipeInputs" name="recipeIngredient" placeholder="Enter your items one by one and Click Enter..." onChange={handleChange} onKeyUp={(e)=> {return e.key === "Enter" ? addIngredient() : ""}} value={ingredient}/>
          <br />

          {/* <p>{state.ingredients.join(",")}</p> */}
          <label style={{width: "100px"}}>Current Ingredients: </label>
          <input type="text" className="createRecipeInputs" name="ingredientsArray" defaultValue={state.ingredients.join(",")} style={{border: "none"}}  disabled={true}/>
          <br />

          <button onClick={createRecipe} className="createRecipeButton">Add your recipe...</button>
      </div>
      
    </>
  );
};

export default BoardUser;