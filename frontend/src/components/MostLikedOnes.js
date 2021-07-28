import React, {useEffect, useState} from 'react';
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
import RecipeService from "../services/recipe.service";
import AuthService from "../services/auth.service";


const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});



export default function MediaCard() {
  const classes = useStyles();
  const [state, setstate] = useState([]);
  const [showLimit, setShowLimit] = useState(6);
  const [showCategory, setShowCategory] = useState("");
  const [currentUser, setCurrentUser] = useState("");
    
  const mostLikesAll = () => {
    const query = {category: showCategory, limit: showLimit, sortOption: "votes"}
  
    RecipeService.sortedList({query})
        .then(res=>{
          console.log(res.data);
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
    
  }, []);

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
                    setstate(state.filter(item=>{
                      
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
                    setstate(state.filter(item=>{
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
    {state.map((item,index)=>{
      return (
        <Card className={classes.root} style={{margin: "0 5% 3% 0",width:"30rem", display:"inline-block"}} key={index}>
          <Link to={`/recipe/${item._id}`} style={{textDecoration:"none"}}>
          <CardActionArea id={item._id}>
              <CardMedia
              className={classes.media}
              image={item.image_url}
              title={item.title}
              />
              <CardContent  style={{padding:"1rem"}}>
              <Typography gutterBottom variant="h5" component="h2" style={{fontSize:"22px", color:"black"}}>
                {item.title.length > 22 ? item.title.substr(0, 23)+"..." : item.title}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p" style={{fontSize:"14px"}}>
                  {item.howToCook.substr(0, 70)} ...
              </Typography>
              </CardContent>
          </CardActionArea>
          </Link>
          <CardActions style={{justifyContent:"space-between", padding:"0.5rem"}}>
              <Button size="large" color="primary" id={item._id} onClick={saveForLaterFunc}>
                  {/* <i className="far fa-bookmark" style={{fontSize:"18px"}}></i> */}
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
    
    </>
  );
}