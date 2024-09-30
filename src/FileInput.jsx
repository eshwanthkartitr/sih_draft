import React, { useState, useEffect, useRef } from 'react';
import './FileInput.css';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';

const tips = [
  "Tip: Don't forget to water your plants!",
  "Tip: Always carry a towel.",
  "Tip: Never trust a computer you can't throw out a window.",
  "Tip: If at first you don't succeed, call it version 1.0.",
  "Tip: To err is human, to debug is divine.",
  "Tip: There are 10 types of people in the world: those who understand binary and those who don't.",
  "Tip: Why do programmers prefer dark mode? Because light attracts bugs!",
  "Tip: A clean house is a sign of a broken computer.",
  "Tip: I would love to change the world, but they won't give me the source code.",
  "Tip: Programming is like writing a book... except if you miss out a single comma on page 126 the whole thing makes no sense."
];

const FileInput = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [modelFiles, setModelFiles] = useState({ obj: null, mtl: null });
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTip, setCurrentTip] = useState('');
  const [videoEnded, setVideoEnded] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    if (isProcessing) {
      const tipInterval = setInterval(() => {
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        setCurrentTip(randomTip);
      }, 5000);

      return () => clearInterval(tipInterval);
    }
  }, [isProcessing]);

  const handleVideoTimeUpdate = () => {
    if (videoRef.current && progressBarRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      progressBarRef.current.style.width = `${progress}%`;
    }
  };

  const handleVideoEnd = () => {
    setVideoEnded(true);
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target.result);
      };
      reader.readAsDataURL(file);

      setIsProcessing(true);
      setError(null);

      // Simulate processing delay
      setTimeout(() => {
        // Create a simple cube as a placeholder 3D model
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);

        // Convert the cube to OBJ format
        const exporter = new THREE.OBJExporter();
        const objData = exporter.parse(cube);

        // Create a simple MTL content
        const mtlData = `
newmtl Material
Ns 323.999994
Ka 1.000000 1.000000 1.000000
Kd 0.800000 0.800000 0.800000
Ks 0.500000 0.500000 0.500000
Ke 0.000000 0.000000 0.000000
Ni 1.450000
d 1.000000
illum 2
        `.trim();

        // Create Blob URLs for the OBJ and MTL data
        const objBlob = new Blob([objData], { type: 'text/plain' });
        const mtlBlob = new Blob([mtlData], { type: 'text/plain' });

        setModelFiles({
          obj: URL.createObjectURL(objBlob),
          mtl: URL.createObjectURL(mtlBlob)
        });

        setIsProcessing(false);
        setVideoEnded(true);
      }, 9000); // Simulating 9 seconds of processing time
    } else {
      setError('Please upload a valid image file.');
    }
  };

  const handleDownloadModel = (fileType) => {
    const fileUrl = modelFiles[fileType];
    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = `model.${fileType}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      setError(`No ${fileType.toUpperCase()} file available for download.`);
    }
  };

  return (
    <div className="file-input-container">
      <div className="file-input-content">
        <h1 className="title">3D Model Generator</h1>
        <p className="subtitle">Transform your 2D images into 3D models</p>
        
        <div className="upload-section">
          <label htmlFor="file-upload" className="custom-file-upload">
            <i className="fa fa-cloud-upload"></i> Choose an Image
          </label>
          <input id="file-upload" type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        
        {imageSrc && (
          <div className="preview-section">
            <img src={imageSrc} alt="Uploaded" className="uploaded-image" />
          </div>
        )}
        
        {isProcessing && !videoEnded && (
          <div className="processing-overlay">
            <video
              ref={videoRef}
              className="processing-video"
              autoPlay
              muted
              onTimeUpdate={handleVideoTimeUpdate}
              onEnded={handleVideoEnd}
            >
              <source src="../sample_video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="processing-tips">
              <p>{currentTip}</p>
            </div>
            <div className="progress-bar-container">
              <div ref={progressBarRef} className="progress-bar"></div>
            </div>
          </div>
        )}
        
        {videoEnded && (
          <div className="post-video-content">
            <h2>Your 3D model is ready!</h2>
            <button onClick={() => handleDownloadModel('obj')} className="download-button">
              <i className="fa fa-download"></i> Download OBJ File
            </button>
            <button onClick={() => handleDownloadModel('mtl')} className="download-button">
              <i className="fa fa-download"></i> Download MTL File
            </button>
          </div>
        )}

        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default FileInput;