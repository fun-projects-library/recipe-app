import React, { useEffect, useReducer, useState } from "react";
// import axios from "axios";
import {useParams, Link} from 'react-router-dom';
import RecipeService from "../services/recipe.service"
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import {API_BASE} from "../services/constants"

let initialState={ recipe:[], similarCategories: [], theSamePublisher: [] }

const reducer = (state, action) => {
    switch(action.type){
        case "recipe" : return {...state, recipe: action.payload};
        case "similarCategories" : return {...state, similarCategories: action.payload};
        case "theSamePublisher" : return {...state, theSamePublisher: action.payload};
        default: 
            return state;
    }
}

export default function Recipe(props) {

    const [votedRecipe, setVotedRecipe] = useState(false)
    const [totalVotes, setTotalVotes] = useState(0);
    const [votersArray, setVotersArray] = useState([])
    const [showPublisherName, setShowPublisherName] = useState("")
    //const [uploadingSimilarCategories, setUploadingSimilar] = useState("aaa")
    const [aaa, setAAA] = useState("")
    
    const [state, dispatch] = useReducer(reducer, initialState);
    // const [content, setContent] = useState([]);
    //console.log("eee")
    let {id} = useParams();
    useEffect(() => {
        fetch( API_BASE + "recipes/" + id)
        .then(res=> res.json())
        .then(jsonResponse=>{
            dispatch({type: "recipe", payload: [jsonResponse]})
            console.log(jsonResponse);
            setShowPublisherName(jsonResponse.publisher)
            //setUploadingSimilar("bbb");   
        })
        .catch(err=>console.log(err))
        
      }, []);

      useEffect(() => {
          if(state.recipe.length !== 0){
            findSimilarRecipes();
            findTheSamePublisher();
            if(state.recipe[0].voters && props.currentUser){
                setVotedRecipe(state.recipe[0].voters.includes(props.currentUser.id))
                
                setVotersArray(state.recipe[0].voters)
            }
            if(state.recipe[0].votes){
                setTotalVotes(state.recipe[0].votes)
            }
            // console.log(state.recipe[0])
            // console.log(props.currentUser)
            //console.log(state.recipe[0].voters.includes(props.currentUser.id))
          }
          
      }, [state.recipe])

      const findSimilarRecipes = () => {
          const firstCategory = state.recipe[0].category.split(",")
          
          //console.log(state.recipe[0].category.split(","))
        //const query = {title: state.recipe[0].title, category: firstCategory, publisher: state.recipe[0].publisher}
        const query = {category: firstCategory[0], title: firstCategory[0], publisher: firstCategory[0]}
        RecipeService.searchRecipe({query})
        .then(res=>{
          console.log(res.data.recipes);
          dispatch({type: "similarCategories", payload: res.data.recipes});
          
          
        })
        .catch(err=>{
          console.log(err)
        })
      }
      const findTheSamePublisher = () => {
        const theSamePublisher = state.recipe[0].publisher
        
        //console.log(state.recipe[0].category.split(","))
      //const query = {title: state.recipe[0].title, category: theSamePublisher, publisher: state.recipe[0].publisher}
      const query = {category: theSamePublisher, title: theSamePublisher, publisher: theSamePublisher}
      RecipeService.searchRecipe({query})
      .then(res=>{
        console.log(res.data);
        dispatch({type: "theSamePublisher", payload: res.data.recipes});
        
        
      })
      .catch(err=>{
        console.log(err)
      })
    }
      const handleVoteChange = (e)=>{
        //console.log(e.target.id)
        setVotedRecipe(!votedRecipe)
        // console.log(state.recipe)
        // console.log(state.recipe.filter(item=>{
        //     return item._id === e.target.id ? item.voters = [...item.voters, props.currentUser.id] : item
        //   }))
    
        if(e.target.checked){
          setTotalVotes(totalVotes+1);
          
          setVotersArray([...votersArray, props.currentUser.id])
          
          //setRecipe({...recipe, votes: totalVotes+1})
          dispatch({type: "recipe", payload: state.recipe.filter(item=>{
            return item._id === e.target.id ? item.votes = totalVotes +1 : item
          })})
          dispatch({type: "recipe", payload: state.recipe.filter(item=>{
            return item._id === e.target.id ? item.voters = [...item.voters, props.currentUser.id] : item
          })})
          //console.log(state.recipe)
            

        //   setContent(content.filter(item=>{
        //     return item._id === e.target.id ? item.votes = totalVotes +1 : item
        //   }))
        //   setContent(content.filter(item=>{
        //     return item._id === e.target.id ? item.voters = [...item.voters, props.currentUser.id] : item
        //   }))
        
          setAAA("bbb")
        } else {
          setTotalVotes(totalVotes-1)
          setVotersArray(votersArray.filter(item=>{
            return item === props.currentUser.id ? "" : item
          }))
          dispatch({type: "recipe", payload: state.recipe.filter(item=>{
            return item._id === e.target.id ? item.votes = totalVotes -1 : item
          })})
          dispatch({type: "recipe", payload: state.recipe.filter(item=>{
            return item._id === e.target.id ? item.voters = item.voters.filter(element=>{
              return element === props.currentUser.id ? "" : element
            }) : item
          })})
          //console.log(state.recipe)

        //   setContent(content.filter(item=>{
        //     return item._id === e.target.id ? item.votes = totalVotes -1 : item
        //   }))
        //   setContent(content.filter(item=>{
        //     return item._id === e.target.id ? item.voters = item.voters.filter(element=>{
        //       return element === props.currentUser.id ? "" : element
        //     }) : item
        //   }))
          
          setAAA("ccc")
        }
        //console.log(e.target.checked)
        //console.log(votersArray)
        //updateRecipeVote(e.target.id)
    
      }
    
      const updateRecipeVote = () => {
        if(state.recipe.length !== 0){
            setAAA("")
            RecipeService.voteRecipe(state.recipe[0]._id, {voters: votersArray, votes: totalVotes})
            .then(res=>console.log(res.data))
            .catch(err=>console.log(err))
        }
        
        //console.log(recipe)
      }
    
      useEffect(() => {
          if(state.recipe.length !== 0 && aaa !== ""){
              //console.log(state.recipe)
            updateRecipeVote();
          }
        
        //retrieveTutorials()
    
      }, [aaa])

      const changeHomeRecipe = (updateid) => {
        fetch(API_BASE + "recipes/" + updateid)
        .then(res=> res.json())
        .then(jsonResponse=>{
            console.log(jsonResponse)
            dispatch({type: "recipe", payload: [jsonResponse]});
            setShowPublisherName(jsonResponse.publisher)
            //console.log(jsonResponse)
            //setUploadingSimilar("ccc");   
        })
        .catch(err=>console.log(err))
      }
    return (
        <>
            <div style={{margin:"15% 0%"}}>
                <ul style={{paddingLeft:"0"}}>
                    <h3 style={{textAlign:"center",color:"orange",fontWeight:"bold",marginBottom:"5%"}}>Similar Categories</h3>
                    {state.similarCategories.length !== 0 ? state.similarCategories.map((item,index)=>{
                        return (
                          <li key={index} style={{listStyleType:"none"}}  className="recipeHover" onClick={()=>{changeHomeRecipe(item._id)}}>
                                <Link to={`/recipe/${item._id}`}  className="results__link results__link--active">
                                    <figure className="results__fig">
                                        <img src={item.image_url} alt={item.title}/>
                                    </figure>
                                    <div className="results__data">
                                        <h4 className="results__name">{item.title}</h4>
                                        <p className="results__author">{item.publisher}</p>
                                    </div>
                                </Link>
                            </li>
                        )
                    }) : <p>There is not any similar recipe exist!</p>}
                </ul>
                
            </div>
            <div style={{height: "fit-content"}}>
                {state.recipe.map((recipe,index)=>{
                    return (
                        <div key={index} className="recipe" style={{gridColumn:"2/4", padding:"3%", marginBottom:"3%"}}>
                        <figure className="recipe__fig">
                            <img src={recipe.image_url} alt={recipe.title} className="recipe__img" />
                            <h1 className="recipe__title">
                                <span>{recipe.title}</span>
                            </h1>
                        </figure>

                        <div className="recipe__details" style={{justifyContent:"flex-end"}}>
                            {/* <div className="recipe__info">
                                <svg className="recipe__info-icon">
                                    <use href="img/icons.svg#icon-stopwatch"></use>
                                </svg>
                                <span className="recipe__info-data recipe__info-data--minutes"></span>
                                <span className="recipe__info-text">{recipe.cooking_time}</span>
                            </div>
                            <div className="recipe__info">
                                <svg className="recipe__info-icon">
                                    <use href="img/icons.svg#icon-man"></use>
                                </svg>
                                <span className="recipe__info-data recipe__info-data--people"></span>
                                <span className="recipe__info-text">{recipe.servings}</span>

                                <div className="recipe__info-buttons">
                                    <button className="btn-tiny">
                                        <svg>
                                            <use href="img/icons.svg#icon-circle-with-minus"></use>
                                        </svg>
                                    </button>
                                    <button className="btn-tiny">
                                        <svg>
                                            <use href="img/icons.svg#icon-circle-with-plus"></use>
                                        </svg>
                                    </button>
                                </div>

                            </div> */}
                            {/* <button className="recipe__love">
                                <svg className="header__likes">
                                    <use href="img/icons.svg#icon-heart-outlined"></use>
                                </svg>
                                {recipe.publisher}
                            </button> */}
                            <div style={{display:"flex", flexWrap:"wrap"}}>

                                <button className="recipe__love" onClick={(e)=>{props.currentUser ? console.log("Voted") : e.target.parentElement.nextElementSibling.innerHTML = "Please, sign in!"}}>
                                <FormControlLabel
                                    control={<Checkbox checked={votedRecipe} icon={<FavoriteBorder />} checkedIcon={<Favorite />}  disabled={props.currentUser ? false : true}  name="voteRecipe" id={recipe._id} onClick={handleVoteChange}/>}
                                    style={{marginLeft:"35%", color:"red"}}/>
                                </button>
                                <span style={{marginTop:"4%", fontSize:"18px", marginLeft:"5%", width:"200px", color:"orange"}}><Link to={`/user/${recipe.publisher}`} style={{textDecoration:"none", color:"orange"}}>{recipe.publisher}</Link></span>
                                <div style={{flexBasis: "100%", height:"0"}}></div>
                                <span style={{marginTop:"4%", fontSize:"10px", color:"orange",marginLeft:"9%"}}>{totalVotes} Likes</span>
                            </div>

                        </div>

                        {/* <div className="recipe__count">${element.quantity}</div>
                        <span className="recipe__unit">${element.unit}</span> */}

                        <div className="recipe__ingredients">
                            <ul className="recipe__ingredient-list">
                            {recipe.ingredients.map((element, index) => {

                                return (
                                <li className="recipe__item" key={index}>
                                    <i className="fas fa-check" style={{color:"orange", marginRight:"5%", marginTop:"2%"}}></i>
                                    <div className="recipe__ingredient">{element}</div>
                                </li> )})}
                                </ul>

                        </div>

                        <div className="recipe__directions">
                            <h2 className="heading-2">How to cook it</h2>
                            <p className="recipe__directions-text">
                                {recipe.howToCook}
                                {/* This recipe was carefully designed and tested by
                                <span className="recipe__by">The Pioneer Woman</span>. Please check out directions at their website. */}
                            </p>

                        </div>
                    </div>
                    )
                })}
            </div>

            <div style={{margin:"15% 0%"}}>
                <ul style={{paddingLeft:"0"}}>
                    <h2 style={{textAlign:"center",color:"orange",fontWeight:"bold",marginBottom:"5%"}}>From <u>{showPublisherName}'s</u> Kitchen</h2>
                    {state.theSamePublisher.length !== 0 ? state.theSamePublisher.map((item,index)=>{
                        return (
                          <li key={index} style={{listStyleType:"none"}} className="recipeHover" onClick={()=>{changeHomeRecipe(item._id)}}>
                                <Link to={`/recipe/${item._id}`}  className="results__link results__link--active">
                                    <figure className="results__fig" id={item._id}>
                                        <img src={item.image_url} alt={item.title}/>
                                    </figure>
                                    <div className="results__data">
                                        <h4 className="results__name" id={item._id}>{item.title}</h4>
                                        <p className="results__author" id={item._id}>{item.publisher}</p>
                                    </div>
                                </Link>
                            </li>
                        )
                    }) : <p>There is no any other recipe exist!</p>}
                </ul>
                
            </div>
        </>
        
    )
}