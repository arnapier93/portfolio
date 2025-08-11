import React, { useState } from "react";
import SliderPuzzle from './SliderPuzzle.js';
import './SliderPuzzle.css';

export default function SliderPuzzleModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Slider Puzzle Demo</button>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0,
            width: "100vw", height: "100vh", //switch this to percents
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            style={{ backgroundColor: "#fff", padding: 20, borderRadius: 8 }}
            onClick={e => e.stopPropagation()} // prevent closing when clicking inside modal
          >
            <h2>Slider Puzzle</h2>
            <SliderPuzzle />
            <button onClick={() => setIsOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
