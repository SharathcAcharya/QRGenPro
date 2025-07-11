import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const QR3DMesh = ({ 
  qrImageUrl, 
  animationMode, 
  scale = 1, 
  rotationX = 0, 
  rotationY = 0, 
  material = 'standard'
}) => {
  const meshRef = useRef();
  const [textureError, setTextureError] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 2, height: 2 });
  const physicsRef = useRef({ 
    velocity: { x: 0, y: 0, z: 0 }, 
    gravity: 0.01, 
    damping: 0.98, 
    userForce: { x: 0, y: 0 } 
  });
  
  // Load texture with error handling using the useTexture hook
  const [texture] = useTexture([qrImageUrl], 
    // onLoad callback
    (loadedTextures) => {
      const texture = loadedTextures[0];
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.NearestFilter;
      
      // Calculate dimensions when texture loads
      if (texture && texture.image) {
        const aspectRatio = texture.image.width / texture.image.height;
        setDimensions({
          width: aspectRatio > 1 ? 2 * aspectRatio : 2,
          height: aspectRatio > 1 ? 2 : 2 / aspectRatio
        });
      }
    },
    // onError callback
    () => {
      setTextureError(true);
    }
  );

  // Physics animation
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Basic rotation animation
    if (animationMode === 'rotate') {
      meshRef.current.rotation.y += delta * 0.5;
    }
    
    // Physics-based animation
    if (animationMode === 'physics') {
      // Apply user force
      physicsRef.current.velocity.x += physicsRef.current.userForce.x;
      physicsRef.current.velocity.y += physicsRef.current.userForce.y;
      
      // Apply gravity
      physicsRef.current.velocity.y -= physicsRef.current.gravity;
      
      // Apply damping
      physicsRef.current.velocity.x *= physicsRef.current.damping;
      physicsRef.current.velocity.y *= physicsRef.current.damping;
      physicsRef.current.velocity.z *= physicsRef.current.damping;
      
      // Update position
      meshRef.current.position.x += physicsRef.current.velocity.x;
      meshRef.current.position.y += physicsRef.current.velocity.y;
      meshRef.current.position.z += physicsRef.current.velocity.z;
      
      // Bounce off boundaries
      const boundaryLimit = 2;
      if (Math.abs(meshRef.current.position.x) > boundaryLimit) {
        meshRef.current.position.x = Math.sign(meshRef.current.position.x) * boundaryLimit;
        physicsRef.current.velocity.x *= -0.8;
      }
      
      if (Math.abs(meshRef.current.position.y) > boundaryLimit) {
        meshRef.current.position.y = Math.sign(meshRef.current.position.y) * boundaryLimit;
        physicsRef.current.velocity.y *= -0.8;
      }
      
      // Add rotation based on movement
      meshRef.current.rotation.x += physicsRef.current.velocity.y * 0.5;
      meshRef.current.rotation.y += physicsRef.current.velocity.x * 0.5;
    }
  });
  
  // Error state
  if (textureError) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 0.1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    );
  }
  
  // Choose material based on settings
  let materialComponent;
  if (texture) {
    switch(material) {
      case 'basic':
        materialComponent = <meshBasicMaterial map={texture} color="white" />;
        break;
      case 'phong':
        materialComponent = <meshPhongMaterial map={texture} color="white" shininess={30} />;
        break;
      case 'toon':
        materialComponent = <meshToonMaterial map={texture} color="white" />;
        break;
      case 'physical':
        materialComponent = (
          <meshPhysicalMaterial 
            map={texture} 
            color="white" 
            roughness={0.5} 
            metalness={0.8} 
            clearcoat={0.3} 
            clearcoatRoughness={0.2} 
          />
        );
        break;
      case 'standard':
      default:
        materialComponent = <meshStandardMaterial map={texture} color="white" />;
    }
  } else {
    // Default material if texture is not yet loaded
    materialComponent = <meshStandardMaterial color="white" />;
  }
  
  return (
    <mesh 
      ref={meshRef} 
      rotation={[rotationX, rotationY, 0]}
      scale={[scale, scale, scale]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[dimensions.width, dimensions.height, 0.1]} />
      {materialComponent}
    </mesh>
  );
};

export default QR3DMesh;
