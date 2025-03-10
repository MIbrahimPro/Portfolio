import React, { useState } from "react";
import "./Hero.scss"; 




  
const fallbackCopy = (text, setCopyStatus) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "absolute";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy"); // Older method
    document.body.removeChild(textarea);
    setCopyStatus("Email Copied!");
  };


function CopyButton({ children }) {
    const [copyStatus, setCopyStatus] = useState("Copy Email");
  
    const handleCopy = () => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(children)
              .then(() => setCopyStatus("Email Copied!"))
              .catch(() => fallbackCopy(children, setCopyStatus));
          } else {
            fallbackCopy(children, setCopyStatus);
          }
        navigator.clipboard.writeText(children).then(() => {
        setCopyStatus("Email Copied!");
  
        setTimeout(() => {
          setCopyStatus("Copy Email");
        }, 2000);
      }).catch((error) => {
        console.error("Error copying text: ", error);
      });
    };
  
    return (
      <div className="btn-container" onClick={handleCopy}>
        <span className="btn-text">{copyStatus}</span>
        <span className="btn-bg"></span>
        <span className="btn-icon">
          {/* Default copy icon */}
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
          {/* Hover copy icon */}
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
        </span>
      </div>
    );
  }
export default function CopyEmail() {




  return (
            <CopyButton>muhammadibrahimtbt@gmail.com</CopyButton>
  );



}
