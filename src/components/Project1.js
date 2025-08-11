import React from "react";
import "./Projects.css"

const projectText = "I'll be back tomorrow, ill be back in the ballroom swinging i'll be back to tomorrow ill be back at a quarter to 11"
const Project1 = () => {
  return (
    <div className="project-card">
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
                <button>LAUNCH DEMO {'>'}</button>
                <button>PROVIDE FEEDBACK {'>'}</button>
            </div>
        </div>
        <div className="screenshots">{}</div>
    </div>
 );
}

export default Project1;
