import React, {useState, useEffect} from 'react';
import {Form, Button} from 'react-bootstrap';
import {useParams} from "react-router-dom";
import UserService from "../services/user.service"

export default function ShowUserProfile() {
    const [showHome, setShowHome] = useState(true);
    const [existence, setExistence] = useState("Anonymous");

    const [state, setstate] = useState({
        name: "Anonymous",
        lastName: "Anonymous",
        username: "Anonymous",
        email: "Anonymous",
        avatar: "//ssl.gstatic.com/accounts/ui/avatar_2x.png"
    });

    const {id} = useParams();

    useEffect(() => {
        UserService.getUserByUsername(id)
        .then(res=>{
            // console.log(res.data.length !== 0);
            if(res.data.length !== 0){
                setstate({
                    name: res.data[0].name ? res.data[0].name : "Anonymous",
                    lastName: res.data[0].lastName ? res.data[0].lastName : "Anonymous",
                    username: res.data[0].username ? res.data[0].username : "Anonymous",
                    email: res.data[0].email ? res.data[0].email : "Anonymous",
                    avatar: res.data[0].avatar ? res.data[0].avatar : "//ssl.gstatic.com/accounts/ui/avatar_2x.png"

                })
            } else{
                setExistence("This user doesn't exist anymore!")
            }
            
        })
        .catch(err=>{console.log(err)})
    }, [])


    return (
        <>
            <div>
                
            </div>
            {showHome ? 
                <div id="userDetailsDiv" style={{ margin:"3% 3% 25% 3%", gridColumn:"2/4"}}>
                    <div style={{display:"inline-block", position:"relative", padding:"2rem"}}>
                        <img
                            src={state.avatar}
                            alt="profile-img"
                            className="profile-img-card avatarImage"></img>
                            
                    </div>
                    <h2 style={{display:"inline-block", marginLeft:"5%"}}>{state.name === "Anonymous" ? existence : state.name + " " + state.lastName}</h2>
                    <Form style={{display:"grid",gridTemplateColumns: "1.5fr 1.5fr"}}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label className="userDetailLabels">Name</Form.Label>
                            <Form.Control type="text" placeholder="Your name" className="userDetailInputs" value={state.name} name="name" readOnly/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label className="userDetailLabels">Last Name</Form.Label>
                            <Form.Control type="text" placeholder="Last Name" className="userDetailInputs" value={state.lastName} name="lastName" readOnly/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label className="userDetailLabels">Email</Form.Label>
                            <Form.Control type="email" placeholder="E-mail Address" className="userDetailInputs" value={state.email}  name="email" readOnly/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label className="userDetailLabels">Username</Form.Label>
                            <Form.Control type="text" placeholder="Username" className="userDetailInputs" value={state.username}  name="username" readOnly/>
                        </Form.Group>

                        

                        
                        
                    </Form>
                </div> : "" }
                {/* {showRecipes ? <AdminUserRecipes id={id} username={state.username}/> : ""} */}
        </>
    )
}
