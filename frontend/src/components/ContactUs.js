import React,{useState, useRef} from 'react';
import emailjs from 'emailjs-com';
import "../styles/contactUs.css";



export default function ContactUs() {
    const [state, setstate] = useState({
      name: "",
      email: "",
      message: "",
      subject: ""
  })
  const [showThanks, setShowThanks] = useState(false)

  const fullNameRef = useRef();
  const emailRef = useRef()
  const messageRef = useRef();
  const subjectRef = useRef()

  function sendEmail(e) {
    e.preventDefault();

    if(state.name === ""){
      fullNameRef.current.style.display = "inline-block"
    } else if(state.email === "") {
      emailRef.current.style.display = "inline-block"
    } else if(state.subject === "") {
      subjectRef.current.style.display = "inline-block"
    } else if(state.message === "") {
      messageRef.current.style.display = "inline-block"
    }  else {
        emailjs.sendForm('service_uiu24td', 'template_1j3gpa9', e.target, 'user_hEz72EpvhKPEcUJKqgOv3')
        .then((result) => {
            console.log(result.text);
            setstate({
              name: "",
              email: "",
              message: "",
              subject: ""
          });
          setShowThanks(true)
        }, (error) => {
            console.log(error.text);
        });
    }

    
  }

  const handleChange = (e) => {
    setstate({...state, [e.target.name]: e.target.value});
    console.log(state)
  }

  return (
      <>
          <div>

          </div>
          {showThanks ? 
            <form className="contact-form" onSubmit={sendEmail}>
              <input type="hidden" name="contact_number" className="contactInputs" onChange={handleChange} placeholder="????"/>

              <label className="contactLabels">Name</label>
              <input type="text" name="name" className="contactInputs" onChange={handleChange} placeholder="Enter your full name..." />
              <div ref={fullNameRef} className="requireDiv">
                  <i className="fas fa-chevron-left arrowLeft" style={{top:"3px"}}></i><span className="requiresAds">*required</span>
              </div>

              <label className="contactLabels">Email</label>
              <input type="email" name="email" className="contactInputs" onChange={handleChange} placeholder="Your e-mail addresse..." />
              <div ref={emailRef} className="requireDiv">
                  <i className="fas fa-chevron-left arrowLeft" style={{top:"3px"}}></i><span className="requiresAds">*required</span>
              </div>

              <label className="contactLabels">Subject</label>
              <input type="text" name="subject" className="contactInputs" onChange={handleChange} placeholder="Topic..." />
              <div ref={subjectRef} className="requireDiv">
                  <i className="fas fa-chevron-left arrowLeft" style={{top:"3px"}}></i><span className="requiresAds">*required</span>
              </div>
              
              <label className="contactLabels">Message</label>
              <textarea name="message" className="contactInputs" rows="7" placeholder="Enter your message..." onChange={handleChange}/>
              <div ref={messageRef} className="requireDiv">
                  <i className="fas fa-chevron-left arrowLeft" style={{top:"3px"}}></i><span className="requiresAds">*required</span>
              </div>
              

              <input type="submit" value="Submit" className="btn contactButton"/>
          </form>
          :
          <div id="thanksDiv">
            <h2 style={{color:"green", fontWeight:"bold",marginBottom:"5%", fontSize:"30px"}}>You have submitted succesfully...</h2>
            <h3 style={{fontSize:"26px", marginBottom:"3%"}}>Thank you for your message!</h3>
            <p style={{fontSize:"16px"}}>
              Your opinion is always important for us.<br />
              Give us 1-3 business day to reach you back.
            </p>
          </div>
        }
          
        
      </>
    
  );
}