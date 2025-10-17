import React, {useState} from "react";
import "./Projects.css"
import ProjectCard from "./ProjectCard.js"

import tileGameScreenshot from "../assets/tile-game-screenshot.png";
import toastTesterScreenshot from "../assets/toast-tester-screenshot.png"

const projectList = [
  {
    title: "N-Puzzle",
    description: `The N-Puzzle is a fun take on an old classic, the 8-puzzle.
      You can choose your board size anywhere from a 3-puzzle to a 99-puzzle! 
      You can undo, restart, or shuffle for a new board. All boards are 
      guaranteed solvable.`,
    tags: ["JavaScript REACT", "HTML", "CSS"],
    screenshot: tileGameScreenshot,
    type: "iframe",
    src: process.env.PUBLIC_URL +  "/projects/tile-game/index.html",
  },
  { 
    title: "Toast Tester", 
    description: `Taste the toast! A toast simulator that is almost as 
      exciting as making real toast! Realistic gradient toasting, functional
      smoke alarm, and relaxing background music are just SOME of the features 
      you can expect. Toast so good you can almost taste it, Toast Tester! (TM) --
      This was a group project for a Computer Graphics class I took at UMass 
      Dartmouth, despite it's tongue-in-cheek style it earned a perfect score 
      and high reviews from the Professor who had us present the project to a 
      touring group of local high schoolers`,
    tags: ["JavaScript", "Three.js"],
    screenshot: toastTesterScreenshot, 
    type: "iframe", 
    src: "/projects/Toast-Tester/index.html" 
  
  }

];

const Projects = () => {
  
  return (
    <div className="projects">
        <div className="title-box">
            <h1 className="title">Projects</h1>
            <p className="text">Games, apps and more</p>
        </div>
        <div className="project-list">
          {projectList.map((project, index) => (
            <ProjectCard
              key={index}
              project={project}
            />
          ))}
        </div>
    </div>
  );
}

export default Projects;
