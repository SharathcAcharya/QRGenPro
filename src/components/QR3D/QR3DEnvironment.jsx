import React from 'react';
import * as THREE from 'three';

const QR3DEnvironment = ({ backgroundColor = '#000000', showGridHelper = false, enableShadows = true }) => {
  return (
    <>
      {/* Ambient light for general illumination */}
      <ambientLight intensity={0.5} />
      
      {/* Main directional light with shadows */}
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={1} 
        castShadow={enableShadows}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Fill light from opposite direction */}
      <directionalLight position={[-5, -5, -5]} intensity={0.3} />
      
      {/* Optional grid helper */}
      {showGridHelper && <gridHelper args={[10, 10]} />}
      
      {/* Background color */}
      <color attach="background" args={[backgroundColor]} />
      
      {/* Ground plane for shadows */}
      {enableShadows && (
        <mesh 
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[0, -2, 0]} 
          receiveShadow
        >
          <planeGeometry args={[20, 20]} />
          <shadowMaterial opacity={0.4} />
        </mesh>
      )}
    </>
  );
};

export default QR3DEnvironment;
