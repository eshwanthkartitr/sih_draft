import React, { useEffect, useRef } from 'react';
import './MainContent.css';
import { gsap } from 'gsap';
import { createIcons, icons } from 'lucide';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { useNavigate } from 'react-router-dom';
import houseMtlUrl from '../assets/house.mtl?url';
import houseObjUrl from '../assets/house.obj?url';

const MainContent = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const mtlLoader = new MTLLoader();
    mtlLoader.load(
      houseMtlUrl,
      (materials) => {
        materials.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load(
          houseObjUrl,
          (object) => {
            scene.add(object);
          },
          (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
          },
          (error) => {
            console.error('An error happened loading OBJ:', error);
          }
        );
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% MTL loaded');
      },
      (error) => {
        console.error('An error happened loading MTL:', error);
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

  const handleArrowClick = () => {
    gsap.to('.main-content', {
      y: '-100%',
      duration: 1,
      ease: 'power2.inOut',
      onComplete: () => {
        navigate('/file-input');
      }
    });
  };

  return (
    <div className="main-content">
      <div className="cards-container">
        <div className="card">
          <img className="image" src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Image 1" />
        </div>
        <div className="card">
          <img className="image" src="https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Image 2" />
        </div>
        <div className="card">
          <img className="image" src="https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Image 3" />
        </div>
        <div className="card">
          <img className="image" src="https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Image 4" />
        </div>
        <div className="card">
          <img className="image" src="https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Image 5" />
        </div>
      </div>
      <div className="arrow" style={{ opacity: 0 }}>→</div>
      <div className="down-arrow" onClick={handleArrowClick} style={{ opacity: 1, cursor: 'pointer', position: 'absolute', bottom: '10px', fontSize: '2em' }}>↓</div>
      <div ref={mountRef} className="three-container" style={{ opacity: 0 }}></div>
    </div>
  );
};

export default MainContent;