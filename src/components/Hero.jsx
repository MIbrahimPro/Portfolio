import React, { useMemo, useRef, useEffect, useState } from "react";
import FancyButton from "./Fancybutton";
import * as THREE from "three";
import "./Hero.scss"; 

// 1) Typewriter sub-component
function Typewriter() {
  const words = useMemo(() => ["develop", "design", "code"], []);
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const pauseTime = 2000;

  const [displayedText, setDisplayedText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    let timer;
    const currentWord = words[wordIndex];

    // Typing
    if (!deleting && charIndex < currentWord.length) {
      timer = setTimeout(() => {
        setDisplayedText((prev) => prev + currentWord[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, typingSpeed);
    }
    // Finished typing, pause, then start deleting
    else if (!deleting && charIndex === currentWord.length) {
      timer = setTimeout(() => setDeleting(true), pauseTime);
    }
    // Deleting
    else if (deleting && charIndex > 0) {
      timer = setTimeout(() => {
        setDisplayedText((prev) => prev.slice(0, -1));
        setCharIndex((prev) => prev - 1);
      }, deletingSpeed);
    }
    // Finished deleting, move to next word
    else if (deleting && charIndex === 0) {
      setDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timer);
  }, [charIndex, deleting, wordIndex, words]);

  // Cursor blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => setBlink((prev) => !prev), 500);
    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <span>
      I {displayedText}
      <span className="typewrite-line" style={{ visibility: blink ? "visible" : "hidden" }}>|</span>
    </span>
  );
}

const handleScroll = () => {
  const contactSection = document.getElementById("contact");
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: "smooth" });
  }
};

  

