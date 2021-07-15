import React, { useState, useEffect } from "react";
// import UserService from "../services/user.service";
import RecipeService from "../services/recipe.service";
import { BrowserRouter} from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";

import "./home.css"

//import Recipe from "../components/Recipe";
import {Link} from "react-router-dom";

const Home = (props) => {
  
  const [content, setContent] = useState([]);
  const [recipe, setRecipe] = useState([]);
  const [filterClicked, setFilterClicked] = useState(false);
  const [searchInput, setSearchInput] = useState("")

  // Pagination
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [count, setCount] = useState(0);
  const pageSizes = [3,5,8];

  const getRequestParams = (searchTitle, page, pageSize) => {
    let params = {};
    
    if (searchTitle) {
      params["title"] = searchTitle;
    }

    if (page) {
      params["page"] = page - 1;
    }

    if (pageSize) {
      params["size"] = pageSize;
    }

    return params;
  }
  const retrieveTutorials =()=> {
    const params = getRequestParams(searchInput, page, pageSize);
    RecipeService.getRecipe(params)
      .then((response) => {
        const { recipes, totalPages } = response.data;

        setContent(recipes);
        setCount(totalPages);

        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
       
  }
  const handlePageChange = (event, value) => {
   
      
        setPage(value)
    
  }
  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1);
  };
  useEffect(retrieveTutorials, [page, pageSize, searchInput]);



  // useEffect(() => {
  //   RecipeService.getRecipe().then(
  //     (response) => {
  //       if(response.data){
  //         setContent(response.data.recipes);
  //         setOriginalContent(response.data.recipes)
  //       }
        
  //       console.log(response.data)
  //     },
  //     (error) => {
  //       const _content =
  //         (error.response && error.response.data) ||
  //         error.message ||
  //         error.toString();

  //       setContent(_content);
  //     }
      
  //   );
  // }, []);

  const runRecipe = (e) => {
    console.log(e.target.id)
    setRecipe(content.filter(item=>item._id===e.target.id))
    
  }

  const clearFilterFunc = () => {
    //setContent(originalContent)
    setSearchInput("")
    setFilterClicked(false)
    retrieveTutorials()
  }

  // useEffect(() => {
  //   if(searchInputSent !== ""){
  //     const filteredArray = originalContent.filter(item=>{
  //       return item.title.toUpperCase().includes(searchInputSent.toUpperCase()) || item.ingredients.includes(searchInputSent) ? item : ""
  //     })
  //     setContent(filteredArray)
  //     setFilterClicked(true)
  //   }
    
  // }, [searchInputSent])

  const searchFunc = () => {
    setFilterClicked(true)
    //setSearchInput("")

    //setSearchInputSent(searchInput)
    //setSearchInput("");
    //onKeyUp={(e)=>{return e.key === "Enter" && e.target.value !== "" ? searchFunc() : ""}}
    //console.log(searchInput)
  }
  const handleChange = (e) => {
    setSearchInput(e.target.value)
    setFilterClicked(true)
    //console.log(searchInput)
  }
  
  return (
    <BrowserRouter>
        <div className="input-group" id="searchDiv">
          <div className="form-outline">
            <input type="search" id="form1" className="form-control" onChange={handleChange} placeholder="Search..." onKeyUp={(e)=>{return e.key === "Enter" && e.target.value !== "" ? searchFunc() : ""}} value={searchInput}/>
          </div>
          <button type="button" className="btn btn-primary" style={{height: "50px"}} onClick={searchFunc}>
            <i className="fas fa-search"></i>
          </button>
        </div>  

    <div className="result">
      {filterClicked ? <button onClick={clearFilterFunc} className="btn btn-primary" style={{margin: "2% auto"}}>Clear Filter</button> : ""}

          <div className="mt-3" style={{textAlign:"center", fontSize:"15px"}}>
            {"Items per Page: "}
            <select onChange={handlePageSizeChange} value={pageSize} style={{marginBottom:"3%"}}>
              {pageSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            <Pagination
              className="my-3"
              count={count}
              page={page}
              siblingCount={1}
              boundaryCount={1}
              variant="outlined"
              shape="rounded"
              color="primary"
              onChange={handlePageChange}
              style={{marginLeft:"2.5%"}}
            />
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
    </div>
    
    {/* <Switch>
      <Route exact path="/recipe/:id" component={Recipe} />
    </Switch> */}
    {recipe.map((data,index)=>{
      return (
        <div className="recipe-card" key={index}>
          <h2>{data.title}</h2>
          <img src={data.image_url} alt="recipes"/>
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