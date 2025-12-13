import React, { useState } from "react";
import "./Modal.css";

const FeedbackToast = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const email = "contactme@andrew-napier.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#DEDEDE",
          color: "#000",
          borderRadius: "20px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          padding: "1.5rem",
          width: "min(90vw, 400px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          position: "relative", // key part for the close button
          gap: "1.25rem",
        }}
      >
        {/* X button positioned absolutely in the top-right corner */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: "#A0A2BD",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "28px",
            height: "28px",
            fontSize: "16px",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#888AB0")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#A0A2BD")}
        >
          ✕
        </button>

        {/* 2nd row — Text */}
        <p style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>
          Send feedback to:
          <br />
          <strong style={{ wordBreak: "break-all" }}>{email}</strong>
        </p>

        {/* 3rd row — Copy button */}
        <button
          onClick={handleCopy}
          style={{
            backgroundColor: "#A0A2BD",
            color: "white",
            border: "none",
            borderRadius: "12px",
            padding: "0.75rem 1.5rem",
            width: "80%",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "500",
            transition: "background 0.2s, transform 0.1s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#888AB0")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#A0A2BD")}
          onMouseDown={(e) => (e.target.style.transform = "scale(0.97)")}
          onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
        >
          {copied ? "Copied!" : "Copy Email"}
        </button>
      </div>
    </div>
  );
};

export default FeedbackToast;
