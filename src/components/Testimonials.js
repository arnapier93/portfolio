import React, { useState } from "react";
import "./Testimonials.css";
import TestimonialCard, { testimonialCount } from "./TestimonialCard";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextCard = () => setCurrentIndex((prev) => (prev + 1) % testimonialCount);
  const prevCard = () =>
    setCurrentIndex((prev) => (prev - 1 + testimonialCount) % testimonialCount);

  return (
    <div className="testimonials-section">
      <div className="title-box">
        <h1 className="title">Testimonials</h1>
        <p className="text">Hear what my colleagues have to say</p>
      </div>

        <button className="scroll-btn left" onClick={prevCard}>
          &#8249;
        </button>

        <div className="carousel">
          {Array.from({ length: testimonialCount }).map((_, i) => (
            <div
              key={i}
              className={`carousel-item ${
                i === currentIndex
                  ? "active"
                  : i === (currentIndex - 1 + testimonialCount) % testimonialCount
                  ? "prev"
                  : i === (currentIndex + 1) % testimonialCount
                  ? "next"
                  : "hidden"
              }`}
            >
              <TestimonialCard index={i} />
            </div>
          ))}
        </div>

        <button className="scroll-btn right" onClick={nextCard}>
          &#8250;
        </button>
      </div>
  );
};

export default Testimonials;
