import React from "react";
import { FaGithub,  FaInstagram } from "react-icons/fa";
import "./SocialLinks.scss"; 

const SocialLinks = () => {
  return (
    <div className="social-links">
      <a href="https://github.com/M-IbrahimDEV" target="_blank" rel="noopener noreferrer">
        <FaGithub />
      </a>
      {/* <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
        <FaYoutube />
      </a> */}
      <a href="https://www.instagram.com/muhammad_ibrahim_tbt/" target="_blank" rel="noopener noreferrer">
        <FaInstagram />
      </a>

      <div class="dotted-line"></div>


    </div>
  );
};

export default SocialLinks;
