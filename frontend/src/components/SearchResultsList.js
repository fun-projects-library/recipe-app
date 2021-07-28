import React, {useState, useEffect} from "react";
import AuthService from "../services/auth.service";
import RecipeService from "../services/recipe.service";

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import "../styles/searchResultsList.css";
import { Link } from "react-router-dom";


const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

export default function MediaCard(props) {
  const classes = useStyles();

  const [currentUser, setCurrentUser] = useState("");
  const [searchResultsArray, setSearchResults] = useState([]);


  useEffect(() => {
    const currentUserId = AuthService.getCurrentUser()
        if(currentUserId)setCurrentUser(currentUserId.id)
        setSearchResults(props.searchResults)
  }, [props.searchResults])

  const saveForLaterFunc = (e) => {
       if(currentUser){
         RecipeService.findOneRecipe(e.target.id)
        .then(res=>{
            //console.log(res.data);
            if(res.data.peopleWhoSaved.includes(currentUser)){
               
                let array = res.data.peopleWhoSaved

                const index = array.indexOf(currentUser);
                if (index > -1) {
                    array.splice(index, 1);
                }

                RecipeService.saveForLaterRecipe(e.target.id, {peopleWhoSaved: array})
                    .then(res=>{
                    console.log(res.data);
                    setSearchResults(searchResultsArray.filter(item=>{
                      
                      return item._id === e.target.id ? item.peopleWhoSaved = item.peopleWhoSaved.filter(peopleIDs=>{
                          return peopleIDs === currentUser ? "" : peopleIDs
                        }) : item
                      }))
                    //console.log(searchResultsArray)
                    })
                    .catch(err=>{console.log(err)})

            } else {
                RecipeService.saveForLaterRecipe(e.target.id, {peopleWhoSaved: [...res.data.peopleWhoSaved, currentUser]})
                    .then(res=>{
                    console.log(res.data);
                    setSearchResults(searchResultsArray.filter(item=>{
                      return item._id === e.target.id ? item.peopleWhoSaved = [...item.peopleWhoSaved, currentUser] : item
                    }))
                    })
                    .catch(err=>{console.log(err)})
            }
            
        })
        .catch(err=>{console.log(err)})
       }
    
  }
  return (
    <>
    {searchResultsArray.map((eachRecipe, index)=>{
      return(
        <Card className={classes.root} id="searchCard" key={index}>
        <Link to={`/recipe/${eachRecipe._id}`} style={{textDecoration:"none"}}>
        <CardActionArea id={eachRecipe._id}>
            <CardMedia
            className={classes.media}
            image={eachRecipe.image_url}
            title={eachRecipe.title}
            />
            <CardContent>
            <Typography gutterBottom variant="h5" component="h2" style={{fontSize:"22px", color:"black"}}>
                {/* {eachRecipe.title} */}
                {eachRecipe.title.length > 25 ? eachRecipe.title.substr(0, 23)+"..." : eachRecipe.title}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p" style={{fontSize:"14px"}}>
                {eachRecipe.howToCook.substr(0, 130)} ...
            </Typography>
            </CardContent>
        </CardActionArea>
        </Link>
        <CardActions style={{justifyContent:"space-between"}}>
            <Button size="large" color="primary" id={eachRecipe._id} onClick={saveForLaterFunc}>

                {eachRecipe.peopleWhoSaved.includes(currentUser) ?
                    <i className="fas fa-bookmark" id={eachRecipe._id} style={{fontSize:"18px"}}></i> :
                    <i className="far fa-bookmark" id={eachRecipe._id} style={{fontSize:"18px"}}></i>
                }
            </Button>
            {/* <Button size="small" color="primary">
            Learn More
            </Button> */}
            <p id="cardPublisherPara"style={{margin:"2%",fontSize:"12px",backgroundImage: "linear-gradient(to right bottom, #FBDB89, #F48982)",padding:"2% 4%",borderRadius:"1.8rem", color:"white",fontWeight:"bold"}}>By: {eachRecipe.publisher}</p>
        </CardActions>
    </Card>
      )
    })}
    
    </>
  );
}