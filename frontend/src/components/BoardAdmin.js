import React, {useEffect, useState} from 'react';
import Table from 'react-bootstrap/Table'
import UserService from "../services/user.service"
import "../styles/adminBoard.css"

export default function BoardAdmin() {

    const [state, setState] = useState([])

    useEffect(() => {
        getAllUsers()
    }, [])

    const getAllUsers = () => {
        UserService.getAllUsers()
        .then(res=>{
            console.log(res.data)
            setState(res.data.users)
        })
        .catch(err=>console.log(err))
    }

    return (
        <>
            <div style={{gridColumn:"1/3"}}>
            <h2 style={{textAlign:"center",margin:"5%"}}>You are the boss</h2>
            <table id="allUsersTable">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>User Name</th>
                        <th>Email</th>
                        <th>Roles</th>
                    </tr>
                </thead>
                <tbody>
                {state.map((user,index)=>{
                        return (
                            <tr key={index}>
                                <td>{index+1}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.roles.includes("60e67eb1f5718a00ac8093aa") ? "Admin" : "User"}</td>
                            </tr>
                        )
                    })}
                    
                </tbody>
            </table>
            </div>
        </>
    )
}
