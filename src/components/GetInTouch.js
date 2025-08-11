import React, { useState, useEffect } from "react";
import "./GetInTouch.css"

const GetInTouch = () => {
  const [emailInputValue, setEmailInputValue] = useState("");
  const [messageInputValue, setMessageInputValue] = useState("");
  
  return (
    <div className="get-in-touch">
        <div className="title-box">
            <h1 className="title">Get In Touch</h1>
            <p className="text">Let me know what you think
              <br/>I look forward to hearing from you
            </p>
        </div>
        <div className="contact-card">
          <div className="email-field">
            <p className="text">E-mail:</p>
            <input 
              type="text"
              className="email-input"
              value={emailInputValue}
              onChange={(e) => setEmailInputValue(e.target.value)}
              placeholder="Please enter your e-mail"/>
          </div>
          <input 
            type="text"
            className="message-input"
            value={emailInputValue}
            onChange={(e) => setEmailInputValue(e.target.value)}
            placeholder="Please enter your message"/>
        </div>
    </div>
  );
};

export default GetInTouch;
