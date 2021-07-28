import React,{useEffect, useState, useRef} from 'react';
import RecipeService from "../services/recipe.service";
import AuthService from "../services/auth.service"
import { Link } from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import "../styles/categories.css";


const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});


export default function Categories() {
    const classes = useStyles();
    const [currentUser, setCurrentUser] = useState("");
    

    const [state, setstate] = useState([]);
    // const [savedRecipes, setSavedRecipes] = useState([]);
    const [savedClicked, setSavedClicked] = useState(true);

    const [showLimit, setShowLimit] = useState(9);
    const [showCategory, setShowCategory] = useState("");
    const [sortOption, setSortOption] = useState("votes");
    const [totalRecipes, setTotalRecipes] = useState(10);
    const [headerChange, setHeaderChange] = useState("All_Categories");

    const mostLikesRef = useRef()
    const lastAddedRef = useRef()
    const loadMoreRef = useRef()
        
    const mostLikesAll = () => {
        //const showCategoryTernary = 

        const query = {category: showCategory === "All_Categories" ? "" : showCategory, limit: showLimit, sortOption: sortOption}
    
        RecipeService.sortedList({query})
            .then(res=>{
            console.log(res.data);
            setTotalRecipes(res.data.totalRecipes)
            setstate(res.data.recipes)
            })
            .catch(err=>{
            console.log(err)
            })
    
    }
    useEffect(() => {
        const currentUserId = AuthService.getCurrentUser()
        if(currentUserId)setCurrentUser(currentUserId.id)

        mostLikesAll()
        
    }, [showCategory, sortOption, showLimit, savedClicked])

    const changeSortFunc = (e) => {
        if(e.target.id === "lastAddedButton"){
            setSortOption("createdAt")
            lastAddedRef.current.style.backgroundImage = "linear-gradient(to right bottom, #FBDB89, #F48982)";
            mostLikesRef.current.style.backgroundImage = "none"
        } else {
            setSortOption("votes")
            mostLikesRef.current.style.backgroundImage = "linear-gradient(to right bottom, #FBDB89, #F48982)";
            lastAddedRef.current.style.backgroundImage = "none"
        }
    }

    const changeSortCategory = (e) =>{
        console.log(e.target.id)
        setShowCategory(e.target.id)
        setHeaderChange(e.target.id)
        if(e.target.id !== "All_Categories"){
            setShowLimit("")
        } else {
            setShowLimit(9)
        }
        
    }

    const saveForLaterFunc = (e) => {
        if(currentUser){
            RecipeService.findOneRecipe(e.target.id)
        .then(res=>{
            console.log(res.data);
            if(res.data.peopleWhoSaved.includes(currentUser)){
               
                let array = res.data.peopleWhoSaved

                const index = array.indexOf(currentUser);
                if (index > -1) {
                    array.splice(index, 1);
                }

                RecipeService.saveForLaterRecipe(e.target.id, {peopleWhoSaved: array})
                    .then(res=>{
                    console.log(res.data);
                    setSavedClicked(!savedClicked)
                    })
                    .catch(err=>{console.log(err)})

            } else {
                RecipeService.saveForLaterRecipe(e.target.id, {peopleWhoSaved: [...res.data.peopleWhoSaved, currentUser]})
                    .then(res=>{
                    console.log(res.data);
                    setSavedClicked(!savedClicked)
                    })
                    .catch(err=>{console.log(err)})
            }
            
        })
        .catch(err=>{console.log(err)})
        }
        
    }

    
    return (
        <>
        
            <div>
                {/* <h2 style={{textAlign:"center",margin:"20% 6% 15% 6%"}}>Categories</h2> */}
                <ul style={{listStyleType:"none", margin:"50% 6% 10% 6%"}}>
                    <li className="categoryListItems" id="All_Categories" onClick={changeSortCategory}>
                        <img src="https://cdn.vox-cdn.com/thumbor/lATD3ZRF19XQ543sjLG31c8QuMo=/0x0:1116x788/1200x675/filters:focal(497x307:675x485)/cdn.vox-cdn.com/uploads/chorus_image/image/66629159/LamsSeafoodMarket.7.png" alt="vegPicture" className="categoryImages" id="All_Categories" onClick={changeSortCategory}/>
                        <span className="categoryListSpans" id="All_Categories" onClick={changeSortCategory}>All</span>
                    </li>

                    <li className="categoryListItems" id="Vegeterian" onClick={changeSortCategory}>
                    <img src="https://www.healthyeating.org/images/default-source/home-0.0/nutrition-topics-2.0/general-nutrition-wellness/2-2-2-2foodgroups_vegetables_detailfeature.jpg?sfvrsn=226f1bc7_6" alt="vegPicture" className="categoryImages" id="Vegeterian" onClick={changeSortCategory}/>
                    <span className="categoryListSpans" id="Vegeterian" onClick={changeSortCategory}>Vegeterian</span>
                    </li>

                    <li className="categoryListItems" id="Desserts" onClick={changeSortCategory}>
                    <img src="https://cleobuttera.com/wp-content/uploads/2018/03/lifted-baklava-720x720.jpg" alt="vegPicture" className="categoryImages" id="Desserts" onClick={changeSortCategory}/>
                    <span className="categoryListSpans" id="Desserts" onClick={changeSortCategory}>Desserts</span>
                    </li>

                    <li className="categoryListItems" id="Soup" onClick={changeSortCategory}>
                    <img src="https://i.ytimg.com/vi/LrKhcvZYFdQ/maxresdefault.jpg" alt="vegPicture" className="categoryImages" id="Soup" onClick={changeSortCategory}/>
                    <span className="categoryListSpans" id="Soup" onClick={changeSortCategory}>Soups</span>
                    </li>

                    <li className="categoryListItems" id="Beef" onClick={changeSortCategory}>
                    <img src="https://letthebakingbegin.com/wp-content/uploads/2019/07/Mongolian-Beef-with-Green-Onion-1-2-500x500.jpg" alt="vegPicture" className="categoryImages" id="Beef" onClick={changeSortCategory}/>
                    <span className="categoryListSpans" id="Beef" onClick={changeSortCategory}>Beef</span>
                    </li>

                    <li className="categoryListItems" id="Chicken" onClick={changeSortCategory}>
                    <img src="https://hips.hearstapps.com/hmg-prod/images/delish-190808-baked-drumsticks-0217-landscape-pf-1567089281.jpg" alt="vegPicture" className="categoryImages" id="Chicken" onClick={changeSortCategory}/>
                    <span className="categoryListSpans" id="Chicken" onClick={changeSortCategory}>Chicken</span>
                    </li>

                    <li className="categoryListItems" id="Seafood" onClick={changeSortCategory}>
                    <img src="https://food.fnr.sndimg.com/content/dam/images/food/fullset/2010/9/15/0/Healthy_Salmon-003_s4x3.jpg.rend.hgtvcom.441.331.suffix/1379610487273.jpeg" alt="vegPicture" className="categoryImages" id="Seafood" onClick={changeSortCategory}/>
                    <span className="categoryListSpans" id="Seafood" onClick={changeSortCategory}>Seafood</span>
                    </li>

                    <li className="categoryListItems" id="Salad" onClick={changeSortCategory}>
                    <img src="https://www.onceuponachef.com/images/2019/07/Big-Italian-Salad.jpg" alt="vegPicture" className="categoryImages" id="Salad" onClick={changeSortCategory}/>
                    <span className="categoryListSpans" id="Salad" onClick={changeSortCategory}>Salad</span>
                    </li>

                    <li className="categoryListItems" id="Pasta" onClick={changeSortCategory}>
                    <img src="https://www.indianhealthyrecipes.com/wp-content/uploads/2019/05/masala-pasta.jpg" alt="vegPicture" className="categoryImages" id="Pasta" onClick={changeSortCategory}/>
                    <span className="categoryListSpans" id="Pasta" onClick={changeSortCategory}>Pasta</span>
                    </li>

                    <li className="categoryListItems" id="Kebab" onClick={changeSortCategory}>
                    <img src="https://www.chilitochoc.com/wp-content/uploads/2020/02/adana-kebab-3-scaled-e1619694817903.jpg" alt="vegPicture" className="categoryImages" id="Kebab" onClick={changeSortCategory}/>
                    <span className="categoryListSpans" id="Kebab" onClick={changeSortCategory}>Kebabs</span>
                    </li>
                </ul>
            </div>
            
            

            <div id="allCategoriesDiv">
                <div style={{textAlign: "center", margin:"3%"}}>
                    <button className="btn" id="mostLikesButton" ref={mostLikesRef} onClick={changeSortFunc}>Most Likes</button>
                    <button className="btn" id="lastAddedButton" ref={lastAddedRef} onClick={changeSortFunc}>Last Added</button>
                </div>
                <h2 style={{margin:"2% 0", fontSize:"22px", fontWeight:"bold"}}>{headerChange} ({totalRecipes})</h2>
                {state.map((item,index)=>{
                return (
                    <Card className={classes.root} style={{margin: "0 2% 3% 0",width:"27rem", display:"inline-block"}} key={index}>
                    <Link to={`/recipe/${item._id}`} style={{textDecoration:"none"}}>
                    <CardActionArea id={item._id}>
                        <CardMedia
                        className={classes.media}
                        image={item.image_url}
                        title={item.title}
                        />
                        <CardContent  style={{padding:"1rem"}}>
                        <Typography gutterBottom variant="h5" component="h2" style={{fontSize:"22px", color:"black"}}>
                            {item.title.length > 18 ? item.title.substr(0, 19)+"..." : item.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p" style={{fontSize:"14px"}}>
                            {item.howToCook.substr(0, 65)} ...
                        </Typography>
                        </CardContent>
                    </CardActionArea>
                    </Link>
                    <CardActions style={{justifyContent:"space-between", padding:"0.5rem"}}>
                        <Button size="large" color="primary" id={item._id} onClick={saveForLaterFunc}>
                            {item.peopleWhoSaved.includes(currentUser) ?
                                <i className="fas fa-bookmark" id={item._id} style={{fontSize:"18px"}}></i> :
                                <i className="far fa-bookmark" id={item._id} style={{fontSize:"18px"}}></i>
                            }
                            
                            
                        </Button>
                        {/* <Button size="small" color="primary">
                        Learn More
                        </Button> */}
                        <p id="cardPublisherPara"style={{margin:"2%",fontSize:"12px",backgroundImage: "linear-gradient(to right bottom, #FBDB89, #F48982)",padding:"2% 4%",borderRadius:"1.8rem", color:"white",fontWeight:"bold"}}> {item.votes} Likes</p>
                    </CardActions>
                </Card>
                )
                })}
                {headerChange === "All_Categories" ?
                    <div style={{textAlign: "center", margin:"3%"}}>
                        <button className="btn" id="loadMoreButton" ref={loadMoreRef} onClick={()=>{setShowLimit(showLimit + 5)}}>Load More</button>
                    </div> : ""
                }
                
            </div>
            
        </>
    )
}
