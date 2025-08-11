import React from "react";
import "./Projects.css"
import Project1 from "./Project1"
import SliderPuzzleModal from "./SliderPuzzleModal";

const projectText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

const Projects = () => {
  return (
    <div className="projects">
        <div className="title-box">
            <h1 className="title">Projects</h1>
            <p className="text">Games, apps and more</p>
        </div>
        <Project1/>
        <div className="project-card">
            <div className="screenshots">{}</div>
            <div style={{display: "flex", flexDirection: "column", height: "425px", justifyContent: "space-between"}}>
                <div style= {{ display: "flex", justifyContent: "space-between", width: "800px"}}>
                    <h1 className="title" style={{color: "#000000"}}>Project</h1>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <p className="text" style={{margin: "0px"}}>Made with:</p>
                        <div className="tags-box">
                            <div className="tag">Python</div>
                            <div className="tag">JavaScript</div>
                        </div>
                    </div>
                </div>
                <p className="text" style={{ width: "800px", height: "225px"}}>{projectText}</p>
                <div className="buttons-box">
                    <SliderPuzzleModal/>
                    <button>PROVIDE FEEDBACK {'>'}</button>
                </div>
            </div>
        </div>


    </div>
  );
}

export default Projects;
