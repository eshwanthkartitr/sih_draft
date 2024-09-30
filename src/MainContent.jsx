import React, { useEffect, useRef, useState } from 'react';
import './MainContent.css';
import { gsap } from 'gsap';
import { createIcons, icons } from 'lucide';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { useNavigate } from 'react-router-dom';

// Import your assets
import houseMtl from '../assets/house.mtl?url';
import houseObj from '../assets/house.obj?url';

const MainContent = () => {
  const mountRef = useRef(null);
  const modelRef = useRef(null);
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    // Load the MTL file
    const mtlLoader = new MTLLoader();
    mtlLoader.load(
      houseMtl,
      (materials) => {
        materials.preload();

        // Load the OBJ file
        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load(
          houseObj,
          (object) => {
            scene.add(object);
            object.position.set(0, 0, 0);
            object.scale.set(0.05, 0.05, 0.05); // Scale the model
            modelRef.current = object; // Store the model reference
            setIsLoading(false); // Hide loading overlay when model is loaded
          },
          (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
          },
          (error) => {
            console.error('Error loading OBJ file:', error);
          }
        );
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% MTL loaded');
      },
      (error) => {
        console.error('Error loading MTL file:', error);
      }
    );

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    // Event listeners for mouse interaction
    const onMouseDown = (event) => {
      isDragging.current = true;
      previousMousePosition.current = {
        x: event.clientX,
        y: event.clientY
      };
    };

    const onMouseMove = (event) => {
      if (isDragging.current && modelRef.current) {
        const deltaMove = {
          x: event.clientX - previousMousePosition.current.x,
          y: event.clientY - previousMousePosition.current.y
        };

        const rotationSpeed = 0.005;
        modelRef.current.rotation.y += deltaMove.x * rotationSpeed;
        modelRef.current.rotation.x += deltaMove.y * rotationSpeed;

        previousMousePosition.current = {
          x: event.clientX,
          y: event.clientY
        };
      }
    };

    const onMouseUp = () => {
      isDragging.current = false;
    };

    const onMouseOut = () => {
      isDragging.current = false;
    };

    // Add event listeners
    mountRef.current.addEventListener('mousedown', onMouseDown);
    mountRef.current.addEventListener('mousemove', onMouseMove);
    mountRef.current.addEventListener('mouseup', onMouseUp);
    mountRef.current.addEventListener('mouseout', onMouseOut);

    return () => {
      mountRef.current.removeChild(renderer.domElement);
      // Remove event listeners
      mountRef.current.removeEventListener('mousedown', onMouseDown);
      mountRef.current.removeEventListener('mousemove', onMouseMove);
      mountRef.current.removeEventListener('mouseup', onMouseUp);
      mountRef.current.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

  const handleNextClick = () => {
    navigate('/file-input');
  };

  return (
    <div className="main-content">
      <header className="header">
        <h1>3D Model Viewer</h1>
        <p>Interact with the 3D model using your cursor</p>
      </header>

      <div className="model-container">
        {isLoading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>Loading 3D Model...</p>
          </div>
        )}
        <div 
          ref={mountRef} 
          className="three-container" 
          style={{ opacity: isLoading ? 0 : 1, cursor: 'grab' }}
        ></div>
      </div>

      <div className="controls">
        <button className="reset-button" onClick={() => {
          if (modelRef.current) {
            modelRef.current.rotation.set(0, 0, 0);
          }
        }}>
          Reset View
        </button>
        <div className="zoom-controls">
          <button onClick={() => {/* Implement zoom in */}}>Zoom In</button>
          <button onClick={() => {/* Implement zoom out */}}>Zoom Out</button>
        </div>
      </div>

      <div className="info-panel">
        <h2>Model Information</h2>
        <p>Name: Sample House</p>
        <p>Polygons: 10,000</p>
        <p>Size: 5MB</p>
      </div>

      <footer className="footer">
        <button className="next-button" onClick={handleNextClick}>
          Next: Upload Your Own Model
        </button>
      </footer>
    </div>
  );
};

export default MainContent;