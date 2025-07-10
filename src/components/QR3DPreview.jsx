import React, { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { Box, RotateCw, Download, Share2, Eye, Play, Pause, SkipBack, SkipForward, Settings, Disc, Compass, X, Check, AlertCircle, BarChart3 } from 'lucide-react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, useTexture, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { ThreeJSErrorState } from './LoadingSkeletons';

// QR Code Mesh component that renders the QR code as a 3D object
const QRCodeMesh = React.memo(({ qrImageUrl, animationMode, scale, rotationX, rotationY, previewMode }) => {
  const meshRef = useRef();
  const [textureError, setTextureError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const physicsRef = useRef({ velocity: { x: 0, y: 0, z: 0 }, gravity: 0.01, damping: 0.98, userForce: { x: 0, y: 0 } });
  
  // Mouse interaction for physics mode
  useEffect(() => {
    if (animationMode !== 'physics') return;
    
    const handleMouseMove = (e) => {
      // Convert mouse movement to force
      const forceX = (e.movementX || 0) * 0.01;
      const forceY = (e.movementY || 0) * 0.01;
      
      // Apply force based on mouse movement
      if (physicsRef.current) {
        physicsRef.current.userForce = { x: forceX, y: -forceY };
      }
    };
    
    const handleMouseDown = () => {
      window.addEventListener('mousemove', handleMouseMove);
    };
    
    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (physicsRef.current) {
        physicsRef.current.userForce = { x: 0, y: 0 };
      }
    };
    
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseleave', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [animationMode]);
  
  // Check if device is mobile for level-of-detail adjustments
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768 || 
                             navigator.userAgent.match(/Android/i) || 
                             navigator.userAgent.match(/iPhone|iPad|iPod/i);
      setIsMobile(!!isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Create a simple placeholder data URL for consistent texture loading
  const placeholderDataURL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
  
  // Always call useTexture with a default texture to maintain consistent hook calls
  const texture = useTexture(
    qrImageUrl || placeholderDataURL, 
    // Success callback
    (loadedTexture) => {
      console.log("Texture loaded successfully");
      setTextureError(false);
    },
    // Error callback
    (error) => {
      console.error("Failed to load texture:", error);
      setTextureError(true);
    }
  );
  
  // Prepare texture props based on whether we have a valid texture
  const textureProps = {};
  if (qrImageUrl && !textureError) {
    textureProps.map = texture;
  }
  
  // Material settings based on preview mode - memoized with useCallback
  const getMaterialProps = useCallback(() => {
    switch (previewMode) {
      case 'hologram':
        return {
          transparent: true,
          opacity: 0.8,
          emissive: new THREE.Color(0x00ffff),
          emissiveIntensity: 0.5,
          side: THREE.DoubleSide
        };
      case 'neon':
        return {
          emissive: new THREE.Color(0x00ff00),
          emissiveIntensity: 0.8,
          side: THREE.DoubleSide
        };
      case 'glass':
        return {
          transparent: true,
          opacity: 0.7,
          metalness: 0.3,
          roughness: 0.2,
          clearcoat: 1.0,
          clearcoatRoughness: 0.2,
          side: THREE.DoubleSide
        };
      case 'metal':
        return {
          metalness: 0.9,
          roughness: 0.2,
          side: THREE.DoubleSide
        };
      case 'paper':
        return {
          roughness: 0.8,
          metalness: 0.0,
          side: THREE.DoubleSide
        };
      case 'wood':
        return {
          roughness: 0.7,
          metalness: 0.1,
          color: new THREE.Color(0x5d4037),
          side: THREE.DoubleSide
        };
      case 'plastic':
        return {
          roughness: 0.4,
          metalness: 0.2,
          clearcoat: 0.8,
          clearcoatRoughness: 0.2,
          color: new THREE.Color(0xf5f5f5),
          side: THREE.DoubleSide
        };
      default:
        return {
          side: THREE.DoubleSide
        };
    }
  }, [previewMode]);
  
  // Handle animations - using useCallback to memoize the function
  const animateFrame = useCallback((state, delta) => {
    if (!meshRef.current) return;
    
    // Animation modes
    switch (animationMode) {
      case 'rotate':
        meshRef.current.rotation.y += delta * 0.5;
        break;
      case 'pulse':
        meshRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
        meshRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
        meshRef.current.scale.z = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
        break;
      case 'float':
        meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
        meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.7) * 0.2;
        meshRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.5) * 0.2;
        break;
      case 'flip':
        meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * Math.PI;
        break;
      case 'wave':
        meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.3;
        meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 1.5) * 0.3;
        break;
      case 'bounce':
        // Bouncing animation with gravity-like effect
        meshRef.current.position.y = Math.abs(Math.sin(state.clock.elapsedTime * 3)) * 0.3;
        // Slight squash when hitting the bottom
        const bouncePhase = Math.sin(state.clock.elapsedTime * 3);
        if (bouncePhase < 0) {
          const squashFactor = Math.abs(bouncePhase) * 0.1;
          meshRef.current.scale.y = Math.max(0.9, 1 - squashFactor);
          meshRef.current.scale.x = Math.min(1.1, 1 + squashFactor * 0.5);
          meshRef.current.scale.z = Math.min(1.1, 1 + squashFactor * 0.5);
        } else {
          meshRef.current.scale.y = 1;
          meshRef.current.scale.x = 1;
          meshRef.current.scale.z = 1;
        }
        break;
      case 'spiral':
        // Spiral rotation animation
        const spiralTime = state.clock.elapsedTime;
        meshRef.current.rotation.x = Math.sin(spiralTime) * 0.5;
        meshRef.current.rotation.y = Math.cos(spiralTime) * 0.5;
        meshRef.current.rotation.z += delta * 0.3;
        // Add some movement in a spiral pattern
        const spiralRadius = 0.2;
        meshRef.current.position.x = Math.cos(spiralTime * 2) * spiralRadius;
        meshRef.current.position.z = Math.sin(spiralTime * 2) * spiralRadius;
        break;
      case 'physics':
        // Physics-based interaction
        if (!physicsRef.current) break;
        
        // Apply user force to velocity
        physicsRef.current.velocity.x += physicsRef.current.userForce.x;
        physicsRef.current.velocity.y += physicsRef.current.userForce.y;
        
        // Apply gravity (always pulling back to center)
        const centerPullX = -meshRef.current.position.x * physicsRef.current.gravity;
        const centerPullY = -meshRef.current.position.y * physicsRef.current.gravity;
        
        physicsRef.current.velocity.x += centerPullX;
        physicsRef.current.velocity.y += centerPullY;
        
        // Apply damping
        physicsRef.current.velocity.x *= physicsRef.current.damping;
        physicsRef.current.velocity.y *= physicsRef.current.damping;
        
        // Update position
        meshRef.current.position.x += physicsRef.current.velocity.x;
        meshRef.current.position.y += physicsRef.current.velocity.y;
        
        // Apply rotational velocity based on movement
        meshRef.current.rotation.x += physicsRef.current.velocity.y * 0.5;
        meshRef.current.rotation.y += physicsRef.current.velocity.x * 0.5;
        
        // Add slight wobble
        meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.1;
        break;
      case 'none':
        // Apply manual rotation from props
        meshRef.current.rotation.x = THREE.MathUtils.degToRad(rotationX);
        meshRef.current.rotation.y = THREE.MathUtils.degToRad(rotationY);
        break;
    }
  }, [animationMode, rotationX, rotationY]);
  
  // Use frame with the memoized callback
  useFrame(animateFrame);
  
  // Calculate geometry segments based on device capability
  const getGeometryDetail = () => {
    // Lower segments for mobile devices to improve performance
    if (isMobile) {
      return {
        width: 1,
        height: 1,
        depth: 1
      };
    }
    
    // Higher detail for desktop
    return {
      width: 2,
      height: 2,
      depth: 2
    };
  };
  
  // Get geometry detail based on device
  const geometryDetail = getGeometryDetail();
  
  return (
    <mesh ref={meshRef} scale={[scale, scale, scale * 0.1]}>
      <boxGeometry args={[2, 2, 0.1, geometryDetail.width, geometryDetail.height, geometryDetail.depth]} />
      <meshStandardMaterial
        color={!textureProps.map ? "#3b82f6" : undefined}
        {...textureProps}
        {...getMaterialProps()}
      />
    </mesh>
  );
});

// Error Boundary for Three.js canvas
class ThreeJSErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ThreeJS Error:", error, errorInfo);
    this.setState({ errorInfo: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return <ThreeJSErrorState 
        message={`An error occurred while rendering the 3D preview. ${this.state.errorInfo ? 'Check console for details.' : ''}`} 
      />;
    }

    return this.props.children;
  }
}

