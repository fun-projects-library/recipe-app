import React,{ useEffect, useState, useReducer} from 'react';
import {useParams} from 'react-router-dom';
import UserService from "../services/user.service";
import {Form, Button} from 'react-bootstrap';
import "../styles/userDetails.css";
import AdminUserRecipes from "./AdminUserRecipes"

let initialState={ roles:[], username: "", email: "", name: "", lastName: "", avatar: "" }
const reducer = (state, action) => {
    switch(action.type){
        case "fetchedUser" : return {...state, name: action.payload.name, username: action.payload.username, email: action.payload.email, lastName: action.payload.lastName, roles: action.payload.roles};
        case "name" : return {...state, name: action.payload};
        case "lastName" : return {...state, lastName: action.payload};
        case "email" : return {...state, email: action.payload};
        case "username" : return {...state, username: action.payload};
        case "roles" : return {...state, roles: [action.payload]};
        default: 
            return state;
    }
}

export default function UserDetails() {

    const [state, dispatch] = useReducer(reducer, initialState);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showHome, setShowHome] = useState(true);
    const [showRecipes, setShowRecipes] = useState(false);
    const {id} = useParams();
    
    useEffect(() => {
        findOneUser1()
    }, [])

    const findOneUser1 = () => {
        UserService.findOneUser(id)
        .then(res=>{
            console.log(res.data);
            dispatch({type: "fetchedUser", payload: {
                name: res.data.name ? res.data.name : "",
                lastName: res.data.lastName ? res.data.lastName : "",
                email: res.data.email,
                roles: res.data.roles,
                username: res.data.username,
            }})
            if(res.data.roles.includes("60e67eb1f5718a00ac8093aa")){
                setIsAdmin(true)
            }
        })
        .catch(err=>{console.log(err)})
    }

    const changeUserInfo = (e) => {
        if(e.target.id === "userRecipes") {
            setShowHome(false);
            setShowRecipes(true)
        } else if(e.target.id === "userInfo"){
            setShowHome(true);
            setShowRecipes(false)
        }
    }

    const handleChange = (e) => {
        console.log(e.target.name);
        dispatch({type: e.target.name, payload: e.target.value})
    }

    const updateUserFunc = (e) => {
        console.log(e)
        UserService.updateUser(id, state)
        .then(res=>{
            console.log(res.data);
            e.target.nextElementSibling.innerHTML = "<b>Succesfully Updated!</b>"
            setTimeout(() => {
                e.target.nextElementSibling.innerHTML = ""
            }, 2000);
        })
        .catch(err=>{console.log(err)})
    }

    const makeAdminFunc = (e) => {
        if(isAdmin){
            setIsAdmin(false);
            dispatch({type: "roles", payload: ["60e67eb1f5718a00ac8093a8"]})
            // e.target.style.backgroundColor = "rgb(48, 238, 23)"
        } else {
            setIsAdmin(true);
            dispatch({type: "roles", payload: ["60e67eb1f5718a00ac8093aa"]});
            // e.target.style.backgroundColor = "rgb(212, 100, 100)"
        }
        
    }
    return (
        <>
            <div>
                {/* <h2 style={{textAlign:"center",margin:"20% 6% 15% 6%"}}>Categories</h2> */}
                <ul style={{listStyleType:"none", margin:"50% 6% 30% 6%"}}>
                    <li className="categoryListItems" id="userInfo" onClick={changeUserInfo}>  
                        <i className="far fa-address-card userDetailIcons" id="userInfo" onClick={changeUserInfo}></i>
                        <span className="userListSpans" id="userInfo" onClick={changeUserInfo}>User Info</span>
                    </li>

                    <li className="categoryListItems" id="userRecipes" onClick={changeUserInfo}>
                        <i className="fas fa-hamburger userDetailIcons" id="userRecipes" onClick={changeUserInfo}></i>
                        <span className="userListSpans" id="userRecipes" onClick={changeUserInfo}>User's Recipes</span>
                    </li>

                    <li className="categoryListItems" id="Desserts" onClick={changeUserInfo}>
                    <i className="fas fa-cog userDetailIcons" onClick={changeUserInfo}></i>
                    <span className="userListSpans" id="Desserts" onClick={changeUserInfo}>Settings</span>
                    </li>

                    <li className="categoryListItems" id="Beef" onClick={changeUserInfo}>
                    <i className="far fa-envelope userDetailIcons" onClick={changeUserInfo}></i>
                    <span className="userListSpans" id="Beef" onClick={changeUserInfo}>Message User</span>
                    </li>
                </ul>
            </div>
            {showHome ? 
                <div id="userDetailsDiv" style={{ margin:"5%", gridColumn:"2/4"}}>
                <img
                    src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                    alt="profile-img"
                    className="profile-img-card" style={{display:"inline-block",textAlign:"center"}}/>
                    <h2 style={{display:"inline-block", marginLeft:"5%"}}>{state.name} {state.lastName}</h2>
                    <Form style={{display:"grid",gridTemplateColumns: "1.5fr 1.5fr"}}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label className="userDetailLabels">Name</Form.Label>
                            <Form.Control type="text" placeholder="Your name" className="userDetailInputs" onChange={handleChange} value={state.name} name="name"/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label className="userDetailLabels">Last Name</Form.Label>
                            <Form.Control type="text" placeholder="Last Name" className="userDetailInputs" value={state.lastName} onChange={handleChange} name="lastName"/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label className="userDetailLabels">Email</Form.Label>
                            <Form.Control type="email" placeholder="E-mail Address" className="userDetailInputs" value={state.email} onChange={handleChange} name="email"/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label className="userDetailLabels">Username</Form.Label>
                            <Form.Control type="text" placeholder="Username" className="userDetailInputs" value={state.username} onChange={handleChange} name="username"/>
                        </Form.Group>

                        <Form.Text className="text-muted" style={{gridColumn:"1/3", fontSize:"14px", marginTop:"5%", marginRight:"15%",textAlign:"center"}}>
                            Current Class:<b style={{fontSize:"18px"}}> {isAdmin ? "Admin" : "User" }</b> <br />
                            Would you like to change it to {!isAdmin ? "Admin" : "User" }?<br /><br />
                            {isAdmin ? 
                                <Button id="makeUserBtn" onClick={makeAdminFunc}>
                                    Unfortunately, just User !
                                </Button> :
                                <Button id="makeAdminBtn" onClick={makeAdminFunc}>
                                    Of Course, make Admin !
                                </Button>
                            }
                            

                            

                        </Form.Text>
                        <div style={{gridColumn:"1/3", textAlign:"center", marginTop:"5%"}}>
                            <Button style={{display:"inline-block"}} onClick={updateUserFunc}>
                                Update User Info
                            </Button>
                            <span  style={{color: 'green', marginLeft:"3%", fontSize:"14px"}}></span>
                            <Button style={{display:"inline-block", marginRight:"15%", marginLeft:"10%"}}>
                                Cancel Changes
                            </Button>
                        </div>
                        
                    </Form>
                </div> : "" }
                {showRecipes ? <AdminUserRecipes id={id} /> : ""}
            
            
        </>
    )
}
