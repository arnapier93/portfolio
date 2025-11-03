import React from "react";
import "./TestimonialCard.css";

import firasHeadshot from "../assets/firas_khatib.webp";
import addyHeadshot from "../assets/addy.webp"
import codeWizLogo from "../assets/code-wiz-logo.png"

const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. 
  Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. 
  Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, 
  sunt in culpa qui officia deserunt mollit anim id est laborum.`

const TestimonialCard = ({ index }) => {

  const contents = [
    {
      blurb: `I was lucky enough to have Andrew in 3 of my classes last year. He wrote a 
      thoroughly researched term paper on Targeted Advertising & Digital Marketing for my
      Social and Ethical Aspects of Computing course and created a very original Unity game
      for my Computer Game Design course. Our year-long capstone senior design course is
      where I really got to see Andrew flourish though, as every other team had 3-4 students
      in the class to work on their project. Andrew tackled his capstone project on his own,
      with only a couple graduate students collaborating with him outside of class. In my
      course, however, Andrew was the only one producing all the required documentation for
      the client and he thrived with this individual responsibility. I wish I had more
      dedicated students like him!`,
      name: "Firas Khatib, PhD",
      details: ["Associate Professor", "Department of Computer and Information Science", "University of Massachustts Dartmouth"],
      photo: firasHeadshot
    },
    {
      blurb: `I had the pleasure to work with Andrew on the Dowd Solar Pump Project. He managed the team with good 
        communication and kept everyone on track. He was always respectful and helpful when working between the 
        engineering team and with the customer. When issues did come up Andrew stayed calm and focued on finding a 
        solution for the team. I would be glad to collaborate with him again.`,
      name: "Aditya Sahu",
      details: ["Software Development Engineer", "Amazon Web Services"],
      photo: addyHeadshot
    },
    {
      blurb: loremIpsum,
      name: "Serena ",
      details: ["Center Director", "CodeWiz"],
      photo: codeWizLogo
    }
  ];

  return (
    <div className="testimonial-card">
      <p className="text blurb" style={{display: "flex", flexGrow: "1", alignItems: "center"}}>
          {contents[index].blurb}</p>
      <div style={{ display: "flex", border: "2px dashed blue" }}>
        <img className="photo" src={contents[index].photo} alt="testifier" />
        <div className="name-and-details">
          <h1 className="title" style={{ fontSize: "24px", color: "#000000" }}>
            {contents[index].name}
          </h1>
          <p className="text">
            {contents[index].details[0]}
          </p>
          <p className="text"s>
            {contents[index].details[1]}
          </p>
          <p className="text">
            {contents[index].details[2]}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
