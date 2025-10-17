import React, { useState } from "react";
import "./ProjectCard.css";
import Modal from "./Modal";

function ProjectCard({ project }) {
  const { title, description, tags, screenshot, type, src } = project;
  const [selectedProject, setSelectedProject] = useState(null);

  const handleOpen = () => setSelectedProject(project);
  const handleClose = () => setSelectedProject(null);

  return (
    <>
      <div className="project-card">
        <div className="project-content">
          <div className="project-title-and-tags">
            <h1 className="title" style={{ color: "#000000" }}>
              {title}
            </h1>

            <div style={{ display: "flex", flexDirection: "column", gap: "2px", border: "4px dashed yellow" }}>
              <p className="text" style={{ alignItems: "center", marginBottom: "0px" }}>
                Made with:
              </p>
              <div className="tags-box">
                {tags?.map((tag, i) => (
                  <div key={i} className="tag">
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="text" style={{ width: "800px", height: "225px", border: "2px solid orange" }}>
            {description}
          </p>

          <div className="buttons-box">
            <button onClick={handleOpen}>LAUNCH DEMO {'>'}</button>
            <button>PROVIDE FEEDBACK {'>'}</button>
          </div>
        </div>

        <img
          className="screenshots"
          src={screenshot}
          alt={`${title} Screenshot`}
        />
      </div>

      {selectedProject && (
        <Modal onClose={handleClose}>
          {type === "iframe" && (
            <iframe
              src={src}
              title={title}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                borderRadius: "8px",
              }}
            />
          )}

          {type === "video" && (
            <video src={src} controls style={{ width: "100%", height: "100%" }} />
          )}

          {type === "images" && (
            <div
              className="image-gallery"
              style={{
                display: "flex",
                gap: "10px",
                overflowX: "auto",
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {src.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Slide ${i}`}
                  style={{ height: "90%", borderRadius: "8px" }}
                />
              ))}
            </div>
          )}
        </Modal>
      )}
    </>
  );
}

export default ProjectCard;
