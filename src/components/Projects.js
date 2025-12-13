import React, {useState} from "react";
import "./Projects.css"
import ProjectCard from "./ProjectCard.js"
import { ProjectList } from "./ProjectList.js"

const Projects = () => {
  
  return (
    <div className="projects">
        <div className="title-box">
            <h1 className="title">Projects</h1>
            <p className="text">Games, apps and more</p>
        </div>
        <div className="project-list">
          {ProjectList.map((project, index) => (
            <ProjectCard
              key={index}
              project={project}
              index={index}
            />
          ))}
        </div>
    </div>
  );
}

export default Projects;
