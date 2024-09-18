import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';

const PageWrapper = ({ children }) => {
  const containerRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(containerRef.current, { y: '100%' }, { y: '0%', duration: 1, ease: 'power2.inOut' });
  }, [location]);

  return (
    <div ref={containerRef} style={{ position: 'absolute', width: '100%', height: '100%' }}>
      {children}
    </div>
  );
};

export default PageWrapper;