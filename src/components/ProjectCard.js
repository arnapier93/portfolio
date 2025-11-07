import React, { useState } from "react";
import "./ProjectCard.css";
import Modal from "./Modal";
import FeedbackToast from "./FeedbackToast";

function ProjectCard({ project, index }) {
  const { title, description, tags, screenshot, type, src } = project;
  const [selectedProject, setSelectedProject] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleOpenProject = () => setSelectedProject(project);
  const handleCloseProject = () => setSelectedProject(null);
 
  const handleOpenFeedback = () => setShowFeedback(true)
  const handleCloseFeedback = () => setShowFeedback(false)


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
            <button className="green-btn"
              onClick={handleOpenProject}>LAUNCH DEMO {'>'}
              </button>
            <button className="green-btn" 
              onClick={handleOpenFeedback}>PROVIDE FEEDBACK {'>'}
            </button>
          </div>
        </div>

        <img className="screenshots" src={screenshot} alt={`${title} Screenshot`} />
      </div>

      {selectedProject && (
        <Modal onClose={handleCloseProject}>
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
      {showFeedback && <FeedbackToast onClose={handleCloseFeedback} />}
    </>
  );
}

export default ProjectCard;