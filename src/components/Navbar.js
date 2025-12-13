import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { ReactComponent as LinkedInIcon } from '../assets/linkedin.svg';
import { ReactComponent as UpworkIcon } from '../assets/upwork.svg';
import { ReactComponent as EmailIcon } from '../assets/email.svg';
import { ReactComponent as GithubIcon } from '../assets/github.svg';
import FeedbackToast from "./FeedbackToast";

const Navbar = () => {
  const [scrollPos, setScrollPos] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleOpenFeedback = () => setShowFeedback(true)
  const handleCloseFeedback = () => setShowFeedback(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrollPos(currentScroll);

      if (currentScroll > 93) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (

<>
      <div style={{height: isFixed ? "110px" : "0px"}}/>
      <div className={`navbar ${isFixed ? "navbar-fixed" : ""}`}>
        <div className="jumplinks">
          {["About Me", "Projects", "Testimonials"].map(
            (item, index) => (
              <a key={index} 
              className="navbar-text"
              href={"#" + item.replace(/\s+/g, "")}
              >{item}</a>
            )
          )}
        </div>
      <div className="contact-icons">
          <a className="icon" href="https://www.linkedin.com/in/andrew-napier-bb086530b">{<LinkedInIcon/>}</a>
          <a className="icon" href="https://github.com/arnapier93">{<GithubIcon/>}</a>
          <a className="icon" href="https://www.upwork.com/freelancers/~010c2e9d619e865a54?mp_source=share">{<UpworkIcon/>}</a>
          <a className="icon" onClick={handleOpenFeedback}>{<EmailIcon/>}</a>
        </div>
      </div>
      {showFeedback && <FeedbackToast onClose={handleCloseFeedback} />}
    </>
  );
};

export default Navbar;
