import React, {useEffect, useState} from 'react';
import { Link } from "react-router-dom";
import UserService from "../services/user.service";
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import "../styles/adminBoard.css";

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(1),
  },
}));



export default function BoardAdmin() {

    const [state, setState] = useState([]);

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
    const removeUser = (e) => {
        UserService.removeUser(e.target.id)
        .then(res=>{
            console.log(res.data)
            setState(state.filter(item=>{
                return item._id === e.target.id ? "" : item
            }))
        })
        .catch(err=>{console.log(err)})
    }

    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <>
            <div style={{gridColumn:"1/4"}}>
            <h2 style={{textAlign:"center",margin:"5%"}}>User's List</h2>
            <table id="allUsersTable">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Avatar</th>
                        <th>User Name</th>
                        <th>Email</th>
                        <th>Roles</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                {state.map((user,index)=>{
                        return (
                            <tr key={index}>
                                <td style={{textAlign:"center"}}>{index+1}</td>
                                <td style={{textAlign:"center",padding:"0",width:"70px"}}><img src={user.avatar} alt="avatarPicture" className="avatarImages"/></td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.roles.includes("60e67eb1f5718a00ac8093aa") ? "Admin" : "User"}</td>
                                <td>
                                    
                                    <Typography
                                        aria-owns={open ? 'mouse-over-popover' : undefined}
                                        aria-haspopup="true"
                                        onMouseEnter={handlePopoverOpen}
                                        onMouseLeave={handlePopoverClose}
                                        style={{display: "inline-block", margin:"10% 25% 10% 10%"}}
                                    >
                                        <Link to={`/userDetails/${user._id}`}><i className="fas fa-eye viewUserButton" id={user._id}></i></Link>
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
                                        <Typography>View User Details</Typography>
                                    </Popover>
                                    {user.roles.includes("60e67eb1f5718a00ac8093aa") ? "" : <i className="fas fa-trash-alt deleteUserButton" id={user._id} onClick={removeUser}></i>}
                                    
                                    {/* <Typography
                                        aria-owns={open ? 'mouse-over-popover' : undefined}
                                        aria-haspopup="true"
                                        onMouseEnter={handlePopoverOpen}
                                        onMouseLeave={handlePopoverClose}
                                        style={{display: "inline-block"}}
                                    >
                                        
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
                                        <Typography>Remove User</Typography>
                                    </Popover> */}
                                    
                                </td>
                            </tr>
                        )
                    })}
                    
                </tbody>
            </table>
            </div>
        </>
    )
}
