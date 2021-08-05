import React, {useState, useRef} from 'react';
import "../styles/advertise.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { API_BASE } from "../services/constants";
import axios from 'axios';

export default function Advertise() {
    const [state, setstate] = useState({
        fullName: "",
        email: "",
        companyName: "",
        companySector: "",
        applicantPosition: "",
        budget: "",
        responded: false,
        notes: ""
    })

    const fullNameRef = useRef();
    const emailRef = useRef()
    const companyNameRef = useRef()
    const companySectorRef = useRef();
    const applicantPositionRef = useRef()
    const budgetRef = useRef()

    const createAd = (e) => {
        
        if(state.fullName === ""){
            fullNameRef.current.style.display = "inline-block"
        } else if (state.email === "") {
            emailRef.current.style.display = "inline-block"
        } else if (state.companyName === "") {
            companyNameRef.current.style.display = "inline-block"
        } else if (state.companySector === "") {
            companySectorRef.current.style.display = "inline-block"
        } else if (state.applicantPosition === "") {
            applicantPositionRef.current.style.display = "inline-block"
        } else if (state.budget === "") {
            budgetRef.current.style.display = "inline-block"
        } else {
            axios.post(API_BASE + "ads", state)
            .then(res=>{
                console.log(res.data);
                setstate({
                    fullName: "",
                    email: "",
                    companyName: "",
                    companySector: "",
                    applicantPosition: "",
                    budget: "",
                });
                e.target.nextElementSibling.innerHTML = "<b>Your Form has sent!</b>"
                setTimeout(() => {
                    e.target.nextElementSibling.innerHTML = ""
                }, 2000);
                fullNameRef.current.style.display = "none";
                emailRef.current.style.display = "none";
                companyNameRef.current.style.display = "none";
                companySectorRef.current.style.display = "none";
                applicantPositionRef.current.style.display = "none";
                budgetRef.current.style.display = "none";

            })
            .catch(err=>console.log(err))
        }
    
        
    }

    const handleChange = (e) => {
        //console.log(e.target.name)
        setstate({...state, [e.target.name] : e.target.value})
    }

    return (
        <>
            <h2 style={{gridColumn:"1/4", textAlign:"center", margin:"5% 0 2% 0", color:"orange", fontWeight:"bold"}}>Advertise Your Company with Us</h2>
            <div>

            </div>
            <div style={{margin:"0 auto", fontSize:"18px"}}>
            <Form >

                <Form.Group className="mb-3" controlId="formBasicPassword" style={{marginTop:"2rem", width:"45rem"}}>
                    <Form.Label style={{margin:"0.75rem 0"}}>Full Name</Form.Label>
                    <Form.Control type="text" name="fullName" placeholder="Full Name" style={{display:"inline-block", width:"35rem", fontSize:"12px"}} onChange={handleChange} value={state.fullName}/>
                    <div ref={fullNameRef} className="requireDiv">
                        <i className="fas fa-chevron-left arrowLeft"></i><span className="requiresAds">*required</span>
                    </div>
                    
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail" style={{marginTop:"2rem", width:"45rem"}}>
                    <Form.Label style={{margin:"0.75rem 0"}}>Email address</Form.Label>
                    <Form.Control type="email" name="email" placeholder="Enter your business-email address" style={{display:"inline-block", width:"35rem", fontSize:"12px"}} onChange={handleChange} value={state.email}/>
                    <div ref={emailRef} className="requireDiv">
                        <i className="fas fa-chevron-left arrowLeft"></i><span className="requiresAds">*required</span>
                    </div>
                    <Form.Text className="text-muted" style={{display:"block",width:"35rem", fontSize:"12px"}}>
                    We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword" style={{marginTop:"2rem", width:"45rem"}}>
                    <Form.Label style={{margin:"0.75rem 0"}}>Company Name</Form.Label>
                    <Form.Control type="text" name="companyName" placeholder="Company Name" style={{display:"inline-block", width:"35rem", fontSize:"12px"}} onChange={handleChange} value={state.companyName}/>
                    <div ref={companyNameRef} className="requireDiv">
                        <i className="fas fa-chevron-left arrowLeft"></i><span className="requiresAds">*required</span>
                    </div>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword" style={{marginTop:"2rem", width:"45rem"}}>
                    <Form.Label style={{margin:"0.75rem 0"}}>Company Business Sector</Form.Label>
                    <Form.Control type="text" name="companySector" placeholder="( Food, Transportation, IT, Education ... )" style={{display:"inline-block", width:"35rem", fontSize:"12px"}} onChange={handleChange} value={state.companySector}/>
                    <div ref={companySectorRef} className="requireDiv">
                        <i className="fas fa-chevron-left arrowLeft"></i><span className="requiresAds">*required</span>
                    </div>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword" style={{marginTop:"2rem", width:"45rem"}}>
                    <Form.Label style={{margin:"0.75rem 0"}}>Your position at the company</Form.Label>
                    <Form.Control type="text" name="applicantPosition" placeholder="Position" style={{display:"inline-block", width:"35rem", fontSize:"12px"}} onChange={handleChange} value={state.applicantPosition}/>
                    <div ref={applicantPositionRef} className="requireDiv">
                        <i className="fas fa-chevron-left arrowLeft"></i><span className="requiresAds">*required</span>
                    </div>
                    
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword" style={{marginTop:"2rem", width:"45rem"}}>
                    <Form.Label style={{margin:"0.75rem 0"}}>Estimated Budget for Ads</Form.Label>
                    <Form.Control type="number" name="budget" placeholder="Thousand dollars..." style={{display:"inline-block", width:"35rem", fontSize:"12px"}} onChange={handleChange} value={state.budget}/>
                    <div ref={budgetRef} className="requireDiv">
                        <i className="fas fa-chevron-left arrowLeft"></i><span className="requiresAds">*required</span>
                    </div>
                    
                </Form.Group>

                <Button variant="primary" type="button" onClick={createAd} style={{margin:"2rem auto",display:"inline-flex"}}>
                    Submit
                </Button>
                <span  style={{color: 'green', marginLeft:"3%", fontSize:"14px"}}></span>
            </Form>
            </div>
        </>

    )
}
