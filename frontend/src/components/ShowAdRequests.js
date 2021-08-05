import React, {useEffect, useState} from 'react';
import { API_BASE } from "../services/constants";
import axios from "axios";
import { Link } from "react-router-dom"

export default function ShowAdRequests() {
    const [state, setstate] = useState([]);
    const [showInfo, setShowInfo] = useState([])
    useEffect(() => {
        getAdRequests()
    }, [])

    const getAdRequests = () => {
        axios.get(API_BASE + "ads")
        .then(res=>{
            //console.log(res.data);
            setstate(res.data)
        })
        .catch(err=>console.log(err))
    }

    const showAdInfo = (e) => {
        
        axios.get(API_BASE + "ads/" + e.target.id)
        .then(res=>{
            //console.log(res.data);
            setShowInfo([res.data])
        })
        .catch(err=>console.log(err))
    }

    const deleteAd = (e) => {
        
        axios.delete(API_BASE + "ads/" + e.target.name)
        .then(res=>{
            console.log(res.data);
            setstate(state.filter(item=>{
                return item._id === e.target.name ? "" : item
            }))
            setShowInfo([])   
        })
        .catch(err=>console.log(err))
    }

    const makeRespondedFunc = (e) => {
        const clickedAd = state.filter(item=>{
            return item._id === e.target.name ? item : ""
        })
        console.log(state)
        axios.put(API_BASE + "ads/" + e.target.name, {responded: !clickedAd[0].responded})
        .then(res=>{
            
            setstate(state.map(item=>{
                return item._id === e.target.name ? {...item, responded: !item.responded} : item
            }))
            console.log(res.data);
           
            setShowInfo([res.data])
            //{...item, responded: !clickedAd[0].responded}  
        })
        .catch(err=>console.log(err))
    }

    return (
        <>
            <div>
                <h2 style={{textAlign:"center", marginTop:"10%", color:"orange", fontWeight:"bold"}}>Ad Requests</h2>
                <div id="adRequestsDiv">
                    {state.map((item, index) => {
                        return (
                            <div className="adRequestsItems" id={item._id} onClick={showAdInfo} key={index}>
                                <p id={item._id} style={{fontSize:"16px"}}><b>{item.companyName}</b><br />({item.companySector})</p>
                                <div style={{display:"inline-flex", justifyContent:"space-between"}}>
                                    <p style={{marginBottom:"0"}}>{item.responded ? <span className="responded" id={item._id}>Responded</span> : <span className="notResponded" id={item._id}>Not Responded</span>}</p>
                                    <p id={item._id} style={{fontSize:"12px"}}>Budget: ${item.budget}k</p>
                                </div>
                                
                            </div>
                        )
                    })}
                </div>
            </div>
                
            <div>
                {showInfo.map((item,index)=>{
                    return (
                        <div id="showInfoDiv" key={index}>
                            <p style={{textAlign:"end"}}>{item.responded ? <span style={{color:"green",fontSize:"18px", margin:"5%"}}><u>RESPONDED</u></span> : <span style={{color:"red",fontSize:"18px"}}><u>NOT RESPONDED</u></span>}</p>
                            <h2 style={{fontSize:"28px",marginTop:"10%"}}>{item.companyName}</h2>
                            <br />
                            <p style={{fontSize:"16px"}}>Business Sector: {item.companySector}</p>
                            <p style={{fontSize:"16px"}}>Planned budget: ${item.budget}k</p>
                            <div style={{display:"grid", gridTemplateColumns:"1fr 4fr"}}>
                                <p style={{gridColumn:"1/3",fontSize:"16px"}}><u>Contact Person:</u></p>
                                <p style={{gridColumn:"2/3",fontSize:"14px"}}>Name: {item.fullName}</p>
                                <p style={{gridColumn:"2/3",fontSize:"14px"}}>Position: {item.applicantPosition}</p>
                                <p style={{gridColumn:"2/3",fontSize:"14px"}}>Email: {item.email}</p>
                            </div>
                            <textarea className="form-control" rows="7" /*maxLength="700"*/ placeholder=" Notes ..." style={{fontSize:"14px"}}/>
                            <div className="adButtonsDiv">
                                <button className="btn" id="deleteAdRequest" name={item._id} onClick={deleteAd}>Delete Request</button>
                                {/* <Link to="/sendEmail"><button className="btn" id="sendEmail">Send e-mail</button></Link> */}
                                <button className="btn" id={!item.responded ? "makeResponded" : "makeNotResponded"} name={item._id} onClick={makeRespondedFunc}>{!item.responded ? "Make Responded" : "Make Not Responded"}</button>
                            </div>
                        </div>
                    )
                })}
            </div>

        </>
    )
}
