import React, { useState, useEffect } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
// import 'semantic-ui-css/semantic.min.css'
import "./App.css";

import AuthService from "./services/auth.service";
import logo from "./images/favicon.png";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import BoardUser from "./components/BoardUser";
import BoardModerator from "./components/BoardModerator";
import BoardAdmin from "./components/BoardAdmin";
// import Recipe from "./components/Recipe";

const App = () => {
  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [searchInput, setSearchInput] = useState("")
  const [searchInputSent, setSearchInputSent] = useState("");
  const [showSearchBar, setShowSearchBar] = useState(true)

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
    setShowSearchBar(false)
  };

  const searchFunc = () => {
    setSearchInputSent(searchInput)
    setSearchInput("")
    console.log(searchInput)
  }
  const handleChange = (e) => {
    setSearchInput(e.target.value)
    console.log(searchInput)
  }
  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <Link to={"/"} className="navbar-brand" onClick={()=>setShowSearchBar(true)}>
          <img src={logo} alt="recipe-app-logo" style={{width: "50px", marginLeft: "1.5%"}}/>
        </Link>
        <div className="navbar-nav mr-auto" style={{left:"100px"}}>
          <li className="nav-item">
            <Link to={"/home"} className="nav-link" onClick={()=>setShowSearchBar(true)}>
              Home
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

          {currentUser && (
            <li className="nav-item">
              <Link to={"/user"} className="nav-link" onClick={()=>setShowSearchBar(false)}>
                User
              </Link>
            </li>
          )}
        </div>

        {currentUser ? (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/profile"} className="nav-link" onClick={()=>setShowSearchBar(false)}>
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
              <Link to={"/login"} className="nav-link" onClick={()=>setShowSearchBar(false)}>
                Login / Sign Up
              </Link>
            </li>

            {/* <li className="nav-item">
              <Link to={"/register"} className="nav-link">
                Sign Up
              </Link>
            </li> */}
          </div>
        )}
      </nav>
      {showSearchBar ?
        <div className="input-group" id="searchDiv">
          <div className="form-outline">
            <input type="search" id="form1" className="form-control" onChange={handleChange} placeholder="Search..." onKeyUp={(e)=>{return e.key === "Enter" && e.target.value !== "" ? searchFunc() : ""}} value={searchInput}/>
          </div>
          <button type="button" className="btn btn-primary" style={{height: "35px"}} onClick={searchFunc}>
            <i className="fas fa-search"></i>
          </button>
        </div> : "" }
      

      <div className="container">
        <Switch>
          <Route exact path={["/", "/home"]}><Home searchInputSent={searchInputSent} setSearchInputSent={setSearchInputSent}/></Route>
          <Route exact path="/login" component={Login}></Route>
          <Route exact path="/register" component={Register} />
          <Route exact path="/profile" component={Profile} />
          {/* <Route path="/recipe/:id" component={Recipe} /> */}
          <Route path="/user" ><BoardUser currentUser={currentUser}/></Route>
          <Route path="/mod" component={BoardModerator} />
          <Route path="/admin" component={BoardAdmin} />
        </Switch>
      </div>
    </div>
  );
};

export default App;