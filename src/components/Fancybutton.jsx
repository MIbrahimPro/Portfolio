import React, { useState } from "react";
import "./Fancybutton.scss";


export default function FancyButton({
  children,
  type = "button", // 'button' or 'copy'
  copyText = "", // Used if type='copy'
  onClick = () => {}, // Custom onClick handler (if needed)
}) {
  const [copyStatus, setCopyStatus] = useState("Copy Email");

  const handleAction = () => {
    if (type === "copy") {
        navigator.clipboard.writeText(copyText || children)
        setCopyStatus("Copied!")
      setTimeout(() => setCopyStatus("Copy Email"), 2000);
    } else {
      onClick();
    }
  };

  return (
    <div className="btn-container connect-btn" onClick={handleAction}>
      <span className="btn-text">{type === "copy" ? copyStatus : children}</span>
      <span className="btn-bg"></span>
      <span className="btn-icon">
        {/* Default Icon */}
        {type === "copy" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon-default"
          >
            <path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM5 7h11V5H5z"></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon-default"
          >
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        )}
        {/* Hover Icon */}
        {type === "copy" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon-hover"
          >
            <path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM5 7h11V5H5z"></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon-hover"
          >
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        )}
      </span>
    </div>
  );
}
