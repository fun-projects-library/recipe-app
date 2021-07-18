import React, { useState, useEffect, useReducer, useRef } from "react";
import axios from "axios"
import UserService from "../services/user.service";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';



let initialState={ ingredients:[], title: "", image_url: "", publisher: "", publisher_id: "", howToCook: "", category: ""}

const reducer = (state, action) => {
    switch(action.type){
        case "recipeIngredients" : return {...state, ingredients: [...state.ingredients, action.payload]}
        case "matchRecipeIngredients" : return {...state, ingredients: action.payload}
        case "recipeTitle" : return {...state, title: action.payload}
        case "recipeImage" : return {...state, image_url: action.payload}
        case "recipePublisher" : return {...state, publisher: action.payload}
        case "publisher_id" : return {...state, publisher_id: action.payload}
        case "recipeHowToCook" : return {...state, howToCook: action.payload}
        case "recipeCategory" : return {...state, category: action.payload}
        case "clearAfterCreate" : return {...state, ingredients: [], title: "", image_url: "", publisher: "", howToCook: "", category: ""}
        case "ingredientRemove" : return {...state, ingredients: state.ingredients.filter(item=>{return item === action.payload ? "" : item})}
        default: 
            return state;
    }
}


const BoardUser = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  //dispatch({type: "recipe", payload: jsonResponse})

  //const [content, setContent] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [myRecipes, setMyRecipes] = useState([]);
  //const [currentUser, setCurrentUser] = useState("");
  const [aaa, setaaa] = useState("");


  const [requiredTitle, setRequiredTitle] = useState(true);
  const [requiredURL, setRequiredURL] = useState(true);
  const [requiredIngredient, setRequiredIngredient] = useState(true);
  const [requiredCook, setRequiredCook] = useState(true);

  const [recipeClicked, setRecipeClicked] = useState(false);
  const [updateRecipe, setUpdateRecipe] = useState([]);

  const titleRef = useRef();
  const image_urlRef = useRef()
  const ingredientsRef = useRef()
  const howToCookRef = useRef()

  // Category
  const [stateCategory, setStateCategory] = useState([
    // Vegeterian: false,
    // Soup: false,
    // Pizza: false,
    // Beef: false,
    // Salad: false,
    // Breakfast: false,
    // Desserts: false,
    // Chicken: false,
    // Lasagna: false,
  ]);

  const handleChangeCategory = (event) => {
    
    if(event.target.checked){
      setStateCategory([ ...stateCategory, event.target.name ]);
      dispatch({type: "recipeCategory", payload: stateCategory.join(",")});
      console.log(stateCategory.includes("Vegeterian"))
    } else {
      setStateCategory(stateCategory.filter(item=>{
        return event.target.name === item ? "" : item
      }));
      dispatch({type: "recipeCategory", payload: stateCategory.join(",")});
    }
    
  };

  
  // const getCurrentUser = () => {
  //   return JSON.parse(localStorage.getItem("user"));
  // };

  useEffect(() => {
    UserService.getUserBoard().then(
      (response) => {
        //setContent(response.data);
      },
      (error) => {
        // const _content =
        //   (error.response &&
        //     error.response.data &&
        //     error.response.data.message) ||
        //   error.message ||
        //   error.toString();

        //setContent(_content);
      }
    );
    dispatch({type: "recipePublisher", payload: props.currentUser ? props.currentUser.username : ""});
    dispatch({type: "publisher_id", payload: props.currentUser ? props.currentUser.id : ""});
    //setCurrentUser(getCurrentUser())
  }, []);

  useEffect(() => {
    getMyRecipes()
    
    
  }, [aaa])

  const getMyRecipes = () => {
    // axios.get("http://localhost:8080/api/recipes/getUserRecipes")
    //console.log(currentUser)
    const myPublisher_id = props.currentUser ? props.currentUser.id : ""

    axios.get("http://localhost:8080/api/users/getUserRecipes/" + myPublisher_id)
    .then(res=>{
      setMyRecipes(res.data[0].myRecipes);
      //console.log(res.data[0].myRecipes)
      // const filteredArray = allRecipes.filter(item=>{
      //   return item.publisher_id===state.publisher_id ? item : ""
      // })
      // setMyRecipes(filteredArray);
      
      setaaa("q")

    })
    .catch(err=>console.log(err));

  }

  const createRecipe = () => {
    console.log(state)
    if(state.title === ""){
      titleRef.current.style.display = "inline-block";
      setRequiredTitle(false)
  } else if(state.image_url === ""){
      image_urlRef.current.style.display = "inline-block";
      setRequiredURL(false)
  } else if(state.ingredients.length === 0){
      ingredientsRef.current.style.display = "inline-block";
      setRequiredIngredient(false)
  } else if(state.howToCook === ""){
      howToCookRef.current.style.display = "inline-block";
      setRequiredCook(false)
      
  } else {
    //console.log(state);
    axios.post("http://localhost:8080/api/recipes", state)
      .then(res=>{
        console.log(res.data);
        dispatch({type: "clearAfterCreate", payload: ""});
        setStateCategory([])

        titleRef.current.style.display = "none";
        image_urlRef.current.style.display = "none";
        ingredientsRef.current.style.display = "none";
        howToCookRef.current.style.display = "none";
        setRequiredTitle(true)
        setRequiredURL(true)
        setRequiredIngredient(true)
        setRequiredCook(true)
        setaaa("w")
      })
      .catch(err=>console.log(err))
  }

    //console.log(props);
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

  const ingredientRemove = (e) => {
    dispatch({type: "ingredientRemove", payload: e.target.innerHTML});
  }
  const updateRecipeList = (e)=> {
    axios.get("http://localhost:8080/api/recipes/" + e.target.id)
    .then(res=>{
      setUpdateRecipe(res.data)
      dispatch({type: "recipeTitle", payload: res.data.title});
      dispatch({type: "recipeImage", payload: res.data.image_url});
      dispatch({type: "matchRecipeIngredients", payload: res.data.ingredients});
      dispatch({type: "recipeHowToCook", payload: res.data.howToCook});
      
      if(res.data.category){
        
        setStateCategory(res.data.category.split(","))
        dispatch({type: "recipeCategory", payload: res.data.category});
      } else {
        console.log("bbbbb")
        setStateCategory([])
        dispatch({type: "recipeCategory", payload: ""});
      }
      
      console.log(res.data);
      setRecipeClicked(true)
    })
    .catch(err=>console.log(err))
    
  }

  const removeRecipeFunc = () => {
    axios.delete("http://localhost:8080/api/recipes/" + updateRecipe._id)
    .then(res=>{
      console.log(res.data)
      console.log(updateRecipe.title)
      setMyRecipes(myRecipes.filter(item=> {return item.title === updateRecipe.title ? "" : item}))
      dispatch({type: "clearAfterCreate", payload: ""});
      setRequiredTitle(true)
      setRequiredURL(true)
      setRequiredIngredient(true)
      setRequiredCook(true)
      setRecipeClicked(false)
      setStateCategory([])
    })
    .catch(err=>console.log(err))
  }

  const updateRecipeFunc = () => {
    axios.put("http://localhost:8080/api/recipes/" + updateRecipe._id, state)
    .then(res=>{
      console.log(res.data);
      dispatch({type: "clearAfterCreate", payload: ""});
      setRecipeClicked(false);
      setStateCategory([])

      setRequiredTitle(true)
      setRequiredURL(true)
      setRequiredIngredient(true)
      setRequiredCook(true)
      setaaa("r")
      
    })
    .catch(err=>console.log(err))
  }

  return (
    <>
      {/* <header className="jumbotron"> */}
      <div className="myRecipesDiv">
        <h2 className="myRecipesHeader">My Recipes</h2>
        <br />
        <ul>
          {myRecipes.map((item,index)=>{
            return (
              <li key={index} id={item._id} className="myRecipesList" onClick={updateRecipeList}>{item.title}</li>
            )
          })}
        </ul>
      </div>
      
      {!recipeClicked ? 
      <div id="createRecipeDiv">
          <h2 className="myRecipesHeader" style={{gridColumn: "1/4"}}>Create a new recipe...</h2>

          <label className="createRecipeLabels">Recipe Publisher: </label>
          <input type="text" className="createRecipeInputs" name="recipePublisher" onChange={handleChange} value={props.currentUser ? props.currentUser.username : ""} style={{border: "none", fontWeight: "bold"}} disabled={true}/> 
          <br />

          <label className="createRecipeLabels">Recipe Title: </label>
          <input type="text" className="createRecipeInputs" name="recipeTitle" onChange={handleChange} value={state.title}/> <span id="titleRequire" className="requires" ref={titleRef}>*required</span>
          {requiredTitle ? <br /> : ""} 

          <label className="createRecipeLabels">Category: </label>
          <FormGroup row>
              
              <FormControlLabel
                control={
                  <Checkbox
                    checked={stateCategory.includes("Vegeterian")}
                    onChange={handleChangeCategory}
                    name="Vegeterian"
                    color="primary"
                  />
                }
                label="Vegeterian"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={stateCategory.includes("Soup")}
                    onChange={handleChangeCategory}
                    name="Soup"
                    color="primary"
                  />
                }
                label="Soup"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={stateCategory.includes("Pizza")}
                    onChange={handleChangeCategory}
                    name="Pizza"
                    color="primary"
                  />
                }
                label="Pizza"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={stateCategory.includes("Beef")}
                    onChange={handleChangeCategory}
                    name="Beef"
                    color="primary"
                  />
                }
                label="Beef"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={stateCategory.includes("Salad")}
                    onChange={handleChangeCategory}
                    name="Salad"
                    color="primary"
                  />
                }
                label="Salad"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={stateCategory.includes("Breakfast")}
                    onChange={handleChangeCategory}
                    name="Breakfast"
                    color="primary"
                  />
                }
                label="Breakfast"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={stateCategory.includes("Desserts")}
                    onChange={handleChangeCategory}
                    name="Desserts"
                    color="primary"
                  />
                }
                label="Desserts"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={stateCategory.includes("Chicken")}
                    onChange={handleChangeCategory}
                    name="Chicken"
                    color="primary"
                  />
                }
                label="Chicken"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={stateCategory.includes("Lasagna")}
                    onChange={handleChangeCategory}
                    name="Lasagna"
                    color="primary"
                  />
                }
                label="Lasagna"
              />
            
            </FormGroup> 
          <br />


          <label className="createRecipeLabels">Recipe Image URL: </label>
          <input type="text" className="createRecipeInputs" name="recipeImage" onChange={handleChange} value={state.image_url}/> <span id="imageURLRequire" className="requires" ref={image_urlRef}>*required</span>
          {requiredURL ? <br /> : ""} 

          <label className="createRecipeLabels">Ingredients: </label>
          <input type="text" className="createRecipeInputs" name="recipeIngredient" placeholder="Enter your items one by one and Click Enter..." onChange={handleChange} onKeyUp={(e)=> {return e.key === "Enter" && e.target.value !== "" ? addIngredient() : ""}} value={ingredient}/> <span id="ingredientsRequire" className="requires" ref={ingredientsRef}>*required</span>
          {requiredIngredient ? <br /> : ""} 

          
          <label className="createRecipeLabels"><u>Current Ingredients: </u></label>
          <div className="ingredientsDiv">{state.ingredients.length === 0 ? <p style={{width: "200px", margin: "2%", fontSize: "12px"}}> ( Not added any ingredients... )</p> : state.ingredients.map((item,index)=>{
            return (
              <span className="ingredientSpan" key={index} onClick={ingredientRemove}>{item}</span>
            )
          })}</div>
          {/* <input type="text" className="createRecipeInputs" name="ingredientsArray" defaultValue={state.ingredients.join(",")} style={{border: "none"}}  disabled={true}/> */}
          <br />
          
          <label className="createRecipeLabels">How To Cook: </label>
          {/* <label className="createRecipeLabels"></label> */}
          <textarea className="form-control" id="createRecipeTextArea" rows="5" maxLength="500" placeholder="( 500 Characters... )"  name="recipeHowToCook" onChange={handleChange} value={state.howToCook}/> <span className="requires" ref={howToCookRef}>*required</span>
          {requiredCook ? <br /> : ""} 

          <button onClick={createRecipe} className="createRecipeButton btn" style={{gridColumn: "1/4"}}>Post your recipe...</button>
      </div> : ""}

      {recipeClicked ? 
      <div id="createRecipeDiv">
        <h2 className="myRecipesHeader"  style={{gridColumn: "1/4"}}>Update my recipe</h2>

        <label className="createRecipeLabels">Recipe Publisher: </label>
        <input type="text" className="createRecipeInputs" name="recipePublisher" onChange={handleChange} value={props.currentUser ? props.currentUser.username : ""} style={{border: "none", fontWeight: "bold"}} disabled={true}/> 
        <br />

        <label className="createRecipeLabels">Recipe Title: </label>
        <input type="text" className="createRecipeInputs" name="recipeTitle" onChange={handleChange} value={state.title}/> <span id="titleRequire" className="requires" ref={titleRef}>*required</span>
        <br />

        <label className="createRecipeLabels">Category: </label>
          <FormGroup row>
              
              <FormControlLabel
                control={
                  <Checkbox
                    checked={stateCategory.includes("Vegeterian")}
                    onChange={handleChangeCategory}
                    name="Vegeterian"
                    color="primary"
                  />
                }
                label="Vegeterian"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={stateCategory.includes("Soup")}
                    onChange={handleChangeCategory}
                    name="Soup"
                    color="primary"
                  />
                }
                label="Soup"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={stateCategory.includes("Pizza")}
                    onChange={handleChangeCategory}
                    name="Pizza"
                    color="primary"
                  />
                }
                label="Pizza"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={stateCategory.includes("Beef")}
                    onChange={handleChangeCategory}
                    name="Beef"
                    color="primary"
                  />
                }
                label="Beef"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={stateCategory.includes("Salad")}
                    onChange={handleChangeCategory}
                    name="Salad"
                    color="primary"
                  />
                }
                label="Salad"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={stateCategory.includes("Breakfast")}
                    onChange={handleChangeCategory}
                    name="Breakfast"
                    color="primary"
                  />
                }
                label="Breakfast"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={stateCategory.includes("Desserts")}
                    onChange={handleChangeCategory}
                    name="Desserts"
                    color="primary"
                  />
                }
                label="Desserts"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={stateCategory.includes("Chicken")}
                    onChange={handleChangeCategory}
                    name="Chicken"
                    color="primary"
                  />
                }
                label="Chicken"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={stateCategory.includes("Lasagna")}
                    onChange={handleChangeCategory}
                    name="Lasagna"
                    color="primary"
                  />
                }
                label="Lasagna"
              />
            
            </FormGroup> 
          <br />

        <label className="createRecipeLabels">Recipe Image URL: </label>
        <input type="text" className="createRecipeInputs" name="recipeImage" onChange={handleChange} value={state.image_url}/> <span id="imageURLRequire" className="requires" ref={image_urlRef}>*required</span>
        <br />

        <label className="createRecipeLabels">Ingredients: </label>
        <input type="text" className="createRecipeInputs" name="recipeIngredient" placeholder="Enter your items one by one and Click Enter..." onChange={handleChange} onKeyUp={(e)=> {return e.key === "Enter" && e.target.value !== "" ? addIngredient() : ""}} value={ingredient}/> <span id="ingredientsRequire" className="requires" ref={ingredientsRef}>*required</span>
        <br />

        
        <label className="createRecipeLabels"><u>Current Ingredients: </u></label>
        <div className="ingredientsDiv">{state.ingredients === 0 ? <p style={{width: "200px", marginTop: "5%", fontSize: "12px"}}>( Not added any ingredients... )</p> : state.ingredients.map((item,index)=>{
          return (
            <span className="ingredientSpan" key={index} onClick={ingredientRemove}>{item}</span>
          )
        })}</div>
        {/* <input type="text" className="createRecipeInputs" name="ingredientsArray" defaultValue={state.ingredients.join(",")} style={{border: "none"}}  disabled={true}/> */}
        <br />
        
        <label className="createRecipeLabels">How To Cook: </label>
        <textarea className="form-control" id="createRecipeTextArea" name="recipeHowToCook" value={state.howToCook} onChange={handleChange} rows="5"></textarea>
        <br />
        <div style={{gridColumn: "2", marginTop: "5%"}}>
          <button onClick={updateRecipeFunc} className="updateRecipeButton btn">Update recipe</button>
          <button onClick={removeRecipeFunc} className="removeRecipeButton btn">Remove recipe</button>
        </div>
        
      </div> : ""}
      {recipeClicked ? 
        <div>
          <button className="btn" onClick={()=>{setRecipeClicked(false); dispatch({type: "clearAfterCreate", payload: ""});setRequiredTitle(true);setRequiredURL(true);setRequiredIngredient(true);setRequiredCook(true);setStateCategory([])}} style={{margin:"5%"}}>
          <i className="fas fa-arrow-alt-circle-left" style={{fontSize:"30px"}}></i>Create New Recipe
            </button>
        </div> : ""
      }
      
    </>
  );
};

export default BoardUser;