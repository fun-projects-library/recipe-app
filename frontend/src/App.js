import React, { useState, useEffect } from "react";
import { Switch, Route, Link, BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
// import 'semantic-ui-css/semantic.min.css'
import "./styles/App.css";
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import AuthService from "./services/auth.service";
import logo from "./images/favicon.png";
import Login from "./components/Login";
import Categories from "./components/Categories";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import BoardUser from "./components/BoardUser";
import BoardModerator from "./components/BoardModerator";
import BoardAdmin from "./components/BoardAdmin";
import Recipe from "./components/Recipe";
import UserDetails from './components/UserDetails';
import ShowUserProfile from "./components/ShowUserProfile"

const App = () => {
  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);
  

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    
    if (user) {
      setCurrentUser(user);
      setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
      
    }
  }, []);

  const logOut = () => {
    AuthService.logout();
    
  };

  
  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand navbar-dark bg-dark" style={{justifyContent:"space-between"}}>
        
        <div className="navbar-nav mr-auto" style={{left:"100px"}}>
        <Link to={"/"} className="navbar-brand" onClick={()=>{setTimeout(() => {
          window.location.reload();}, 100);}}>
          <img src={logo} alt="recipe-app-logo" style={{width: "50px", marginLeft: "1.5%"}}/>
        </Link>
          <li className="nav-item">
            <Link to={"/home"} className="nav-link" onClick={()=>{setTimeout(() => {
          window.location.reload();}, 100);}}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/categories"} className="nav-link">
              Categories
            </Link>
          </li>

          {showModeratorBoard && (
            <li className="nav-item">
              <Link to={"/mod"} className="nav-link">
                Moderator Board
              </Link>
            </li>
          )}

          {showAdminBoard && (
            <li className="nav-item">
              <Link to={"/admin"} className="nav-link">
                Admin Board
              </Link>
            </li>
          )}

          {/* {currentUser && (
            <li className="nav-item">
              <Link to={"/user"} className="nav-link" >
                My Account
              </Link>
            </li>
          )} */}
        </div>

        {currentUser ? (
          <div className="navbar-nav ml-auto" style={{marginRight:"2%"}}>
           
            <Dropdown className="dropdownButton">
               <Dropdown.Toggle variant="success" id="dropdown-basic">
                 {currentUser.username}
              </Dropdown.Toggle>
            <Dropdown.Menu style={{borderRadius:"1rem", backgroundImage: "linear-gradient(to right bottom, #FBDB89, #F48982)",width:"153px", textAlign:"center"}}>
              <Dropdown.Item href="/profile" className="nav-item">Profile</Dropdown.Item>
              <Dropdown.Item href="/user" className="nav-item">My Account</Dropdown.Item>
              <Dropdown.Item  href="/home" onClick={logOut} className="nav-item">Log Out</Dropdown.Item>
           </Dropdown.Menu>
            </Dropdown>
          </div>
        ) : (
          <div className="navbar-nav ml-auto" style={{marginRight:"2%"}}>
             <Button className="nav-item" style={{padding:"0.5rem 2rem"}}><Link to={"/login"} className="nav-link" >
                Login / Sign Up
              </Link></Button>{' '}
           

            {/* <li className="nav-item">
              <Link to={"/register"} className="nav-link">
                Sign Up
              </Link>
            </li> */}
          </div>
        )}
        {/* {currentUser ? (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/profile"} className="nav-link">
                {currentUser.username}
              </Link>
            </li>
            <li className="nav-item">
              <a href="/home" className="nav-link" onClick={logOut}>
                LogOut
              </a>
            </li>
          </div>
        ) : (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/login"} className="nav-link">
                Login / Sign Up
              </Link>
            </li>

            <li className="nav-item">
              <Link to={"/register"} className="nav-link">
                Sign Up
              </Link>
            </li>
          </div>
        )} */}
      </nav>      

      <div className="container">
        <Switch>
          <Route exact path={["/", "/home"]}><Home currentUser={currentUser}/></Route>
          <Route exact path="/login" component={Login}></Route>
          <Route exact path="/categories" component={Categories}></Route>
          <Route exact path="/register" component={Register} />
          <Route exact path="/recipe/:id" ><Recipe currentUser={currentUser}/></Route>
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/user" ><BoardUser/></Route>
          <Route exact path="/user/:id" ><ShowUserProfile/></Route>
          <Route exact path="/mod" component={BoardModerator} />
          <Route exact path="/admin" component={BoardAdmin} />
          <Route exact path="/userDetails/:id" ><UserDetails /></Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default App;