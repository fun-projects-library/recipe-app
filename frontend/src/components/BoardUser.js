import React, { useState, useEffect, useReducer, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom"
import UserService from "../services/user.service";
import { API_BASE } from "../services/constants"
import RecipeService from "../services/recipe.service";
import AuthService from "../services/auth.service";
import PhotoUpload from "./PhotoUpload"
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
import { orange } from '@material-ui/core/colors';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

const OrangeCheckbox = withStyles({
  root: {
    color: orange[400],
    '&$checked': {
      color: orange[600],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

let initialState={ ingredients:[], title: "", image_url: "", publisher: "", publisher_id: "", howToCook: "", category: "", votes: 1}

const reducer = (state, action) => {
    switch(action.type){
        case "recipeIngredients" : return {...state, ingredients: [...state.ingredients, action.payload]}
        case "matchRecipeIngredients" : return {...state, ingredients: action.payload}
        case "recipeTitle" : return {...state, title: action.payload}
        case "recipeImage" : return {...state, image_url: action.payload}
        case "recipePublisher" : return {...state, publisher: action.payload}
        case "publisher_id" : return {...state, publisher_id: action.payload}
        case "recipeHowToCook" : return {...state, howToCook: action.payload}
        case "votes" : return {...state, votes: action.payload}
        case "recipeCategory" : return {...state, category: action.payload}
        case "clearAfterCreate" : return {...state, ingredients: [], title: "", image_url: "", publisher: "", howToCook: "", category: ""}
        case "ingredientRemove" : return {...state, ingredients: state.ingredients.filter(item=>{return item === action.payload ? "" : item})}
        default:
            return state;
    }
}


const BoardUser = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  //dispatch({type: "recipe", payload: jsonResponse})

  //const [content, setContent] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [myRecipes, setMyRecipes] = useState([]);
  const [mySavedRecipes, setMySavedRecipes] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [uploadedImage, setUploadedImage] = useState("")
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

  // Image URL

  const imageURLFunc = (imageURL) => {
    //console.log(imageURL)
    
    
    dispatch({type: "recipeImage", payload: imageURL});
    setUploadedImage(imageURL)
    setIsImageUploaded(true);

    image_urlRef.current.style.display = "none";
    setRequiredURL(true)
    
  }

  // Category
  const [stateCategory, setStateCategory] = useState([]);

  const handleChangeCategory = (event) => {

    if(event.target.checked){
      setStateCategory([ ...stateCategory, event.target.name ]);
    } else {
      setStateCategory(stateCategory.filter(item=>{
        return event.target.name === item ? "" : item
      }));
    }

  };
  useEffect(() => {
      dispatch({type: "recipeCategory", payload: stateCategory.join(",")});console.log(stateCategory)
  }, [stateCategory])


  useEffect(() => {
    const myCurrent = AuthService.getCurrentUser()
    setCurrentUser(myCurrent)
    setaaa("q")
    
  }, []);

  useEffect(() => {
    if(aaa !== ""){
      getMyRecipes();
      getMySavedRecipes()
      dispatch({type: "recipePublisher", payload: currentUser.username});
      dispatch({type: "publisher_id", payload: currentUser.id});
    }



  }, [aaa])

  const getMyRecipes = () => {

    axios.get(API_BASE + "users/getUserRecipes/" + currentUser.id)
    .then(res=>{
      setMyRecipes(res.data[0].myRecipes);
      //console.log(res.data[0].myRecipes)
      // const filteredArray = allRecipes.filter(item=>{
      //   return item.publisher_id===state.publisher_id ? item : ""
      // })
      // setMyRecipes(filteredArray);
    })
    .catch(err=>console.log(err));
  }

  const getMySavedRecipes = () => {
    RecipeService.getSavedRecipes(currentUser.id)
    .then(res=>{
      console.log(res.data);
      setMySavedRecipes(res.data)
    })
    .catch(err=>{console.log(err)})
  }

  const createRecipe = () => {
    //console.log(state)
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
    axios.post(API_BASE + "recipes", state)
      .then(res=>{
        console.log(res.data);
        dispatch({type: "clearAfterCreate", payload: ""});
        setStateCategory([]);
        setIsImageUploaded(false)

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
    console.log(e.target.id);
    setIsImageUploaded(true)
    axios.get(API_BASE + "recipes/" + e.target.id)
    .then(res=>{
      setUpdateRecipe(res.data)
      dispatch({type: "recipeTitle", payload: res.data.title});
      dispatch({type: "recipeImage", payload: res.data.image_url});
      dispatch({type: "matchRecipeIngredients", payload: res.data.ingredients});
      dispatch({type: "recipeHowToCook", payload: res.data.howToCook});
      dispatch({type: "votes", payload: res.data.votes});
      console.log(res.data.ingredients)
      console.log(state)
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
    axios.delete(API_BASE + "recipes/" + updateRecipe._id)
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
      setStateCategory([]);
      setIsImageUploaded(false);
    })
    .catch(err=>console.log(err))
  }

  const updateRecipeFunc = () => {
    axios.put(API_BASE + "recipes/" + updateRecipe._id, state)
    .then(res=>{
      console.log(res.data);
      dispatch({type: "clearAfterCreate", payload: ""});
      setRecipeClicked(false);
      setStateCategory([]);
      setIsImageUploaded(false)

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
        <h3 className="myRecipesHeader">My Posted Recipes</h3>
        
        <ul id="MyRecipesUL">
          {myRecipes.length !== 0 ? myRecipes.map((item,index)=>{
            return (
              <li key={index} id={item._id} className="myRecipesList" onClick={updateRecipeList}>
                <img src={item.image_url} alt="myRecipeImage" className="myRecipesImages" id={item._id}/>
                <span id={item._id}>{item.title.length > 18 ? item.title.substr(0, 19)+"..." : item.title}</span>
                </li>
            )
          }) : <p>Don't have any published recipe, yet...</p>}
        </ul>
        <h3 className="myRecipesHeader">Saved Recipes</h3>
        <ul id="MyRecipesUL">
          {mySavedRecipes.length !== 0 ? mySavedRecipes.map((item,index)=>{
            return (
              <Link to={`/recipe/${item._id}`} style={{textDecoration:"none"}} key={index}>
                <li className="myRecipesList">
                <img src={item.image_url} alt="myRecipeImage" className="myRecipesImages"/>
                  <span>{item.title.length > 18 ? item.title.substr(0, 19)+"..." : item.title}</span>
                  </li>
              </Link>
            )
          }) : <p>Don't have any saved recipe, yet...</p>}
        </ul>
      </div>

      {!recipeClicked ?
      <div id="createRecipeDiv">
      <h2 className="createRecipesHeader" style={{gridColumn: "1/4"}}>Create a new recipe...</h2>

      <label className="createRecipeLabels">Recipe Publisher: </label>
      <input type="text" className="createRecipeInputs" name="recipePublisher" onChange={handleChange} defaultValue={currentUser.username} style={{border: "none", fontWeight: "bold"}} disabled={true}/>
      <br />

      <label className="createRecipeLabels">Recipe Title: </label>
      <input type="text" className="createRecipeInputs" name="recipeTitle" onChange={handleChange} value={state.title}/> <span id="titleRequire" className="requires" ref={titleRef}>*required</span>
      {requiredTitle ? <br /> : ""}

      <label className="createRecipeLabels">Category: </label>
      <FormGroup row style={{marginLeft:"2%"}}>

          <FormControlLabel
            control={
              <OrangeCheckbox
                checked={stateCategory.includes("Vegeterian")}
                onChange={handleChangeCategory}
                name="Vegeterian"
                color="secondary"
                icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                checkedIcon={<CheckBoxIcon fontSize="large" />}
              />
            }
            label="Vegeterian"

          />
          <FormControlLabel
            control={
              <OrangeCheckbox
                checked={stateCategory.includes("Soup")}
                onChange={handleChangeCategory}
                name="Soup"
                color="primary"
                icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                checkedIcon={<CheckBoxIcon fontSize="large" />}
              />
            }
            label="Soup"
          />
          <FormControlLabel
            control={
              <OrangeCheckbox
                checked={stateCategory.includes("Pizza")}
                onChange={handleChangeCategory}
                name="Pizza"
                color="primary"
                icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                checkedIcon={<CheckBoxIcon fontSize="large" />}
              />
            }
            label="Pizza"
          />
          <FormControlLabel
            control={
              <OrangeCheckbox
                checked={stateCategory.includes("Beef")}
                onChange={handleChangeCategory}
                name="Beef"
                color="primary"
                icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                checkedIcon={<CheckBoxIcon fontSize="large" />}
              />
            }
            label="Beef"
          />
          <FormControlLabel
            control={
              <OrangeCheckbox
                checked={stateCategory.includes("Salad")}
                onChange={handleChangeCategory}
                name="Salad"
                color="primary"
                icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                checkedIcon={<CheckBoxIcon fontSize="large" />}
              />
            }
            label="Salad"
          />
          <FormControlLabel
            control={
              <OrangeCheckbox
                checked={stateCategory.includes("Breakfast")}
                onChange={handleChangeCategory}
                name="Breakfast"
                color="primary"
                icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                checkedIcon={<CheckBoxIcon fontSize="large" />}
              />
            }
            label="Breakfast"
          />
          <FormControlLabel
            control={
              <OrangeCheckbox
                checked={stateCategory.includes("Desserts")}
                onChange={handleChangeCategory}
                name="Desserts"
                color="primary"
                icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                checkedIcon={<CheckBoxIcon fontSize="large" />}
              />
            }
            label="Desserts"
          />
          <FormControlLabel
            control={
              <OrangeCheckbox
                checked={stateCategory.includes("Chicken")}
                onChange={handleChangeCategory}
                name="Chicken"
                color="primary"
                icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                checkedIcon={<CheckBoxIcon fontSize="large" />}
              />
            }
            label="Chicken"
          />
          <FormControlLabel
            control={
              <OrangeCheckbox
                checked={stateCategory.includes("Seafood")}
                onChange={handleChangeCategory}
                name="Seafood"
                color="primary"
                icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                checkedIcon={<CheckBoxIcon fontSize="large" />}
              />
            }
            label="Seafood"
          />
          <FormControlLabel
            control={
              <OrangeCheckbox
                checked={stateCategory.includes("Kebab")}
                onChange={handleChangeCategory}
                name="Kebab"
                color="primary"
                icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                checkedIcon={<CheckBoxIcon fontSize="large" />}
              />
            }
            label="Kebab"
          />
          <FormControlLabel
            control={
              <OrangeCheckbox
                checked={stateCategory.includes("Pork")}
                onChange={handleChangeCategory}
                name="Pork"
                color="primary"
                icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                checkedIcon={<CheckBoxIcon fontSize="large" />}
              />
            }
            label="Pork"
          />
          <FormControlLabel
            control={
              <OrangeCheckbox
                checked={stateCategory.includes("Steak")}
                onChange={handleChangeCategory}
                name="Steak"
                color="primary"
                icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                checkedIcon={<CheckBoxIcon fontSize="large" />}
              />
            }
            label="Steak"
          />
          <FormControlLabel
            control={
              <OrangeCheckbox
                checked={stateCategory.includes("Lasagna")}
                onChange={handleChangeCategory}
                name="Lasagna"
                color="primary"
                icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                checkedIcon={<CheckBoxIcon fontSize="large" />}
              />
            }
            label="Lasagna"
          />

        </FormGroup>
      <br />


      <label className="createRecipeLabels">Recipe Image URL: </label>
      {/* <input type="text" className="createRecipeInputs" name="recipeImage" onChange={handleChange} value={state.image_url}/>  */}

      <PhotoUpload imageURLFunc={imageURLFunc}/>
      <span id="imageURLRequire" className="requires" ref={image_urlRef}>*required</span>
      {requiredURL ? <ul>
        {isImageUploaded ? <div className="pictureDiv"><img src={state.image_url} className="pictureDrop" alt="uploadedPic"/></div>: null}
        </ul> : ""}

      <label className="createRecipeLabels">Ingredients: </label>
      <input type="text" className="createRecipeInputs" name="recipeIngredient" placeholder="Enter your items one by one and Click Enter..." onChange={handleChange} onKeyUp={(e)=> {return e.key === "Enter" && e.target.value !== "" ? addIngredient() : ""}} value={ingredient}/> <span id="ingredientsRequire" className="requires" ref={ingredientsRef}>*required</span>
      {requiredIngredient ? <br /> : ""}


      <label className="createRecipeLabels"><u>Current Ingredients: </u></label>
      <div className="ingredientsDiv">{state.ingredients.length === 0 ? <p style={{width: "200px", margin: "2%", fontSize: "12px"}}> ( Not added any ingredients... )</p> : state.ingredients.map((item,index)=>{
        return (
          <span className="ingredientSpan" key={index} onClick={ingredientRemove}>{item}</span>
        )
      })}</div>

      <br />

      <label className="createRecipeLabels">How To Cook: </label>
      <textarea className="form-control" id="createRecipeTextArea" rows="5" maxLength="700" placeholder="( 700 Characters... )"  name="recipeHowToCook" onChange={handleChange} value={state.howToCook}/> <span className="requires" ref={howToCookRef}>*required</span>
      {requiredCook ? <br /> : ""}

      <button onClick={createRecipe} className="createRecipeButton btn" style={{gridColumn: "1/4"}}>Post your recipe...</button>
  </div>
       : ""}

      {recipeClicked ?
      <div id="createRecipeDiv">
        <h2 className="createRecipesHeader"  style={{gridColumn: "1/4"}}>Update my recipe</h2>

        <label className="createRecipeLabels">Recipe Publisher: </label>
        <input type="text" className="createRecipeInputs" name="recipePublisher" onChange={handleChange} value={currentUser.username} style={{border: "none", fontWeight: "bold"}} disabled={true}/>
        <br />

        <label className="createRecipeLabels">Recipe Title: </label>
        <input type="text" className="createRecipeInputs" name="recipeTitle" onChange={handleChange} value={state.title}/> <span id="titleRequire" className="requires" ref={titleRef}>*required</span>
        <br />

        <label className="createRecipeLabels">Category: </label>
          <FormGroup row>

              <FormControlLabel
                control={
                  <OrangeCheckbox
                    checked={stateCategory.includes("Vegeterian")}
                    onChange={handleChangeCategory}
                    name="Vegeterian"
                    color="primary"
                    icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                  checkedIcon={<CheckBoxIcon fontSize="large" />}
                  />
                }
                label="Vegeterian"
              />
              <FormControlLabel
                control={
                  <OrangeCheckbox
                    checked={stateCategory.includes("Soup")}
                    onChange={handleChangeCategory}
                    name="Soup"
                    color="primary"
                    icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                    checkedIcon={<CheckBoxIcon fontSize="large" />}
                  />
                }
                label="Soup"
              />
              <FormControlLabel
                control={
                  <OrangeCheckbox
                    checked={stateCategory.includes("Pizza")}
                    onChange={handleChangeCategory}
                    name="Pizza"
                    color="primary"
                    icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                    checkedIcon={<CheckBoxIcon fontSize="large" />}
                  />
                }
                label="Pizza"
              />
              <FormControlLabel
                control={
                  <OrangeCheckbox
                    checked={stateCategory.includes("Beef")}
                    onChange={handleChangeCategory}
                    name="Beef"
                    color="primary"
                    icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                    checkedIcon={<CheckBoxIcon fontSize="large" />}
                  />
                }
                label="Beef"
              />
              <FormControlLabel
                control={
                  <OrangeCheckbox
                    checked={stateCategory.includes("Salad")}
                    onChange={handleChangeCategory}
                    name="Salad"
                    color="primary"
                    icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                    checkedIcon={<CheckBoxIcon fontSize="large" />}
                  />
                }
                label="Salad"
              />
              <FormControlLabel
                control={
                  <OrangeCheckbox
                    checked={stateCategory.includes("Breakfast")}
                    onChange={handleChangeCategory}
                    name="Breakfast"
                    color="primary"
                    icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                    checkedIcon={<CheckBoxIcon fontSize="large" />}
                  />
                }
                label="Breakfast"
              />
              <FormControlLabel
                control={
                  <OrangeCheckbox
                    checked={stateCategory.includes("Desserts")}
                    onChange={handleChangeCategory}
                    name="Desserts"
                    color="primary"
                    icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                    checkedIcon={<CheckBoxIcon fontSize="large" />}
                  />
                }
                label="Desserts"
              />
              <FormControlLabel
                control={
                  <OrangeCheckbox
                    checked={stateCategory.includes("Chicken")}
                    onChange={handleChangeCategory}
                    name="Chicken"
                    color="primary"
                    icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                    checkedIcon={<CheckBoxIcon fontSize="large" />}
                  />
                }
                label="Chicken"
              />
              <FormControlLabel
                    control={
                      <OrangeCheckbox
                        checked={stateCategory.includes("Seafood")}
                        onChange={handleChangeCategory}
                        name="Seafood"
                        color="primary"
                        icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                        checkedIcon={<CheckBoxIcon fontSize="large" />}
                      />
                    }
                    label="Seafood"
                  />
                  <FormControlLabel
                    control={
                      <OrangeCheckbox
                        checked={stateCategory.includes("Kebab")}
                        onChange={handleChangeCategory}
                        name="Kebab"
                        color="primary"
                        icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                        checkedIcon={<CheckBoxIcon fontSize="large" />}
                      />
                    }
                    label="Kebab"
                  />
                  <FormControlLabel
                    control={
                      <OrangeCheckbox
                        checked={stateCategory.includes("Pork")}
                        onChange={handleChangeCategory}
                        name="Pork"
                        color="primary"
                        icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                        checkedIcon={<CheckBoxIcon fontSize="large" />}
                      />
                    }
                    label="Pork"
                  />
                  <FormControlLabel
                    control={
                      <OrangeCheckbox
                        checked={stateCategory.includes("Steak")}
                        onChange={handleChangeCategory}
                        name="Steak"
                        color="primary"
                        icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                        checkedIcon={<CheckBoxIcon fontSize="large" />}
                      />
                    }
                    label="Steak"
                  />
              <FormControlLabel
                control={
                  <OrangeCheckbox
                    checked={stateCategory.includes("Lasagna")}
                    onChange={handleChangeCategory}
                    name="Lasagna"
                    color="primary"
                    icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                    checkedIcon={<CheckBoxIcon fontSize="large" />}
                  />
                }
                label="Lasagna"
              />

            </FormGroup>
          <br />

        <label className="createRecipeLabels">Recipe Image URL: </label>
        <PhotoUpload imageURLFunc={imageURLFunc}/>
        {/* <div className="pictureDiv">
          <img src={state.image_url} className="pictureDrop" alt="uploadedPic"/> 
        </div> */}
        {isImageUploaded ? <div className="pictureDiv"><img src={state.image_url} className="pictureDrop" alt="uploadedPic"/></div>: null}
        {/* <br /> */}
        
      

        <label className="createRecipeLabels">Ingredients: </label>
        <input type="text" className="createRecipeInputs" name="recipeIngredient" placeholder="Enter your items one by one and Click Enter..." onChange={handleChange} onKeyUp={(e)=> {return e.key === "Enter" && e.target.value !== "" ? addIngredient() : ""}} value={ingredient}/> <span id="ingredientsRequire" className="requires" ref={ingredientsRef}>*required</span>
        <br />


        <label className="createRecipeLabels"><u>Current Ingredients: </u></label>
        <div className="ingredientsDiv">{state.ingredients === 0 ? <p style={{width: "200px", marginTop: "5%", fontSize: "12px"}}>( Not added any ingredients... )</p> : state.ingredients.map((item,index)=>{
          return (
            <span className="ingredientSpan" key={index} onClick={ingredientRemove}>{item}</span>
          )
        })}</div>
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
          <button className="btn" onClick={()=>{setRecipeClicked(false); dispatch({type: "clearAfterCreate", payload: ""});setRequiredTitle(true);setRequiredURL(true);setRequiredIngredient(true);setRequiredCook(true);setIsImageUploaded(false);setStateCategory([])}} style={{margin:"5%"}}>
          <i className="fas fa-arrow-alt-circle-left" style={{fontSize:"28px"}}></i>Create New Recipe
            </button>
        </div> : ""
      }

    </>
  );
};

export default BoardUser;

