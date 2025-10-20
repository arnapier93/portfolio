import React, { useState } from "react";
import "./ProjectCard.css";
import Modal from "./Modal";

function ProjectCard({ project, index }) {
  const { title, description, tags, screenshot, type, src } = project;
  const [selectedProject, setSelectedProject] = useState(null);

  const handleOpen = () => setSelectedProject(project);
  const handleClose = () => setSelectedProject(null);

  const isFlipped = index % 2 === 1; // flip every other card

  return (
    <>
      <div className={`project-card ${isFlipped ? "flipped" : ""}`}>
        <div className="project-content">
          <div className="project-title-and-tags">
            <h1 className="title">{title}</h1>
            <div className="tags-box">
              {tags?.map((tag, i) => (
                <div key={i} className="tag">{tag}</div>
              ))}
            </div>
          </div>

          <p className="text">{description}</p>

          <div className="buttons-box">
            <button onClick={handleOpen}>LAUNCH DEMO {'>'}</button>
            <button>PROVIDE FEEDBACK {'>'}</button>
          </div>
        </div>

        <img className="screenshots" src={screenshot} alt={`${title} Screenshot`} />
      </div>

      {selectedProject && (
        <Modal onClose={handleClose}>
          {type === "iframe" && (
            <iframe src={src} title={title} style={{ width: "100%", height: "100%", border: "none" }} />
          )}
          {type === "video" && (
            <video src={src} controls style={{ width: "100%", height: "100%" }} />
          )}
          {type === "images" && (
            <div className="image-gallery">
              {src.map((img, i) => (
                <img key={i} src={img} alt={`Slide ${i}`} />
              ))}
            </div>
          )}
        </Modal>
      )}
    </>
  );
}

export default ProjectCard;