export default function HeroSection() {
  // Refs for canvas and custom cursor
  const canvasRef = useRef(null);


  // ======== Three.js Wavy Lines ========
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const linesDataRef = useRef([]);
  const bgMeshRef = useRef(null);

  // Mouse position for the wave lines
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    // -- Basic constants from your snippet --
    const TOTAL_LINES = 25;
    const MIN_GAP = 10;
    const MIN_WAVELENGTH = 350;
    const MAX_WAVELENGTH = 650;
    const MIN_AMPLITUDE = 30;
    const MAX_AMPLITUDE = 60;
    const MIN_OPACITY = 0.4;
    const MAX_OPACITY = 0.8;
    const MIN_SPEED = 0.2;
    const MAX_SPEED = 1.0;
    const SPRING_CONSTANT = 0.02;
    const FRICTION = 0.70;
    const MOUSE_EFFECT_RADIUS = 500;
    const REPULSION_STRENGTH = 2.1;
    const DOT_SPACING = 7;
    const MIN_WIDTH = 1;
    const MAX_WIDTH = 3;
    const LINE_COLOR = "#D76C82";
    const BG_COLOR_BOTTOM = "#fffdf5";
    const BG_COLOR_TOP = "#ffffff";//IS ACTUALLT THE BOTTOM

    let scene, camera, renderer;

    const isTouchDevice = !window.matchMedia("(pointer: fine)").matches;
    // =========== INIT THREE.JS ===========
    function initThree() {
      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(
        0,
        window.innerWidth,
        window.innerHeight,
        0,
        -1000,
        1000
      );
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        canvas: canvasRef.current,
      });
      renderer.setSize(window.innerWidth, window.innerHeight);

      sceneRef.current = scene;
      cameraRef.current = camera;
      rendererRef.current = renderer;
    }

    // =========== BACKGROUND GRADIENT PLANE ===========
    function initBackground() {
      const geometry = new THREE.PlaneGeometry(
        window.innerWidth,
        window.innerHeight
      );
      const material = new THREE.ShaderMaterial({
        uniforms: {
          color1: { value: new THREE.Color(BG_COLOR_TOP) },
          color2: { value: new THREE.Color(BG_COLOR_BOTTOM) },
        },
        vertexShader: `
          varying vec2 vUv;
          void main(){
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
          varying vec2 vUv;
          void main(){
            gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
          }
        `,
        depthWrite: false,
      });
      const bgMesh = new THREE.Mesh(geometry, material);
      bgMesh.position.set(
        window.innerWidth / 2,
        window.innerHeight / 2,
        -10
      );
      scene.add(bgMesh);
      bgMeshRef.current = bgMesh;
    }

    // =========== DOTTED LINES SETUP ===========
    function initLines() {
      linesDataRef.current = [];
      let maxLinesPossible = Math.floor(window.innerHeight / MIN_GAP);
      let numLines = Math.min(TOTAL_LINES, maxLinesPossible);

      // Generate random y-positions
      let yPositions = [];
      let attempts = 0;
      while (yPositions.length < numLines && attempts < 1000) {
        let candidate = Math.random() * window.innerHeight;
        if (yPositions.every((y) => Math.abs(candidate - y) >= MIN_GAP)) {
          yPositions.push(candidate);
        }
        attempts++;
      }
      yPositions.sort((a, b) => a - b);

      yPositions.forEach((lineY) => {
        let phase = Math.random() * Math.PI * 2;
        let wavelength =
          MIN_WAVELENGTH + Math.random() * (MAX_WAVELENGTH - MIN_WAVELENGTH);
        let amplitude =
          MIN_AMPLITUDE + Math.random() * (MAX_AMPLITUDE - MIN_AMPLITUDE);
        let opacity = MIN_OPACITY + Math.random() * (MAX_OPACITY - MIN_OPACITY);
        let speed = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED);
        let dotSize = MIN_WIDTH + Math.random() * (MAX_WIDTH - MIN_WIDTH);

        // Build initial dots array
        let dots = [];
        let baseX = -wavelength;
        while (baseX < window.innerWidth + DOT_SPACING) {
          let targetY =
            lineY +
            Math.sin((baseX + phase) * ((2 * Math.PI) / wavelength)) *
              amplitude;
          dots.push({ baseX, x: baseX, y: targetY, vx: 0, vy: 0 });
          baseX += DOT_SPACING;
        }

        // Prepare a BufferGeometry
        let dotCapacity = dots.length + 20;
        let positions = new Float32Array(dotCapacity * 3);
        for (let i = 0; i < dots.length; i++) {
          positions[i * 3] = dots[i].x;
          positions[i * 3 + 1] = dots[i].y;
          positions[i * 3 + 2] = 0;
        }
        let geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setDrawRange(0, dots.length);

        let material = new THREE.PointsMaterial({
          color: new THREE.Color(LINE_COLOR),
          size: dotSize,
          transparent: true,
          opacity: opacity,
        });
        let pointsObj = new THREE.Points(geometry, material);
        scene.add(pointsObj);

        linesDataRef.current.push({
          y: lineY,
          phase,
          wavelength,
          amplitude,
          opacity,
          speed,
          dotSize,
          offset: 0,
          dots,
          geometry,
          positions,
          dotCapacity,
          pointsObj,
        });
      });
    }

    // =========== ANIMATION LOOP ===========
    function animate() {
      requestAnimationFrame(animate);
      const linesData = linesDataRef.current;
      linesData.forEach((line) => {
        line.offset += line.speed;
        line.dots.forEach((dot) => {
          let targetX = dot.baseX + line.offset;
          let targetY =
            line.y +
            Math.sin((dot.baseX + line.offset + line.phase) * ((2 * Math.PI) / line.wavelength)) *
              line.amplitude;

          // Spring
          let ax = (targetX - dot.x) * SPRING_CONSTANT;
          let ay = (targetY - dot.y) * SPRING_CONSTANT;

          // Mouse repulsion
          const dx = dot.x - mouseRef.current.x;
          const dy = dot.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_EFFECT_RADIUS && dist > 0) {
            let repulsion =
              ((MOUSE_EFFECT_RADIUS - dist) / MOUSE_EFFECT_RADIUS) *
              REPULSION_STRENGTH;
            ax += (dx / dist) * repulsion;
            ay += (dy / dist) * repulsion;
          }

          dot.vx = (dot.vx + ax) * FRICTION;
          dot.vy = (dot.vy + ay) * FRICTION;
          dot.x += dot.vx;
          dot.y += dot.vy;
        });

        // Remove dots off the right
        while (line.dots.length > 0) {
          let lastDot = line.dots[line.dots.length - 1];
          let lastTargetX = lastDot.baseX + line.offset;
          if (lastTargetX > window.innerWidth + DOT_SPACING) {
            line.dots.pop();
          } else {
            break;
          }
        }
        // Add new dots on the left
        while (line.dots.length > 0) {
          let firstDot = line.dots[0];
          let firstTargetX = firstDot.baseX + line.offset;
          if (firstTargetX >= -DOT_SPACING) {
            let newBaseX = firstDot.baseX - DOT_SPACING;
            let newTargetY =
              line.y +
              Math.sin(
                (newBaseX + line.offset + line.phase) *
                  ((2 * Math.PI) / line.wavelength)
              ) *
                line.amplitude;
            let newDot = {
              baseX: newBaseX,
              x: newBaseX + line.offset,
              y: newTargetY,
              vx: 0,
              vy: 0,
            };
            line.dots.unshift(newDot);
          } else {
            break;
          }
        }

        // Update geometry
        if (line.dots.length > line.dotCapacity) {
          line.dotCapacity = line.dots.length + 20;
          line.positions = new Float32Array(line.dotCapacity * 3);
          line.geometry.setAttribute(
            "position",
            new THREE.BufferAttribute(line.positions, 3)
          );
        }
        for (let i = 0; i < line.dots.length; i++) {
          line.positions[i * 3] = line.dots[i].x;
          line.positions[i * 3 + 1] = line.dots[i].y;
          line.positions[i * 3 + 2] = 0;
        }
        line.geometry.attributes.position.needsUpdate = true;
        line.geometry.setDrawRange(0, line.dots.length);
      });
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }

    // =========== RESIZE HANDLER ===========
    function onWindowResize() {
      cameraRef.current.right = window.innerWidth;
      cameraRef.current.top = window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);

      // Reinit background
      sceneRef.current.remove(bgMeshRef.current);
      initBackground();

      // Remove old lines
      linesDataRef.current.forEach((line) =>
        sceneRef.current.remove(line.pointsObj)
      );
      initLines();
    }

    // =========== INIT + EVENT LISTENERS ===========
    initThree();
    initBackground();
    initLines();
    animate();

    window.addEventListener("resize", onWindowResize);

    // Convert mouse coordinates so Y=0 is bottom in our code
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = window.innerHeight - e.clientY;
    };
    if (!isTouchDevice) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    // Cleanup on unmount

    return () => {
      window.removeEventListener("resize", onWindowResize);
    if (!isTouchDevice) {
      window.removeEventListener("mousemove", handleMouseMove);
    }
      rendererRef.current.dispose();
      sceneRef.current.clear();
    };
  }, []);



  return (
    <div className="hero-container">
      <canvas ref={canvasRef} />

      {/* Main Content */}
      <div className="hero-content">
        <h1>Hello.<br />I am M-Ibrahim.</h1>
        <h2><Typewriter /></h2>
        <div className="btns-cont">
          <FancyButton color="#e09ba9" onClick={() => handleScroll()}>Let’s Connect</FancyButton>
        <FancyButton type="copy" copyText="m.ibrahim.intl@gmail.com" />
        </div>
      </div>
    </div>
  );
}