// Scene setup component
const Scene = React.memo(({ qrImageUrl, animationMode, scale, rotationX, rotationY, previewMode }) => {
  const { gl, camera } = useThree();
  
  useEffect(() => {
    // Set renderer properties
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Set camera position
    camera.position.z = 4;
    camera.lookAt(0, 0, 0);
  }, [gl, camera]);
  
  // Update performance info if available
  useFrame(() => {
    if (window.performanceMonitorRef && window.performanceMonitorRef.current) {
      window.performanceMonitorRef.current.update();
    }
  });
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      
      <QRCodeMesh
        qrImageUrl={qrImageUrl}
        animationMode={animationMode}
        scale={scale}
        rotationX={rotationX}
        rotationY={rotationY}
        previewMode={previewMode}
      />
      
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableRotate={animationMode === 'none'}
        zoomSpeed={0.5}
      />
    </>
  );
});

// Main component
const QR3DPreview = ({ qrCode, qrRef, url, logoImage, options }) => {
  const [is3DMode, setIs3DMode] = useState(false);
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const [animationMode, setAnimationMode] = useState('none');
  const [isAnimating, setIsAnimating] = useState(false);
  const [previewMode, setPreviewMode] = useState('normal');
  const [scale, setScale] = useState(1);
  const [qrImageUrl, setQrImageUrl] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [renderError, setRenderError] = useState(null);
  const [showPerformanceStats, setShowPerformanceStats] = useState(false);
  const [performanceInfo, setPerformanceInfo] = useState({ fps: 0, cpu: 0, memory: 0 });
  const [browserSupport, setBrowserSupport] = useState({
    checked: false,
    supported: true,
    details: null
  });
  
  const container3DRef = useRef(null);
  const canvasRef = useRef(null);
  const hiddenContainerRef = useRef(null);
  const performanceMonitorRef = useRef(null);

  const animationModes = [
    { id: 'none', name: 'Static', description: 'No animation' },
    { id: 'rotate', name: 'Rotate', description: 'Continuous rotation' },
    { id: 'pulse', name: 'Pulse', description: 'Scale pulsing effect' },
    { id: 'float', name: 'Float', description: 'Floating motion' },
    { id: 'flip', name: 'Flip', description: 'Card flip effect' },
    { id: 'wave', name: 'Wave', description: 'Wave distortion' },
    { id: 'bounce', name: 'Bounce', description: 'Bouncing animation' },
    { id: 'spiral', name: 'Spiral', description: 'Spiral rotation' },
    { id: 'physics', name: 'Physics', description: 'Interactive physics' }
  ];

  const previewModes = [
    { id: 'normal', name: 'Normal', description: 'Standard view' },
    { id: 'hologram', name: 'Hologram', description: 'Holographic effect' },
    { id: 'neon', name: 'Neon', description: 'Neon glow effect' },
    { id: 'glass', name: 'Glass', description: 'Glass morphism' },
    { id: 'metal', name: 'Metal', description: 'Metallic finish' },
    { id: 'paper', name: 'Paper', description: 'Paper texture' },
    { id: 'wood', name: 'Wood', description: 'Wooden texture' },
    { id: 'plastic', name: 'Plastic', description: 'Plastic material' }
  ];

  // Check browser compatibility
  useEffect(() => {
    if (browserSupport.checked) return;
    
    try {
      // Check for WebGL support
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) {
        setBrowserSupport({
          checked: true,
          supported: false,
          details: "WebGL not supported. Try using an updated browser."
        });
        return;
      }
      
      // Check if browser supports modern WebGL features
      const isChrome = navigator.userAgent.indexOf('Chrome') > -1;
      const isFirefox = navigator.userAgent.indexOf('Firefox') > -1;
      const isSafari = navigator.userAgent.indexOf('Safari') > -1 && !isChrome;
      const isEdge = navigator.userAgent.indexOf('Edg') > -1;
      
      let browserInfo = "Optimal experience on Chrome, Edge, Firefox or Safari.";
      if (isChrome) browserInfo = "Chrome detected. Full support.";
      if (isFirefox) browserInfo = "Firefox detected. Full support.";
      if (isSafari) browserInfo = "Safari detected. Some features may have limited support.";
      if (isEdge) browserInfo = "Edge detected. Full support.";
      
      setBrowserSupport({
        checked: true,
        supported: true,
        details: browserInfo
      });
    } catch (error) {
      console.error("Error checking WebGL support:", error);
      setBrowserSupport({
        checked: true,
        supported: false,
        details: "Error checking WebGL support: " + error.message
      });
    }
  }, [browserSupport.checked]);
  
  useEffect(() => {
    // Make performance monitor accessible for Scene component
    if (performanceMonitorRef.current) {
      window.performanceMonitorRef = performanceMonitorRef;
    }
    
    return () => {
      window.performanceMonitorRef = null;
    };
  }, [performanceMonitorRef]);
  
  // Create a dedicated div for QR code rendering
  useEffect(() => {
    if (!hiddenContainerRef.current) {
      // Create a hidden container for QR code rendering
      const hiddenContainer = document.createElement('div');
      hiddenContainer.style.position = 'absolute';
      hiddenContainer.style.left = '-9999px';
      hiddenContainer.style.top = '-9999px';
      hiddenContainer.id = 'qr-3d-render-container';
      document.body.appendChild(hiddenContainer);
      hiddenContainerRef.current = hiddenContainer;
      
      return () => {
        if (hiddenContainerRef.current && document.body.contains(hiddenContainerRef.current)) {
          document.body.removeChild(hiddenContainerRef.current);
        }
      };
    }
  }, []);
  
  // Function to create a fallback image if QR code generation fails
  const createFallbackImage = () => {
    console.log("QR3DPreview: Creating fallback image");
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      
      // Create a gradient blue background
      const gradient = ctx.createLinearGradient(0, 0, 300, 300);
      gradient.addColorStop(0, '#3b82f6');
      gradient.addColorStop(1, '#1e40af');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 300, 300);
      
      // Add text
      ctx.fillStyle = 'white';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('QR Code Preview', 150, 150);
      
      const url = canvas.toDataURL('image/png');
      setQrImageUrl(url);
      setIs3DMode(true);
      return url;
    } catch (error) {
      console.error("QR3DPreview: Error creating fallback image:", error);
      setRenderError("Failed to create even a fallback image. Please try refreshing the page.");
      return null;
    }
  };
  
  // Generate a data URL from the QR code
  useEffect(() => {
    console.log("QR3DPreview: Received qrCode", !!qrCode);
    setRenderError(null); // Reset error state on new attempt
    
    if (qrCode && hiddenContainerRef.current) {
      try {
        // Clear the container
        hiddenContainerRef.current.innerHTML = '';
        
        // Clone the QR code to avoid affecting the original
        const qrClone = new (Object.getPrototypeOf(qrCode).constructor)(options);
        qrClone.update({
          ...options,
          data: url || 'https://example.com',
          image: logoImage || ''
        });
        
        // Append the QR code to hidden container
        qrClone.append(hiddenContainerRef.current);
        
        // Convert to image URL after a brief delay to ensure rendering
        setTimeout(() => {
          try {
            const svg = hiddenContainerRef.current.querySelector('svg');
            if (svg) {
              console.log("QR3DPreview: Found SVG element");
              
              // Set SVG attributes explicitly to ensure proper rendering
              svg.setAttribute('width', '300');
              svg.setAttribute('height', '300');
              
              const svgData = new XMLSerializer().serializeToString(svg);
              const blob = new Blob([svgData], { type: 'image/svg+xml' });
              const url = URL.createObjectURL(blob);
              console.log("QR3DPreview: Generated image URL", url.substring(0, 30) + "...");
              
              // Test if the image loads correctly
              const testImg = new Image();
              testImg.onload = () => {
                console.log("QR3DPreview: SVG loaded successfully as image");
                setQrImageUrl(url);
                setIs3DMode(true);
              };
              testImg.onerror = () => {
                console.error("QR3DPreview: SVG failed to load as image, creating fallback");
                URL.revokeObjectURL(url); // Clean up the blob URL
                createFallbackImage();
              };
              testImg.src = url;
            } else {
              console.warn("QR3DPreview: No SVG element found in QR code ref");
              createFallbackImage();
            }
          } catch (error) {
            console.error("QR3DPreview: Error converting QR code to image URL:", error);
            createFallbackImage();
          }
        }, 500); // Increase delay to ensure SVG is fully rendered
      } catch (error) {
        console.error("QR3DPreview: Error appending QR code:", error);
        createFallbackImage();
      }
    } else {
      // No QR code available
      console.warn("QR3DPreview: No QR code available");
      if (!qrCode) {
        setRenderError("No QR code available. Please generate a QR code first.");
      } else if (!hiddenContainerRef.current) {
        setRenderError("Failed to initialize rendering container.");
      }
      setQrImageUrl(null);
    }
    
    // Cleanup function
    return () => {
      if (qrImageUrl) {
        try {
          URL.revokeObjectURL(qrImageUrl);
        } catch (e) {
          // Ignore errors from non-blob URLs
        }
      }
    };
  }, [qrCode, options, url, logoImage]);

  // Toggle animation
  const toggleAnimation = () => {
    if (animationMode === 'none') {
      // If no animation mode is selected, pick a default one
      setAnimationMode('rotate');
    }
    setIsAnimating(!isAnimating);
  };

  // Change animation mode
  const handleAnimationModeChange = (mode) => {
    setAnimationMode(mode);
    if (mode !== 'none' && !isAnimating) {
      setIsAnimating(true);
    }
  };

  // Toggle 3D mode
  const toggle3DMode = () => {
    setIs3DMode(!is3DMode);
    if (!is3DMode) {
      // Reset rotation when entering 3D mode
      setRotationX(0);
      setRotationY(0);
    }
  };

  // Create a snapshot of the 3D view
  const captureSnapshot = () => {
    if (canvasRef.current) {
      try {
        const dataUrl = canvasRef.current.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'qrcode-3d.png';
        link.click();
      } catch (error) {
        console.error("Failed to capture snapshot:", error);
        alert("Failed to capture snapshot. Try a different browser or disable any content blockers.");
      }
    }
  };

  // Add keyboard controls for accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only apply keyboard controls when 3D mode is active
      if (!is3DMode) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          // Rotate left
          setRotationY(prev => prev - 10);
          break;
        case 'ArrowRight':
          // Rotate right
          setRotationY(prev => prev + 10);
          break;
        case 'ArrowUp':
          // Rotate up
          setRotationX(prev => prev - 10);
          break;
        case 'ArrowDown':
          // Rotate down
          setRotationX(prev => prev + 10);
          break;
        case '+':
        case '=':
          // Increase scale
          setScale(prev => Math.min(prev + 0.1, 2));
          break;
        case '-':
          // Decrease scale
          setScale(prev => Math.max(prev - 0.1, 0.5));
          break;
        case 'p':
        case 'P':
          // Toggle animation
          toggleAnimation();
          break;
        case 's':
        case 'S':
          // Toggle settings
          setShowSettings(prev => !prev);
          break;
        case 'd':
        case 'D':
          // Download/capture snapshot
          captureSnapshot();
          break;
        default:
          return;
      }
      
      // Prevent default browser behavior for these keys when in 3D mode
      e.preventDefault();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [is3DMode, toggleAnimation, captureSnapshot, setRotationX, setRotationY, setScale]);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg">
            <Box className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              3D QR Preview
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              View your QR code in interactive 3D with animation effects
            </p>
          </div>
        </div>
        
        {/* Browser Compatibility Info */}
        {browserSupport.checked && (
          <div className={`mb-3 p-2 text-xs rounded-lg ${
            browserSupport.supported 
              ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300' 
              : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300'
          }`}>
            <div className="flex items-center">
              {browserSupport.supported ? (
                <Check className="w-3 h-3 mr-1 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
              )}
              <span>{browserSupport.details}</span>
            </div>
          </div>
        )}
        
        {/* Error Message */}
        {renderError && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-700 dark:text-red-300">{renderError}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* 3D View Toggle */}
        <div className="flex justify-center items-center mb-4 gap-3">
          <button
            onClick={toggle3DMode}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              is3DMode 
                ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            aria-label={is3DMode ? 'Switch to 2D view' : 'Switch to 3D view'}
          >
            <Box className="w-4 h-4" />
            <span>{is3DMode ? '3D View Active' : 'Enable 3D View'}</span>
          </button>
          
          {/* Accessibility note */}
          <button
            type="button"
            className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm"
            onClick={() => {
              alert(
                "Keyboard Controls:\n" +
                "- Arrow keys: Rotate the QR code\n" +
                "- + / - keys: Increase/decrease size\n" +
                "- P key: Play/pause animation\n" +
                "- S key: Toggle settings\n" +
                "- D key: Download image\n\n" +
                "If you experience performance issues, try switching to 2D view or disabling animations."
              );
            }}
            aria-label="Show accessibility options"
          >
            <span className="underline">Accessibility Options</span>
          </button>
          
          {/* Test Error Handling (developer mode) */}
          {import.meta.env.DEV && (
            <button
              type="button"
              className="text-xs text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300"
              onClick={() => {
                // Simulate different errors for testing
                const errorType = prompt("Test error type (1: Render Error, 2: Texture Error, 3: WebGL Context Loss):", "1");
                
                switch (errorType) {
                  case "1":
                    setRenderError("This is a test render error. The app is functioning correctly; this is just for testing error handling.");
                    break;
                  case "2":
                    // Force texture error
                    setQrImageUrl("invalid-url-to-force-error");
                    break;
                  case "3":
                    // Try to simulate WebGL context loss (may not work in all browsers)
                    if (canvasRef.current) {
                      const gl = canvasRef.current.getContext('webgl');
                      if (gl && gl.getExtension('WEBGL_lose_context')) {
                        gl.getExtension('WEBGL_lose_context').loseContext();
                      } else {
                        alert("WebGL context loss simulation not supported in this browser");
                      }
                    }
                    break;
                  default:
                    alert("No error simulated");
                }
              }}
              aria-label="Test error handling (developer only)"
            >
              DEV: Test Errors
            </button>
          )}
        </div>
        
        {/* 3D Preview */}
        {is3DMode ? (
          <div ref={container3DRef} className="relative h-80 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            {/* Three.js Canvas with Error Boundary */}
            <ThreeJSErrorBoundary>
              {qrImageUrl ? (
                <Canvas 
                  ref={canvasRef} 
                  shadows 
                  dpr={[1, 2]}
                  gl={{ 
                    powerPreference: "high-performance",
                    alpha: false,
                    antialias: true,
                    stencil: false,
                    depth: true
                  }}
                  frameloop={isAnimating ? "always" : "demand"}
                  onCreated={({ gl }) => {
                    // Handle context events properly using the WebGL canvas
                    const canvas = gl.domElement;
                    
                    // Start performance monitoring
                    let frameCount = 0;
                    let lastTime = performance.now();
                    
                    // Create performance monitor
                    performanceMonitorRef.current = {
                      update: () => {
                        frameCount++;
                        const now = performance.now();
                        
                        // Update every second
                        if (now - lastTime > 1000) {
                          const fps = Math.round((frameCount * 1000) / (now - lastTime));
                          
                          // Get memory info if available
                          let memory = 0;
                          if (window.performance && window.performance.memory) {
                            memory = Math.round(window.performance.memory.usedJSHeapSize / (1024 * 1024));
                          }
                          
                          // Update performance stats
                          setPerformanceInfo({
                            fps,
                            memory,
                            renderer: gl.info.render
                          });
                          
                          frameCount = 0;
                          lastTime = now;
                        }
                      }
                    };
                    
                    // Set up WebGL context event handlers
                    canvas.addEventListener('webglcontextlost', (event) => {
                      console.log("WebGL context lost, attempting to restore");
                      event.preventDefault();
                      
                      // Try to restore context automatically
                      setTimeout(() => {
                        if (canvas) {
                          try {
                            // Force a redraw
                            const style = canvas.style.display;
                            canvas.style.display = 'none';
                            setTimeout(() => { canvas.style.display = style; }, 50);
                          } catch (e) {
                            console.error("Failed to restore context:", e);
                          }
                        }
                      }, 500);
                    });
                    
                    canvas.addEventListener('webglcontextrestored', () => {
                      console.log("WebGL context restored successfully");
                    });
                  }}
                >
                  <Suspense fallback={<Html center>Loading 3D view...</Html>}>
                    <Scene
                      qrImageUrl={qrImageUrl}
                      animationMode={isAnimating ? animationMode : 'none'}
                      scale={scale}
                      rotationX={rotationX}
                      rotationY={rotationY}
                      previewMode={previewMode}
                    />
                  </Suspense>
                </Canvas>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center p-4">
                    <div className="text-gray-500 dark:text-gray-400 mb-2">No QR code available</div>
                    <p className="text-sm text-gray-600 dark:text-gray-500">
                      Please generate a QR code first to view it in 3D.
                    </p>
                  </div>
                </div>
              )}
            </ThreeJSErrorBoundary>
            
            {/* Controls Overlay */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <div className="bg-white dark:bg-gray-800 rounded-full shadow-lg px-4 py-2 flex items-center space-x-3">
                {isAnimating ? (
                  <button
                    onClick={toggleAnimation}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-red-600 text-white"
                    aria-label="Pause animation"
                  >
                    <Pause className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={toggleAnimation}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-green-600 text-white"
                    aria-label="Play animation"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                )}
                
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  aria-label="Animation settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
                
                <button
                  onClick={captureSnapshot}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white"
                  aria-label="Download snapshot"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setShowPerformanceStats(!showPerformanceStats)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full ${
                    showPerformanceStats 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                  aria-label="Show performance stats"
                >
                  <BarChart3 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Performance Stats */}
            {showPerformanceStats && (
              <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 rounded-lg shadow-lg p-2 text-xs">
                <div className="text-gray-800 dark:text-gray-200 font-mono">
                  <div>FPS: {performanceInfo.fps}</div>
                  {performanceInfo.memory > 0 && <div>Memory: {performanceInfo.memory} MB</div>}
                  {performanceInfo.renderer && (
                    <>
                      <div>Triangles: {performanceInfo.renderer.triangles}</div>
                      <div>Calls: {performanceInfo.renderer.calls}</div>
                    </>
                  )}
                </div>
              </div>
            )}
            
            {/* Settings Panel */}
            {showSettings && (
              <div className="absolute top-4 right-4 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">3D Settings</h4>
                  <button 
                    onClick={() => setShowSettings(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {/* Animation Mode */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Animation
                    </label>
                    <select
                      value={animationMode}
                      onChange={(e) => handleAnimationModeChange(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
                    >
                      {animationModes.map((mode) => (
                        <option key={mode.id} value={mode.id}>
                          {mode.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Style Mode */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Style
                    </label>
                    <select
                      value={previewMode}
                      onChange={(e) => setPreviewMode(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
                    >
                      {previewModes.map((mode) => (
                        <option key={mode.id} value={mode.id}>
                          {mode.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Scale Slider */}
                  <div>
                    <label className="flex justify-between text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <span>Scale</span>
                      <span>{scale.toFixed(1)}x</span>
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={scale}
                      onChange={(e) => setScale(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  {/* Keyboard Shortcuts */}
                  <div className="mt-2">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Keyboard Shortcuts:
                    </p>
                    <div className="text-xs text-gray-600 dark:text-gray-400 grid grid-cols-2 gap-x-2 gap-y-1">
                      <div>← → Rotate</div>
                      <div>↑ ↓ Tilt</div>
                      <div>+ - Scale</div>
                      <div>P Toggle play</div>
                      <div>S Settings</div>
                      <div>D Download</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          // 2D Preview (fallback)
          <div className="h-80 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-600">
              {qrImageUrl ? (
                <img 
                  src={qrImageUrl} 
                  alt="QR Code" 
                  className="max-h-64"
                />
              ) : (
                <div className="flex items-center justify-center h-64 w-64">
                  <p className="text-gray-500 dark:text-gray-400">QR Code loading...</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Quick Presets */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Quick View Presets
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {previewModes.slice(0, 3).map((mode) => (
              <button
                key={mode.id}
                onClick={() => {
                  setPreviewMode(mode.id);
                  if (!is3DMode) setIs3DMode(true);
                }}
                className={`p-3 border rounded-lg text-center transition-all ${
                  previewMode === mode.id && is3DMode
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="flex flex-col items-center">
                  {mode.id === 'normal' ? (
                    <Disc className="w-6 h-6 mb-1 text-gray-700 dark:text-gray-300" />
                  ) : mode.id === 'hologram' ? (
                    <Box className="w-6 h-6 mb-1 text-blue-500" />
                  ) : mode.id === 'neon' ? (
                    <Compass className="w-6 h-6 mb-1 text-green-500" />
                  ) : (
                    <Box className="w-6 h-6 mb-1" />
                  )}
                  <span className="text-sm">{mode.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Quick Animation Presets */}
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Quick Animation Presets
          </h4>
          <div className="grid grid-cols-4 gap-2">
            {animationModes.slice(1, 5).map((mode) => (
              <button
                key={mode.id}
                onClick={() => {
                  handleAnimationModeChange(mode.id);
                  if (!is3DMode) setIs3DMode(true);
                  if (!isAnimating) setIsAnimating(true);
                }}
                className={`p-3 border rounded-lg text-center transition-all ${
                  animationMode === mode.id && isAnimating && is3DMode
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="text-sm">{mode.name}</span>
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-4 gap-2 mt-2">
            {animationModes.slice(5, 9).map((mode) => (
              <button
                key={mode.id}
                onClick={() => {
                  handleAnimationModeChange(mode.id);
                  if (!is3DMode) setIs3DMode(true);
                  if (!isAnimating) setIsAnimating(true);
                }}
                className={`p-3 border rounded-lg text-center transition-all ${
                  animationMode === mode.id && isAnimating && is3DMode
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="text-sm">{mode.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QR3DPreview;
