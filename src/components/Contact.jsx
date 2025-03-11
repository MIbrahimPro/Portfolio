import React, { useState, useRef, useEffect } from "react";
import emailjs from "emailjs-com";
import * as THREE from "three";
import FancyButton from "./Fancybutton";
import "./Contact.scss";

export default function Contact() {
    // ====== Email Form State ======
    const [formData, setFormData] = useState({ email: "", message: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("well it got here");
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

    

        // ====== Three.js Setup ======
        const canvasRef = useRef(null);
        const sceneRef = useRef(null);
        const cameraRef = useRef(null);
        const rendererRef = useRef(null);
        const bgMeshRef = useRef(null);
        const wavesRef = useRef([]);

    useEffect(() => {


        // ====== Wave Constants ======
        const SEGMENT_SPACING = 5;
        const amplitude = 40;
        const wavelength = 600;
        const phase = 0;
        const lineColor = "#D76C82";
        const opacity = 0.6;

        // Configure the overall wave layout.
        const numberOfWaves = 22;
        const firstWaveY = 666;
        const lastWaveY = 333;
        // For the horizontal motion animation.
        const MIN_SPEED = -0.5;
        const MAX_SPEED = -3;

        // Generate wave configurations with an interpolated y value,
        // a random starting x offset, and a random x speed.
        function generateWaveConfigs() {
            const configs = [];
            if (numberOfWaves < 1) return configs;
            for (let i = 0; i < numberOfWaves; i++) {
                const t = numberOfWaves === 1 ? 0 : i / (numberOfWaves - 1);
                const y = firstWaveY + t * (lastWaveY - firstWaveY);
                const xOff = Math.random() * 200; // random initial offset
                const xSpeed = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED);
                configs.push({ y, xOff, xSpeed, amplitude, wavelength, phase, lineColor, opacity });
            }
            return configs;
        }



        let scene, camera, renderer;

        // ====== Initialize Three.js ======
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

        // ====== Background Gradient ======
        function initBackground() {
            const geometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    color1: { value: new THREE.Color("#ffffff") },
                    color2: { value: new THREE.Color("#fffdf5") },
                },
                vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
                fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
          varying vec2 vUv;
          void main() {
            gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
          }
        `,
                depthWrite: false,
            });
            const bgMesh = new THREE.Mesh(geometry, material);
            bgMesh.position.set(window.innerWidth / 2, window.innerHeight / 2, -10);
            scene.add(bgMesh);
            bgMeshRef.current = bgMesh;
        }

        // ====== Build Animated Waves ======
        function initWaves() {
            wavesRef.current = [];
            const waveConfigs = generateWaveConfigs();

            waveConfigs.forEach((cfg) => {
                const { y, xOff, xSpeed, amplitude, wavelength, phase, lineColor, opacity } = cfg;

                // Generate base x positions for vertices.
                let basePositions = [];
                for (let x = 0; x <= window.innerWidth + SEGMENT_SPACING; x += SEGMENT_SPACING) {
                    basePositions.push({ x });
                }
                const vertexCount = basePositions.length;

                // Compute initial actual positions using the wave equation.
                const actualPositions = basePositions.map(({ x }) => {
                    const newY = y + Math.sin((x + xOff + phase) * ((2 * Math.PI) / wavelength)) * amplitude;
                    return { x, y: newY };
                });

                // Create BufferGeometry with the initial positions.
                const positions = new Float32Array(vertexCount * 3);
                actualPositions.forEach((pt, i) => {
                    positions[i * 3] = pt.x;
                    positions[i * 3 + 1] = pt.y;
                    positions[i * 3 + 2] = 0;
                });

                const geometry = new THREE.BufferGeometry();
                geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

                const material = new THREE.LineBasicMaterial({
                    color: new THREE.Color(lineColor),
                    transparent: true,
                    opacity,
                    linewidth: 2,
                });

                const lineMesh = new THREE.Line(geometry, material);
                sceneRef.current.add(lineMesh);

                // Store the wave data for later updates.
                wavesRef.current.push({
                    basePositions,
                    actualPositions,
                    vertexCount,
                    geometry,
                    lineMesh,
                    y,
                    xOff,
                    xSpeed,
                    amplitude,
                    wavelength,
                    phase,
                });
            });
        }

        // ====== Animation Loop ======
        function animate() {
            requestAnimationFrame(animate);

            wavesRef.current.forEach((wave) => {
                // Update the wave's x offset by its assigned speed.
                wave.xOff += wave.xSpeed;
                // Recalculate each vertex’s y value based on the new x offset.
                for (let i = 0; i < wave.vertexCount; i++) {
                    const x = wave.basePositions[i].x;
                    const newY =
                        wave.y +
                        Math.sin((x + wave.xOff + wave.phase) * ((2 * Math.PI) / wave.wavelength)) *
                        wave.amplitude;
                    wave.actualPositions[i] = { x, y: newY };
                }

                // Create a smooth curve from the updated vertices.
                const points = wave.actualPositions.map((p) => new THREE.Vector3(p.x, p.y, 0));
                const curve = new THREE.CatmullRomCurve3(points);
                // The subdivision factor here controls smoothness.
                const smoothedPoints = curve.getPoints(points.length * 3);

                // Build a new positions array from the smoothed points.
                const newPositions = new Float32Array(smoothedPoints.length * 3);
                smoothedPoints.forEach((pt, i) => {
                    newPositions[i * 3] = pt.x;
                    newPositions[i * 3 + 1] = pt.y;
                    newPositions[i * 3 + 2] = 0;
                });

                // Update the geometry.
                wave.geometry.setAttribute("position", new THREE.BufferAttribute(newPositions, 3));
                wave.geometry.setDrawRange(0, smoothedPoints.length);
                wave.geometry.attributes.position.needsUpdate = true;
            });

            rendererRef.current.render(sceneRef.current, cameraRef.current);
        }

        function onWindowResize() {
            cameraRef.current.right = window.innerWidth;
            cameraRef.current.top = window.innerHeight;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(window.innerWidth, window.innerHeight);

            // Reinitialize the background.
            sceneRef.current.remove(bgMeshRef.current);
            initBackground();

            // Remove old waves and rebuild.
            wavesRef.current.forEach((wave) => {
                sceneRef.current.remove(wave.lineMesh);
            });
            wavesRef.current = [];
            initWaves();
        }

        // ====== Initialize Everything ======
        initThree();
        initBackground();
        initWaves();
        animate();

        // ====== Event Listener for Resize ======
        window.addEventListener("resize", onWindowResize);

        return () => {
            window.removeEventListener("resize", onWindowResize);
            if (rendererRef.current) {
                rendererRef.current.dispose();
            }
            if (sceneRef.current) {
                sceneRef.current.clear();
            }
        };
    }, []);

    return (
        <div className="contact-section" id="contact">
            <canvas ref={canvasRef} className="wave-canvas" />
            <h1>Contact Me</h1>
            <h2>-- Let's Connect --</h2>
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

                <button type="submit" className="connect-btn">
                    <FancyButton width="100%" maxwidth="500px" color="#D76C82" >Send Message</FancyButton>
                </button>

                <FancyButton width="100%" maxwidth="500px" type="copy" copyText="m.ibrahim.intl@gmail.com" onClick={(e) => e.stopPropagation()} />

            </form>
        </div>
    );
}
