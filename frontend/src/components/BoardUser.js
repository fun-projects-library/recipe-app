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
        case "clearAfterCreate" : return {...state, ingredients: [], title: "", image_url: "", publisher: ""}
        default: 
            return state;
    }
}


const BoardUser = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  //dispatch({type: "recipe", payload: jsonResponse})

  const [content, setContent] = useState("");
  const [ingredient, setIngredient] = useState("");
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
    dispatch({type: "recipePublisher", payload: props.currentUser ? props.currentUser.username : ""});
    dispatch({type: "publisher_id", payload: props.currentUser ? props.currentUser.id : ""});
    
    
  }, []);

  useEffect(() => {
    getMyRecipes()
      
  }, [aaa])

  const getMyRecipes = () => {
    // axios.get("http://localhost:8080/api/recipes/getUserRecipes")

    axios.get("http://localhost:8080/api/users/getUserRecipes")
    .then(res=>{
      setMyRecipes(res.data[0].myRecipes);
    
      // const filteredArray = allRecipes.filter(item=>{
      //   return item.publisher_id===state.publisher_id ? item : ""
      // })
      // setMyRecipes(filteredArray);
      
      setaaa("q")

    })
    .catch(err=>console.log(err));

    


  }

  const createRecipe = () => {
    if(state.title && state.publisher){
      axios.post("http://localhost:8080/api/recipes", state)
      .then(res=>{
        console.log(res.data);
        dispatch({type: "clearAfterCreate", payload: ""});
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
          {myRecipes.map((item,index)=>{
            return (
              <li key={index}>{item.title}</li>
            )
          })}
        </ul>
      </div>
      
      
      <div id="createRecipeDiv">
          <h2>Create a new recipe...</h2>

          <label className="createRecipeLabels">Recipe Publisher: </label>
          <input type="text" className="createRecipeInputs" name="recipePublisher" onChange={handleChange} value={props.currentUser ? props.currentUser.username : ""} style={{border: "none", fontWeight: "bold"}} disabled={true}/>
          <br />

          <label className="createRecipeLabels">Recipe Title: </label>
          <input type="text" className="createRecipeInputs" name="recipeTitle" onChange={handleChange} value={state.title}/>
          <br />

          <label className="createRecipeLabels">Recipe Image URL: </label>
          <input type="text" className="createRecipeInputs" name="recipeImage" onChange={handleChange} value={state.image_url}/>
          <br />

          <label className="createRecipeLabels">Ingredients: </label>
          <input type="text" className="createRecipeInputs" name="recipeIngredient" placeholder="Enter your items one by one and Click Enter..." onChange={handleChange} onKeyUp={(e)=> {return e.key === "Enter" ? addIngredient() : ""}} value={ingredient}/>
          <br />

          
          <label className="createRecipeLabels"><u>Current Ingredients: </u></label>
          <div className="ingredientsDiv">{state.ingredients.length === 0 ? <p style={{width: "200px", marginTop: "5%", fontSize: "12px"}}>( Not added any ingredients... )</p> : state.ingredients.map((item,index)=>{
            return (
              <span className="ingredientSpan">{item}</span>
            )
          })}</div>
          {/* <input type="text" className="createRecipeInputs" name="ingredientsArray" defaultValue={state.ingredients.join(",")} style={{border: "none"}}  disabled={true}/> */}
          <br />

          <button onClick={createRecipe} className="createRecipeButton">Add your recipe...</button>
      </div>
      
    </>
  );
};

export default BoardUser;