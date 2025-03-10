import React, { useState } from "react";
import emailjs from "emailjs-com";
import CopyEmail from "./CopyEmail"; // Import the CopyButton component
import './Contact.scss'

export default function Contact() {
    const [status, setStatus] = useState("");
    const [formData, setFormData] = useState({ email: "", message: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const templateParams = {
            email: formData.email,
            message: formData.message,
        };

        emailjs
            .send(
                process.env.REACT_APP_EMAILJS_SERVICE_ID,
                process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
                templateParams,
                process.env.REACT_APP_EMAILJS_PUBLIC_KEY
            )
            .then(() => {
                alert("Message sent successfully!");
                setFormData({ email: "", message: "" });
            })
            .catch((err) => {
                console.error("Failed to send message:", err);
            });
    };

    return (
        <div className="contact-section" id="contact">
            <h1>Contact Me</h1>
            <h2>-- Let's Connect --</h2>

            <div className="btns-cont">
                <CopyEmail>m.ibrahim.intl@gmail.com</CopyEmail>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                />
                <button type="submit" className="connect-btn">Send Message</button>
            </form>
        </div>
    );
}
