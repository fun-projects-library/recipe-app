import React, { useState, useEffect } from "react";
// import UserService from "../services/user.service";
import RecipeService from "../services/recipe.service";
import { BrowserRouter} from "react-router-dom";
// import Recipe from "./Recipe";
import "./home.css"

//import Recipe from "../components/Recipe";
import {Link} from "react-router-dom";

const Home = (props) => {
  const [originalContent, setOriginalContent] = useState([]);
  const [content, setContent] = useState([]);
  const [recipe, setRecipe] = useState([]);
  const [filterClicked, setFilterClicked] = useState(false);

  useEffect(() => {
    RecipeService.getRecipe().then(
      (response) => {
        // if(props.searchInputSent){
        //   setContent(response.data.filter(item=>{
        //     console.log(response.data)
        //     return item.title === props.searchInputSent || item.ingredients.includes(props.searchInputSent) ? item : ""
        //   }));
        // } else {
        //   setContent(response.data);
        //   console.log(response.data)
        // }
        setContent(response.data);
        setOriginalContent(response.data)
        console.log(response.data)
      },
      (error) => {
        const _content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();

        setContent(_content);
      }
      
    );
  }, []);

  const runRecipe = (e) => {
    console.log(e.target.id)
    setRecipe(content.filter(item=>item._id===e.target.id))
    
  }

  const clearFilterFunc = () => {
    setContent(originalContent)
    props.setSearchInputSent("")
    setFilterClicked(false)
  }

  useEffect(() => {
    if(props.searchInputSent !== ""){
      const filteredArray = originalContent.filter(item=>{
        return item.title.toUpperCase().includes(props.searchInputSent.toUpperCase()) || item.ingredients.includes(props.searchInputSent) ? item : ""
      })
      setContent(filteredArray)
      setFilterClicked(true)
    }
    
    // console.log(content)
    // console.log(props.searchInputSent)
    // const filteredArray = content.filter(item=>{
    //   //console.log(item.title.toUpperCase())
    //   return item.title.toUpperCase() === props.searchInputSent ? item : ""
    // })
    // console.log(filteredArray)
    
  }, [props.searchInputSent])
  
  return (
    <BrowserRouter>  
    <div className="result" style={{overflow: "auto", height: "100rem"}}>
      {filterClicked ? <button onClick={clearFilterFunc} className="btn btn-primary" style={{margin: "2% auto"}}>Clear Filter</button> : ""}
      <ul className="results__list">
        {content.map((data, index)=>{
               return <li key={index} >
                    <Link to="#" className="results__link results__link--active recipeLinks">
                        <figure className="results__fig recipeHover" id={data._id} onClick={runRecipe}>
                            <img src={data.image_url} alt={data.title}/>
                        </figure>
                        <div className="results__data">
                            <h4 className="results__name recipeHover" id={data._id} onClick={runRecipe}>{data.title}</h4>
                            <p className="results__author recipeHover" id={data._id} onClick={runRecipe}>{data.publisher}</p>
                        </div>
                    </Link>
                </li>
        })}
      </ul>
    </div>
    
    {/* <Switch>
      <Route exact path="/recipe/:id" component={Recipe} />
    </Switch> */}
    {recipe.map((data,index)=>{
      return (
        <div className="recipe-card" key={index}>
          <h2>{data.title}</h2>
          <img src={data.image_url} alt="recipes" style={{width: "400px", height: "400px"}}/>
          <p>{data.howToCook}</p>
          <ul><u>Ingredients:</u>
            <li>{data.ingredients.join(", ")}</li>
          </ul>
          <footer>Publisher: <b>{data.publisher}</b></footer>
        </div>
      )
    })}
    
    </BrowserRouter>
  );
};

export default Home;