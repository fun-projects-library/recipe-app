import React,{ useEffect, useState} from 'react';
import UserService from "../services/user.service";
import "../styles/showAllUsers.css";
import { Link } from "react-router-dom"

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';


const useStyles1 = makeStyles({
    root: {
      maxWidth: 155,
    },
    media: {
      height: 170,
    },
  });

  const useStyles = makeStyles((theme) => ({
    popover: {
      pointerEvents: 'none',
    },
    paper: {
      padding: theme.spacing(1),
    },
  }));

export default function ShowAllUsers() {
    const classes1 = useStyles1();
    const [state, setstate] = useState([]);

    useEffect(() => {
        UserService.getAllUsers()
        .then(res=>{
            console.log(res.data);
            setstate(res.data.users)
        })
        .catch(err=>console.log(err))
    }, []);

    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    return (
        <>
            <h2 id="showAllUsersHead">All of Our Cooks</h2>
            
            <div id="showAllUsersDiv">
                
            {state.map((item,index)=>{
                return (
                    <Card className={classes1.root} style={{margin: "2% 3%",width:"27rem",display:"inline-block",borderTopLeftRadius:"3rem",borderTopRightRadius:"3rem"}} key={index}>
                    <Link to={`/user/${item.username}`} style={{textDecoration:"none"}}>
                    <CardActionArea id={item._id}>
                        <CardMedia
                        className={classes1.media}
                        image={item.avatar}
                        title={item.name}
                        style={{borderRadius:"3rem"}}
                        />
                            
                            <Typography
                                        aria-owns={open ? 'mouse-over-popover' : undefined}
                                        aria-haspopup="true"
                                        onMouseEnter={handlePopoverOpen}
                                        onMouseLeave={handlePopoverClose}
                                        style={{position: "absolute",
                                            top: "5px",
                                            right: "5px",
                                            color: "rgb(235, 235, 39)",
                                            fontSize:"20px"}}
                                    >
                                      {item.roles.includes("60e67eb1f5718a00ac8093aa") ? <i className="fas fa-star adminStar"></i> : "" }
                                    </Typography>
                                    <Popover
                                        id="mouse-over-popover"
                                        className={classes.popover}
                                        classes={{
                                        paper: classes.paper,
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
                                        <Typography>Admin</Typography>
                                    </Popover>
                        
                        <CardContent  style={{padding:"1rem"}}>
                        <Typography gutterBottom variant="h5" component="h2" style={{fontSize:"22px", color:"black"}}>
                            {item.name ? item.name : <p style={{fontSize:"12px"}}>( Name is Not Stated! )</p>}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p" style={{fontSize:"14px"}}>
                            {item.username}
                        </Typography>
                        </CardContent>
                    </CardActionArea>
                    </Link>
                    <CardActions style={{padding:"1rem 1rem 0 0",justifyContent:"flex-end"}}>
                        {/* <Button size="large" color="primary" id={item._id} onClick={saveForLaterFunc}>
                            {item.peopleWhoSaved.includes(currentUser) ?
                                <i className="fas fa-bookmark" id={item._id} style={{fontSize:"18px"}}></i> :
                                <i className="far fa-bookmark" id={item._id} style={{fontSize:"18px"}}></i>
                            }
                            
                            
                        </Button> */}
                        {/* <Button size="small" color="primary">
                        Learn More
                        </Button> */}
                        <p style={{fontSize:"10px",fontWeight:"bold", fontStyle:"italic"}}>Since: {item.createdAt.substr(0, 10)}</p>
                    </CardActions>
                </Card>
                )
                })}
            </div>
            
        </>
    )
}
