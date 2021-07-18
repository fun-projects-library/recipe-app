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
    //console.log(props.eachRecipe.howToCook.substr(0, 50))
  return (

    <Card className={classes.root} id="searchCard">
        <Link to={`/recipe/${props.eachRecipe._id}`} style={{textDecoration:"none"}}>
        <CardActionArea id={props.eachRecipe._id}>
            <CardMedia
            className={classes.media}
            image={props.eachRecipe.image_url}
            title={props.eachRecipe.title}
            />
            <CardContent>
            <Typography gutterBottom variant="h5" component="h2" style={{fontSize:"22px", color:"black"}}>
                {props.eachRecipe.title}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p" style={{fontSize:"14px"}}>
                {props.eachRecipe.howToCook.substr(0, 130)} ...
            </Typography>
            </CardContent>
        </CardActionArea>
        </Link>
        <CardActions style={{justifyContent:"space-between"}}>
            <Button size="large" color="primary">
                <i className="far fa-bookmark" style={{fontSize:"18px"}}></i>
            </Button>
            {/* <Button size="small" color="primary">
            Learn More
            </Button> */}
            <p id="cardPublisherPara"style={{margin:"2%",fontSize:"12px",backgroundColor:"#F59A83",padding:"2% 4%",borderRadius:"1.8rem", color:"white",fontWeight:"bold"}}>By: {props.eachRecipe.publisher}</p>
        </CardActions>
        {/* <Switch >
            
                <Route exact path="/recipe/:id" component={Recipe}></Route>
            
        </Switch> */}
    </Card>
    
  );
}