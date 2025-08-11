import React from "react";
import "./TestimonialCard.css";
import photo from "../assets/claymation_me.png";

const TestimonialCard = ({ index }) => {

  const contents = [
    {
      blurb: "Master Bruce puts the st in juice... JUSTICE",
      name: "Alfred Pennyworth",
      details: ["Wayne Manor", "Joke Department", "Head Writer"],
      photo: photo
    },
    {
      blurb: "Batman is my inspiration, he's why I do what I do",
      name: "Barbara Gordon",
      details: ["Gotham City Police", "Detectives Unit", "Detective"],
      photo: photo
    },
    {
      blurb: "What does Batman do when the bat signal goes up and he's like... on the toilet or something?",
      name: "Rob Schrab",
      details: ["Starburns Industries", "Cool Guy Department", "Cool Guy"],
      photo: photo
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
