import React, { useState, useEffect } from "react";
import "./AboutMe.css";
import useMouseSpeed from "../hooks/useMouseSpeed";
import Modal from "./Modal";
import { ProjectList } from "./ProjectList.js";

import allc from "../assets/allc.png";
import androidstudio from "../assets/androidstudio.png";
import dart from "../assets/dart.png";
import figma from "../assets/figma.png";
import flutter from "../assets/flutter.png";
import godot from "../assets/godot.png";
import java from "../assets/java.png";
import js from "../assets/js.png";
import linux from "../assets/linux.png";
import postman from "../assets/postman.png";
import python from "../assets/python.png";
import swift from "../assets/swift.png";
import unity from "../assets/unity.png";
import vscode from "../assets/vscode.png";
import xcode from "../assets/xcode.png";

const text = `Thank you for visiting my site! 
I'm Andrew Napier, a full stack developer with a Bachelor's Degree in Computer Science 
— Computer Game Design from the University of Massachusetts Dartmouth.
Press the button below to launch a random project of mine.`;

const logo_row1 = [androidstudio, allc, dart, figma, flutter, godot, java, js];
const logo_row2 = [linux, postman, python, swift, unity, vscode, xcode];

const AboutMe = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [lastIndex, setLastIndex] = useState(null);
  const mouse = useMouseSpeed();
  const [logoRotations, setLogoRotations] = useState({});
  const [logoWobbles, setLogoWobbles] = useState({});

  const handleOpenProject = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * ProjectList.length);
    } while (newIndex === lastIndex && ProjectList.length > 1);

    setLastIndex(newIndex);
    setSelectedProject(ProjectList[newIndex]);
  };

  const handleCloseProject = () => setSelectedProject(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogoRotations((prev) => {
        const updated = {};
        Object.keys(prev).forEach((key) => {
          let newRotation = prev[key] * 0.65;
          if (Math.abs(newRotation) < 0.5) newRotation = 0;
          updated[key] = newRotation;
        });
        return updated;
      });

      setLogoWobbles((prev) => {
        const updated = {};
        Object.keys(prev).forEach((key) => {
          let newWobble = prev[key] * 0.92;
          if (Math.abs(newWobble) > 0.1) updated[key] = newWobble;
        });
        return updated;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (index, e) => {
    const rect = e.target.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = mouse.x - centerX;
    const deltaY = mouse.y - centerY;
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    const isVertical = Math.abs(deltaY) > Math.abs(deltaX);

    const baseRotation = mouse.speed * 200;
    const rotation = (Math.abs(angle) < 90)
      ? (isVertical ? -baseRotation : baseRotation)
      : (isVertical ? baseRotation : -baseRotation);

    const wobble = mouse.speed / 2;

    setLogoRotations((prev) => ({ ...prev, [index]: rotation }));
    setLogoWobbles((prev) => ({ ...prev, [index]: wobble }));
  };

  const getLogoStyle = (index) => {
    const wobble = Math.sin(Date.now() / 200 + index) * (logoWobbles[index] || 0);
    return {
      transform: `rotate(${logoRotations[index] || 0}deg) translateY(${wobble}px)`,
      transition: "transform 0.1s linear",
    };
  };

  return (
    <div className="about-me">
      <div style={{ display: "flex", gap: "2vw", alignItems: "flex-start" }}>
        <div className="content">
          <h1 className="title">Hi! I'm Andrew Napier</h1>
          <p className="text">{text}</p>
          <button className="green-btn" onClick={handleOpenProject}>
            GO AHEAD, YOU KNOW YOU WANT TO! {'>'}
          </button>
          <p className="text">Proficient in:</p>
        </div>
        <div className="photo"></div>
      </div>

      <div className="logo-row">
        {logo_row1.map((logo, index) => (
          <div key={index} onMouseMove={(e) => handleMouseMove(index, e)} style={getLogoStyle(index)}>
            <img src={logo} alt={`Logo ${index + 1}`} className="logo" />
          </div>
        ))}
      </div>

      <div className="logo-row">
        {logo_row2.map((logo, index) => (
          <div key={index + logo_row1.length} onMouseMove={(e) => handleMouseMove(index + logo_row1.length, e)} style={getLogoStyle(index + logo_row1.length)}>
            <img src={logo} alt={`Logo ${index + logo_row1.length}`} className="logo" />
          </div>
        ))}
      </div>

      {selectedProject && (
        <Modal onClose={handleCloseProject}>
          {selectedProject.type === "iframe" && (
            <iframe src={selectedProject.src} title={selectedProject.title} style={{ width: "100%", height: "100%", border: "none" }} />
          )}
          {selectedProject.type === "video" && (
            <video src={selectedProject.src} controls style={{ width: "100%", height: "100%" }} />
          )}
          {selectedProject.type === "images" && Array.isArray(selectedProject.src) && (
            <div className="image-gallery">
              {selectedProject.src.map((img, i) => (
                <img key={i} src={img} alt={`Slide ${i}`} />
              ))}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default AboutMe;
