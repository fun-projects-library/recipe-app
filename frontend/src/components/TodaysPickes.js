import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom"
import RecipeService from "../services/recipe.service";
import Carousel from 'react-bootstrap/Carousel';
import "../styles/todaysPick.css"

export default function TodaysPickes() {
    const [state, setState] = useState([])
    const [todaysRecipes, setTodaysRecipes] = useState([])
    const [loading, setLoading] = useState("")
  

    useEffect(() => {
        retrieveAllRecipes()
    }, [])

    const retrieveAllRecipes =()=> {
       
        RecipeService.getAllRecipes()
          .then((response) => {
              //console.log(response.data)
            setState(response.data);
            setLoading("aaa")

          })
          .catch((e) => {
            console.log(e);
          });
    
    }
    useEffect(() => {
        if(state.length !== 0){
            setTodaysRecipes([state[7], state[12], state[22], state[28]])
        }
    }, [loading])

    const runRecipe = () => {

    }
    
    return (
        <div id="todaysPickDiv" style={{gridColumn:"2/4", padding:"3%", marginBottom:"3%"}}>
            <Carousel>
                {todaysRecipes.map((item,index)=>{
                    return (
                        
                        <Carousel.Item className="imgParent" key={index}>
                            <a href={`/recipe/${item._id}`} id={item._id} onClick={(e)=>{console.log(e.target.id)}}>
                            <img
                            className="d-block w-100 imgTodaysPick"
                            src={item.image_url}
                            alt="First slide"/>
                            </a>
                            <h3 className="imgTodaysPickTitle">{item.title}</h3>
                            {/* <Carousel.Caption>
                            <h3 className="imgTodaysPickTitle">First slide label</h3>
                            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                            </Carousel.Caption> */}
                        </Carousel.Item>
                        
                    )
                })}
            
            </Carousel>
            <div id="todaysPickList">
                <h3 style={{textAlign:"center", color:"rgb(245, 154, 131)", fontWeight:"bold"}}>Today's Recipes</h3>
                
                {todaysRecipes.map((item,index)=>{
                    return(
                        <li key={index}  style={{margin: "2rem 0"}}>
                                <Link to={`/recipe/${item._id}`} className="sideListList results__link--active recipeLinks">
                                    <figure className="sideListFig recipeHover" id={item._id} onClick={runRecipe}>
                                        <img src={item.image_url} alt={item.title}/>
                                    </figure>
                                    {/* <div className="results__data">
                                        <h4 className="results__name recipeHover" id={item._id} onClick={runRecipe}>{item.title}</h4>
                                        <p className="results__author recipeHover" id={item._id} onClick={runRecipe}>{item.publisher}</p>
                                    </div> */}
                                </Link>
                            </li>
                    )
                })}
            </div>
        </div>
    )
}
