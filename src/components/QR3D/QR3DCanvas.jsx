import React, { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import QR3DMesh from './QR3DMesh';
import QR3DEnvironment from './QR3DEnvironment';

// Separate the Canvas implementation to avoid render loop issues
const CanvasImpl = ({ canvasRef, settings, qrImageUrl, animationMode, viewMode }) => (
  <Canvas
    ref={canvasRef}
    shadows={settings.showShadows}
    gl={{ 
      antialias: settings.performance !== 'low',
      powerPreference: settings.performance === 'high' ? 'high-performance' : 'default',
      precision: settings.performance === 'low' ? 'mediump' : 'highp'
    }}
    dpr={settings.performance === 'low' ? 1 : window.devicePixelRatio}
  >
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
    
    <QR3DEnvironment 
      backgroundColor={settings.backgroundColor}
      showGridHelper={settings.showGridHelper}
      enableShadows={settings.showShadows}
    />
    
    <QR3DMesh 
      qrImageUrl={qrImageUrl}
      animationMode={animationMode}
      scale={settings.scale}
      rotationX={settings.rotationX}
      rotationY={settings.rotationY}
      material={settings.material}
      previewMode={viewMode}
    />
    
    <OrbitControls 
      enableDamping
      dampingFactor={0.25}
      rotateSpeed={0.5}
      enableZoom={true}
      enablePan={true}
      minDistance={1.5}
      maxDistance={10}
    />
  </Canvas>
);

const QR3DCanvas = ({ qrImageUrl, animationMode, settings, viewMode }) => {
  const canvasRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  // Handle mounting to prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) {
    return <div className="w-full h-64 md:h-96 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>;
  }

  return (
    <div className="w-full h-64 md:h-96 relative">
      <CanvasImpl 
        canvasRef={canvasRef}
        settings={settings}
        qrImageUrl={qrImageUrl}
        animationMode={animationMode}
        viewMode={viewMode}
      />
    </div>
  );
};

export default QR3DCanvas;
