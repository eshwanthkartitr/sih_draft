import React, { useEffect, useRef } from 'react';
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
  const navigate = useNavigate();

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

    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  // ... rest of your component code

  return (
    <div className="main-content">
      {/* ... other elements */}
      <div ref={mountRef} className="three-container" style={{ opacity: 0 }}></div>
    </div>
  );
};

export default MainContent;