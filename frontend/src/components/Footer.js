import React from 'react';
import "../styles/footer.css";
import favicon from "../images/favicon.png";
import { Link } from "react-router-dom"

export default function Footer() {
    return (
        <>
            <div className="footerTransition">
                <h2 style={{textAlign:"center", padding:"50px"}}>Thank you for being with us <i className="fas fa-sun"></i></h2>
            </div>

            <div id="footerParentDiv">
                <div>

                </div>
                <div id="footerDiv">
                    <h3 id="footerHeader"><u>My Kitchen Help</u><img id="footerImage" src={favicon} alt="faviconImage"/></h3>
                    <div>

                    </div>
                    <ul id="footerUL" style={{listStyleType:"none",textAlign:"center"}}>
                        <Link to="/showAllCooks" className="footerLinks">
                            <li className="footerListItems">
                                All of Our Cooks
                            </li>
                        </Link>
                        <Link to="/advertise" className="footerLinks">
                            <li className="footerListItems">
                            Advertise Your Company
                            </li>
                        </Link>
                        <Link to="/aboutUs" className="footerLinks">
                            <li className="footerListItems">
                            About
                            </li>
                        </Link>
                        <Link to="/contactUs" className="footerLinks">
                            <li className="footerListItems">
                                Contact Us
                            </li>
                        </Link>
                        
                    </ul>
                    
                </div>
                <div id="footerSignUpDiv">
                    <h4 style={{margin:"48% auto 10% auto", fontSize:"18px"}}>Aren't you a member yet?</h4>
                    <Link to="/register" style={{textDecoration:"none"}}><button className="btn footerSignButton">Sign Up</button></Link>
                    
                    <p style={{fontSize:"12px"}}>Connect to the world of best cooks!</p>
                </div>
            </div>
        </>
    )
}
