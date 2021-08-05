import React, { useState, useEffect } from "react";
// import UserService from "../services/user.service";
import RecipeService from "../services/recipe.service";
import SearchResultsList from "./SearchResultsList";
import TodaysPickes from "./TodaysPickes";
import Footer from "./Footer";
import MostLikedOnes from "./MostLikedOnes";
import Pagination from "@material-ui/lab/Pagination";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

import "../styles/home.css"
import "../styles/mostLikedOnes.css"

//import Recipe from "../components/Recipe";
import {Link} from "react-router-dom";

const Home = (props) => {

  const [content, setContent] = useState([]);
  const [recipe, setRecipe] = useState([]);
  //const [filterClicked, setFilterClicked] = useState(false);
  const [searchInput, setSearchInput] = useState("")
  const [showOneRecipe, setShowOneRecipe] = useState(false);
  const [votedRecipe, setVotedRecipe] = useState(false)
  const [votersArray, setVotersArray] = useState([])
  const [totalVotes, setTotalVotes] = useState(0);
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [showTodaysPickes, setShowTodaysPickes] = useState(true)
  const [searchResults, setSearchREsults] = useState([])

  const [aaa, setAAA] = useState("")


  // Pagination
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [count, setCount] = useState(0);
  //const pageSizes = [3,5,8];
  //const categories = ["All","Vegeterian", "Lasagna", "Pizza", "Desserts", "Chicken", "Soup", "Beef", "Salad", "Kebab", "Breakfast"]
  //const [filterCategory, setFilterCategory] = useState("");

  const getRequestParams = (page, pageSize) => {
    let params = {};

    // if (searchTitle) {
    //   params["title"] = searchTitle;
    // }

    if (page) {
      params["page"] = page - 1;
    }

    if (pageSize) {
      params["size"] = pageSize;
    }

    return params;
  }
  const retrieveTutorials =()=> {
    const params = getRequestParams(page, pageSize);
    RecipeService.getRecipe(params)
      .then((response) => {
        const { recipes, totalPages } = response.data;
        
        function compare(a, b) {
          const bandA = a.updatedAt;
          const bandB = b.updatedAt;
        
          let comparison = 0;
          if (bandA > bandB) {
            comparison = -1;
          } else if (bandA < bandB) {
            comparison = 1;
          }
          return comparison;
        }
        
        recipes.sort(compare);
        
        setContent(recipes);
        setCount(totalPages);

        //console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });

  }
  const handlePageChange = (event, value) => {


        setPage(value)

  }
  // const handlePageSizeChange = (event) => {
  //   setPageSize(event.target.value);
  //   setPage(1);
  // };

  // const handleCategoryChange = (e) => {
  //   setFilterCategory(e.target.value)
  //   if(e.target.value !== "All"){
  //     setSearchInput(e.target.value)
  //   } else {
  //     setSearchInput("")
  //   }
  // }

  useEffect(retrieveTutorials, [page, pageSize]);


  const runRecipe = (e) => {
    //console.log(e.target.id)
    setShowSearchResults(false);
    setRecipe(content.filter(item=>item._id===e.target.id)[0])
    setShowOneRecipe(true);
    setShowTodaysPickes(false)
    if(content.filter(item=>item._id===e.target.id)[0].voters){
      console.log("recipe")
      setVotersArray(content.filter(item=>item._id===e.target.id)[0].voters);

      if(props.currentUser){
        if(content.filter(item=>item._id===e.target.id)[0].voters.includes(props.currentUser.id)){
          setVotedRecipe(true)
          console.log("ttttt")
        } else {
          setVotedRecipe(false)
        }
      } else {
        setVotedRecipe(false)
      }


    } else {
      setVotedRecipe(false)
    }

    if(content.filter(item=>item._id===e.target.id)[0].votes){
      setTotalVotes(content.filter(item=>item._id===e.target.id)[0].votes)
    } else {
      setTotalVotes(0)
    }




    //console.log(recipe)
  }

  // const clearFilterFunc = () => {
  //   //setContent(originalContent)
  //   setFilterCategory("All")
  //   setSearchInput("")
  //   setFilterClicked(false)
  //   retrieveTutorials()
  // }


  const searchFunc = () => {
    //setFilterClicked(true)
    //setSearchInput("")

    //setSearchInputSent(searchInput)
    //setSearchInput("");
    //onKeyUp={(e)=>{return e.key === "Enter" && e.target.value !== "" ? searchFunc() : ""}}
    //console.log(searchInput)
  }
  const handleChange = (e) => {

    const query = {title: e.target.value, category: e.target.value, publisher: e.target.value}
    

    if(e.target.value===""){
      setShowSearchResults(false);
      

    } else {
      RecipeService.searchRecipe({query})
      .then(res=>{
        // console.log(res.data.recipes);
        setSearchREsults(res.data.recipes);
        setShowSearchResults(true)
      })
      .catch(err=>{
        console.log(err)
      })
    }

    
    setShowOneRecipe(false);
    setShowTodaysPickes(false)
    setSearchInput(e.target.value)
    
    
    //setFilterClicked(true)
    //console.log(e.target.value)
  }

  const handleVoteChange = (e)=>{
    //console.log(e.target.checked)
    setVotedRecipe(!votedRecipe)
    //console.log(e.target.id)

    if(e.target.checked){
      setTotalVotes(totalVotes+1);
      setVotersArray([...votersArray, props.currentUser.id])
      //setRecipe({...recipe, votes: totalVotes+1})
      setContent(content.filter(item=>{
        return item._id === e.target.id ? item.votes = totalVotes +1 : item
      }))
      setContent(content.filter(item=>{
        return item._id === e.target.id ? item.voters = [...item.voters, props.currentUser.id] : item
      }))
      console.log(content)
      setAAA("bbb")
    } else {
      setTotalVotes(totalVotes-1)
      setVotersArray(votersArray.filter(item=>{
        return item === props.currentUser.id ? "" : item
      }))
      setContent(content.filter(item=>{
        return item._id === e.target.id ? item.votes = totalVotes -1 : item
      }))
      setContent(content.filter(item=>{
        return item._id === e.target.id ? item.voters = item.voters.filter(element=>{
          return element === props.currentUser.id ? "" : element
        }) : item
      }))
      console.log(content)
      setAAA("ccc")
    }
    //console.log(e.target.checked)
    //console.log(votersArray)
    //updateRecipeVote(e.target.id)

  }

  const updateRecipeVote = () => {
    
    if(recipe._id){
      setAAA("")
      RecipeService.voteRecipe(recipe._id, {voters: votersArray, votes: totalVotes})
        .then(res=>console.log(res.data))
        .catch(err=>console.log(err))
    }
    
    //console.log(recipe)
  }

  useEffect(() => {
    if(aaa !== ""){
      updateRecipeVote();
    }
    
    //retrieveTutorials()

  }, [aaa])
  //console.log(props.currentUser)
  return (
    <>
        <div className="input-group" id="searchDiv">
          <div className="form-outline">
            <input type="search" id="form1" className="form-control" onChange={handleChange} placeholder="Titles, Categories, Publishers..." onKeyUp={(e)=>{return e.key === "Enter" && e.target.value !== "" ? searchFunc() : ""}} value={searchInput}/>
          </div>
          <button type="button" className="btn btn-primary" style={{height: "50px"}} onClick={searchFunc}>
            <i className="fas fa-search"></i>
          </button>
        </div>

    <div className="result" >
      {/* {filterClicked ? <button onClick={clearFilterFunc} className="btn btn-primary" style={{margin: "2% auto"}}>Clear Filter</button> : ""} */}

      <div className="mt-3" style={{textAlign:"center", fontSize:"20px", color:"#F59A83", fontWeight:"bold"}}>
            {"ALL RECIPES "}
            {/* <select onChange={handleCategoryChange} value={filterCategory} style={{marginBottom:"3%", padding:"1%"}}>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select> */}


          </div>

      <ul className="results__list">
        {content.map((data, index)=>{
               return <li key={index} className={
                "list-group-item " +
                (index === currentIndex ? "active" : "")
              } >
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

      <div className="mt-3" style={{textAlign:"center", fontSize:"15px"}}>
            {/* {"Items per Page: "}
            <select onChange={handlePageSizeChange} value={pageSize} style={{marginBottom:"3%"}}>
              {pageSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select> */}

            <Pagination
              className="my-3"
              count={count}
              page={page}
              siblingCount={0}
              boundaryCount={1}
              // variant="outlined"
              // shape="rounded"
              color="primary"
              onChange={handlePageChange}
              style={{marginLeft:"3%", fontSize:"12px"}}
            />
          </div>

    </div>
    
    {/* {showSearchResults ? <div id="searchResultsListDiv">
        {searchResults.map((item,index)=><SearchResultsList key={index} eachRecipe={item}/>)}
      </div> : ""} */}
      {showSearchResults ? <div id="searchResultsListDiv">
        <SearchResultsList searchResults={searchResults}/>
      </div> : ""}

    {showOneRecipe ?
    <div className="recipe" style={{gridColumn:"2/4", padding:"3%", marginBottom:"3%"}}>
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
                control={<Checkbox checked={votedRecipe} icon={<FavoriteBorder />} checkedIcon={<Favorite />} onClick={handleVoteChange} disabled={props.currentUser ? false : true}  name="voteRecipe" id={recipe._id}/>}
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
    </div> : ""}
    {showTodaysPickes ? <TodaysPickes /> : ""}

    <div id="mostLikedOnesDiv">
      <h2 style={{marginBottom: "3%"}}><Link to="/categories" style={{color:"orange", fontWeight:"bold", fontSize:"22px"}}>The Most Liked Ones of All</Link></h2>
      <MostLikedOnes />
    </div>

    <Footer />
    


    </>
  );
};

export default Home;