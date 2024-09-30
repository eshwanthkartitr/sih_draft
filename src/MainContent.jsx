import React, { useEffect, useRef, useState } from 'react';
import './MainContent.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createIcons, icons } from 'lucide';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { useNavigate } from 'react-router-dom';

// Import your assets
import houseMtl from './assets/house.mtl?url';
import houseObj from './assets/house.obj?url';

gsap.registerPlugin(ScrollTrigger);

const MainContent = () => {
  const containerRef = useRef(null);
  const modelRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    createIcons({ icons });
    initScene();
    animateCards();
    loadModel();
    initScrollAnimation();

    return cleanup;
  }, []);

  const initScene = () => {
    sceneRef.current = new THREE.Scene();
    cameraRef.current = new THREE.PerspectiveCamera(75, window.innerWidth / 2 / window.innerHeight, 0.1, 1000);
    rendererRef.current = new THREE.WebGLRenderer({ alpha: true });
    rendererRef.current.setSize(window.innerWidth / 2, window.innerHeight);

    if (containerRef.current) {
      containerRef.current.appendChild(rendererRef.current.domElement);
    }

    const ambientLight = new THREE.AmbientLight(0x404040);
    sceneRef.current.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1).normalize();
    sceneRef.current.add(directionalLight);

    cameraRef.current.position.z = 50;
  };

  const loadModel = () => {
    const manager = new THREE.LoadingManager();
    manager.onProgress = (url, itemsLoaded, itemsTotal) => {
      setLoadingProgress((itemsLoaded / itemsTotal) * 100);
    };

    const mtlLoader = new MTLLoader(manager);
    mtlLoader.load(houseMtl, (materials) => {
      materials.preload();
      const objLoader = new OBJLoader(manager);
      objLoader.setMaterials(materials);
      objLoader.load(houseObj, onModelLoad, onProgress, onError);
    });
  };

  const onModelLoad = (object) => {
    modelRef.current = object;
    sceneRef.current.add(object);
    object.position.set(0, 0, 0);
    object.scale.set(0.05, 0.05, 0.05);

    gsap.to(object.rotation, {
      y: Math.PI * 2,
      duration: 20,
      ease: "none",
      repeat: -1
    });

    setIsLoading(false);
    animate();
  };

  const onProgress = (xhr) => {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  };

  const onError = (error) => {
    console.error('An error happened', error);
    setIsLoading(false);
  };

  const animate = () => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;
    requestAnimationFrame(animate);
    rendererRef.current.render(sceneRef.current, cameraRef.current);
  };

  const animateCards = () => {
    const cards = document.querySelectorAll('.card');
    if (cards.length > 0) {
      gsap.fromTo(
        cards,
        { scale: 0, opacity: 0, x: () => Math.random() * 200 - 100, y: () => Math.random() * 200 - 100 },
        { scale: 1, opacity: 1, x: 0, y: 0, stagger: 0.1, ease: "elastic.out(1, 0.8)", duration: 1 }
      );
    }
  };

  const cleanup = () => {
    if (containerRef.current && rendererRef.current) {
      containerRef.current.removeChild(rendererRef.current.domElement);
    }
    window.removeEventListener('mousedown', onMouseDown);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
    window.removeEventListener('mouseout', onMouseOut);
    window.removeEventListener('wheel', onWheel);
  };

  useEffect(() => {
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mouseout', onMouseOut);
    window.addEventListener('wheel', onWheel);

    return () => {
      cleanup();
    };
  }, []);

  const onMouseDown = (event) => {
    isDragging.current = true;
    previousMousePosition.current = { x: event.clientX, y: event.clientY };
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

      previousMousePosition.current = { x: event.clientX, y: event.clientY };
    }
  };

  const onMouseUp = () => {
    isDragging.current = false;
  };

  const onMouseOut = () => {
    isDragging.current = false;
  };

  const onWheel = (event) => {
    if (cameraRef.current) {
      cameraRef.current.position.z += event.deltaY * 0.01;
    }
  };

  const initScrollAnimation = () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.main-content',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    });

    tl.to('.cards-container', {
      x: '-400%',
      ease: 'power2.inOut',
      duration: 3,
    })
    .to('.arrow', {
      opacity: 1,
      duration: 1,
    }, '-=1')
    .to(containerRef.current, {
      opacity: 1,
      duration: 2,
    }, '-=1')
    .to('.arrow', {
      y: '-60%',
      duration: 1,
    })
    .to(containerRef.current, {
      x: '500%',
      duration: 2,
      onComplete: () => {
        gsap.to('.transition-overlay', {
          y: '0%',
          duration: 1,
          ease: 'power2.inOut',
          onComplete: () => {
            navigate('/file-input');
          },
        });
      },
    });

    ScrollTrigger.create({
      trigger: '.main-content',
      start: 'bottom bottom',
      onEnter: () => {
        gsap.to('.transition-overlay', {
          y: '0%',
          duration: 1,
          ease: 'power2.inOut',
          onComplete: () => {
            navigate('/file-input');
          },
        });
      },
    });
  };

  return (
    <>
      <div className="main-content">
        <div className="cards-container">
          <div className="card">
            <img className="image" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRv7dDEpXoR1_z_Tu1z6vIshqz6K3loYcAnnA&s" alt="Image 1" />
          </div>
          <div className="card">
            <img className="image" src="https://d11ovvaxdf1k5p.cloudfront.net/Black_White_Service_087e3f349c.webp" alt="Image 2" />
          </div>
          <div className="card">
            <img className="image" src="https://5.imimg.com/data5/DC/JK/KX/ANDROID-110649032/product-jpeg-500x500.jpg" alt="Image 3" />
          </div>
          <div className="card">
            <img className="image" src="https://static3.depositphotos.com/1005732/201/i/450/depositphotos_2012642-stock-photo-architecture-plans.jpg" alt="Image 4" />
          </div>
          <div className="card">
            <img className="image" src="https://img.freepik.com/premium-photo/photo-construction-blueprint-plans-high-quality-details-8k-full-ultra-hd-ar-169-job-id-e7b4b3ee3fe4419ea287c042fb442914_1056572-35988.jpg" alt="Image 5" />
          </div>
        </div>
        <div className="arrow" style={{ opacity: 0 }}>→</div>
        <div ref={containerRef} className="three-container" style={{ opacity: 0 }}>
          {isLoading && (
            <div className="loading-overlay">
              <div className="spinner"></div>
              <p>Loading 3D Model: {loadingProgress.toFixed(2)}%</p>
            </div>
          )}
        </div>
      </div>
      <div className="transition-overlay"></div>
    </>
  );
};

export default MainContent;