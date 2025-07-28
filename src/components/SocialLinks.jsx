import React from "react";
import { FaFacebookF, FaGithub, FaInstagram, FaLinkedinIn, FaTiktok, FaWhatsapp } from "react-icons/fa";
import "./SocialLinks.scss";

const SocialLinks = () => {
    return (
        <div className="social-links">
            <a href="https://github.com/MIbrahimPro" target="_blank" rel="noopener noreferrer">
                <FaGithub />
            </a>
            <a href="https://www.instagram.com/mibrahimpro.1/" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
            </a>
            <a href="https://www.facebook.com/profile.php?id=61577627302546" target="_blank" rel="noopener noreferrer">
                <FaFacebookF />
            </a>
            <a href="https://wa.me/923197877750" target="_blank" rel="noopener noreferrer">
                <FaWhatsapp />
            </a>
            <a href="https://www.tiktok.com/@mibrahimpro.1" target="_blank" rel="noopener noreferrer">
                <FaTiktok />
            </a>
            <a href="https://www.linkedin.com/in/muhammad-ibrahim-59a4a328a/" target="_blank" rel="noopener noreferrer">
                <FaLinkedinIn />
            </a>

            <div class="dotted-line"></div>


        </div>
    );
};

export default SocialLinks;
