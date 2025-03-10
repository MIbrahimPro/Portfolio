import React, { useRef, useEffect } from "react";
import './App.scss';
import HeroSection from './components/Hero';
import Navbar from './components/Navbar';
import Socials from './components/SocialLinks';
import  SkillIcons from './components/Skills';
import  Contact from './components/Contact';

function App() {
  const cursorRef = useRef(null);
  
  // ======== Custom Cursor Setup ========
    useEffect(() => {
      const cursorEl = cursorRef.current;
      function handleMouseMove(e) {
        const { width, height } = cursorEl.getBoundingClientRect();
        cursorEl.style.transform = `translate(${e.clientX - width / 2}px, ${
          e.clientY - height / 2
        }px)`;
      }
      document.addEventListener("mousemove", handleMouseMove);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
      };
    }, []);
  
  
  
    return (
    <div className="App">
      
      <div className="cursor" ref={cursorRef}></div>
      <Navbar />
      <Socials />
      <HeroSection />
      <SkillIcons />
      <Contact />
    </div>
  );
}

export default App;
