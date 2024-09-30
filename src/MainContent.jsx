import React, { useEffect, useRef, useState } from 'react';
import './MainContent.css';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

// Import your assets
import houseMtl from './assets/house.mtl?url';
import houseObj from './assets/house.obj?url';

const MainContent = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const modelRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    // Load model
    const mtlLoader = new MTLLoader();
    mtlLoader.load(houseMtl, (materials) => {
      materials.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load(houseObj, (object) => {
        scene.add(object);
        object.position.set(0, 0, 0);
        object.scale.set(0.05, 0.05, 0.05);
        modelRef.current = object;
        setIsLoading(false);
      });
    });

    camera.position.z = 5;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Store refs
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    // Cleanup
    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  // Mouse interaction
  useEffect(() => {
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (event) => {
      isDragging = true;
      previousMousePosition = {
        x: event.clientX,
        y: event.clientY
      };
    };

    const onMouseMove = (event) => {
      if (isDragging && modelRef.current) {
        const deltaMove = {
          x: event.clientX - previousMousePosition.x,
          y: event.clientY - previousMousePosition.y
        };

        const rotationSpeed = 0.005;
        modelRef.current.rotation.y += deltaMove.x * rotationSpeed;
        modelRef.current.rotation.x += deltaMove.y * rotationSpeed;

        previousMousePosition = {
          x: event.clientX,
          y: event.clientY
        };
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const handleNextClick = () => {
    navigate('/file-input');
  };

  const handleArrowClick = () => {
    gsap.to(window, { duration: 1, scrollTo: { y: window.innerHeight, autoKill: false } });
  };

  return (
    <div className="main-content">
      <div className="cards-container">
        <div className="card">
          <img className="image" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRv7dDEpXoR1_z_Tu1z6vIshqz6K3loYcAnnA&s" alt="Image 1" />
        </div>
        <div className="card">
          <img className="image" src="https://wpmedia.roomsketcher.com/content/uploads/2022/01/27111154/Profile_Black-2D_Floor_Plan.jpg" alt="Image 2" />
        </div>
        <div className="card">
          <img className="image" src="https://5.imimg.com/data5/DC/JK/KX/ANDROID-110649032/product-jpeg-500x500.jpg" alt="Image 3" />
        </div>
        <div className="card">
          <img className="image" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6qFnC-wljMBOpqwozJ25FlF1OrQPx2m7TzA&s" alt="Image 4" />
        </div>
        <div className="card">
          <img className="image" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoGrUKiFTzS1orStk5Fymcd9OdH_YDx5RLiA&s" alt="Image 5" />
        </div>
      </div>
      <div className="arrow" style={{ opacity: 0 }}>→</div>
      <div className="down-arrow" onClick={handleArrowClick} style={{ opacity: 1, cursor: 'pointer', position: 'absolute', bottom: '10px', fontSize: '2em' }}>↓</div>
      
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