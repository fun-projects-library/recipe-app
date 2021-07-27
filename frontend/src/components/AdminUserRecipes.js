import React,{ useEffect, useState} from 'react';
import UserService from "../services/user.service";

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';
import { Link } from "react-router-dom";

const useStyles = makeStyles({
    root: {
      maxWidth: 345,
    },
    media: {
      height: 140,
    },
    
  });

  const useStylespop = makeStyles((theme) => ({
    popover: {
      pointerEvents: 'none',
    },
    paper: {
      padding: theme.spacing(1),
    },
  }));
  

export default function AdminUserRecipes(props) {
    const classes = useStyles();
    const classespop = useStylespop();
    const [state, setstate] = useState([])
    useEffect(() => {
        getMyRecipes()
    }, [])

    const getMyRecipes = () => {
        UserService.getUserRecipes(props.id)
        .then(res=>{setstate(res.data[0].myRecipes)})
        .catch(err=>{console.log(err)})
    }

    const removeRecipe = (e) => {
        UserService.removeRecipe(e.target.id)
        .then(res=>{
            console.log(res.data);
            setstate(state.filter(item=>{
                return e.target.id === item._id ? "" : item
            }))
            setAnchorEl(null);
        })
        .catch(err=>{console.log(err)})
    }

    const [anchorEl, setAnchorEl] = useState(null);
    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    return (
        <div style={{gridColumn:"2/4", margin:"5%", textAlign:"center"}}>
            <h2 style={{margin:"5%"}}>'{props.username}'s Recipes</h2>
            {state.length !== 0 ? state.map((item,index)=>{
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
                        
                            {/* <i className="far fa-bookmark" style={{fontSize:"18px"}}></i> */}
                            <Typography
                                        aria-owns={open ? 'mouse-over-popover' : undefined}
                                        aria-haspopup="true"
                                        onMouseEnter={handlePopoverOpen}
                                        onMouseLeave={handlePopoverClose}
                                        style={{display: "inline-block", margin:"10% 25% 10% 10%"}}
                                    >
                                        <Button size="large" color="primary" id={item._id} onClick={removeRecipe}>
                                            <i className="far fa-trash-alt viewUserButton" id={item._id} onClick={removeRecipe}></i>
                                        </Button>
                                    </Typography>
                                    <Popover
                                        id="mouse-over-popover"
                                        className={classespop.popover}
                                        classes={{
                                        paper: classespop.paper,
                                        }}
                                        open={open}
                                        anchorEl={anchorEl}
                                        anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                        }}
                                        transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                        }}
                                        onClose={handlePopoverClose}
                                        disableRestoreFocus
                                    >
                                        <Typography style={{textAlign:"center"}}>Remove Recipe from Database</Typography>
                                    </Popover>
                        
                        {/* <Button size="small" color="primary">
                        Learn More
                        </Button> */}
                        <p id="cardPublisherPara"style={{margin:"2%",fontSize:"12px",backgroundImage: "linear-gradient(to right bottom, #FBDB89, #F48982)",padding:"2% 4%",borderRadius:"1.8rem", color:"white",fontWeight:"bold"}}> {item.votes} Likes</p>
                    </CardActions>
                </Card>
                )
            }) : <p style={{fontSize:"16px", margin:"10%"}}>'{props.username}' doesn't have any published recipe, yet...</p>}
        </div>
    )
}
