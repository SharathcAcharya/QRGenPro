import React, { useEffect, useRef } from 'react';

// Loading animation with QR code pattern
export const QRLoadingAnimation = ({ size = 60, color = '#3b82f6' }) => {
  return (
    <div className="flex items-center justify-center" style={{ height: size, width: size }}>
      <div className="relative">
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-1">
          {/* Corner squares */}
          <div className={`bg-${color} rounded-sm animate-pulse`} style={{ animationDelay: '0ms' }}></div>
          <div></div>
          <div className={`bg-${color} rounded-sm animate-pulse`} style={{ animationDelay: '150ms' }}></div>
          <div></div>
          <div></div>
          <div></div>
          <div className={`bg-${color} rounded-sm animate-pulse`} style={{ animationDelay: '300ms' }}></div>
          <div></div>
          <div className={`bg-${color} rounded-sm animate-pulse`} style={{ animationDelay: '450ms' }}></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`h-1/3 w-1/3 bg-${color} rounded-sm animate-ping opacity-75`} style={{ animationDuration: '1.5s' }}></div>
        </div>
      </div>
    </div>
  );
};

// 3D rotating QR code animation
export const QRRotatingAnimation = ({ children }) => {
  return (
    <div className="perspective-500">
      <div className="animate-rotate-y-slow preserve-3d">
        {children}
      </div>
    </div>
  );
};

// Confetti celebration animation
export const ConfettiAnimation = ({ trigger }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!trigger) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const confettiPieces = [];
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#ef4444', '#f59e0b', '#10b981'];
    
    // Create confetti pieces
    for (let i = 0; i < 200; i++) {
      confettiPieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 10 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 3 + 2,
        angle: Math.random() * 6.28,
        spin: Math.random() * 0.2 - 0.1,
        fadeOut: Math.random() * 0.1 + 0.02
      });
    }
    
    let animationFrame;
    
    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      let stillActive = false;
      
      for (const piece of confettiPieces) {
        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate(piece.angle);
        
        ctx.fillStyle = piece.color;
        ctx.globalAlpha = piece.fadeOut < 0 ? 0 : 1;
        
        ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
        
        ctx.restore();
        
        piece.y += piece.speed;
        piece.angle += piece.spin;
        
        // Fade out when reaching bottom
        if (piece.y > canvas.height) {
          piece.fadeOut -= 0.01;
        }
        
        if (piece.fadeOut > 0) {
          stillActive = true;
        }
      }
      
      if (stillActive) {
        animationFrame = requestAnimationFrame(animate);
      }
    }
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [trigger]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-50"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

// Spotlight animation that follows cursor
export const SpotlightAnimation = () => {
  const spotlightRef = useRef(null);
  
  useEffect(() => {
    const spotlight = spotlightRef.current;
    
    const handleMouseMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      
      spotlight.style.background = `radial-gradient(circle at ${x}px ${y}px, transparent 0%, rgba(0, 0, 0, 0.3) 50%)`;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <div 
      ref={spotlightRef}
      className="fixed inset-0 pointer-events-none opacity-0 dark:opacity-30 transition-opacity duration-300"
    />
  );
};

// Card hover animation
export const AnimatedCard = ({ children, className = "" }) => {
  const cardRef = useRef(null);
  
  useEffect(() => {
    const card = cardRef.current;
    
    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };
    
    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    };
    
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  
  return (
    <div 
      ref={cardRef}
      className={`transition-transform duration-200 ${className}`}
    >
      {children}
    </div>
  );
};

// Glowing border animation
export const GlowingBorder = ({ children, className = "", glowColor = "blue" }) => {
  const colorMap = {
    blue: "from-blue-400 to-purple-500",
    green: "from-green-400 to-emerald-500",
    red: "from-red-400 to-orange-500",
    purple: "from-purple-400 to-pink-500"
  };
  
  const gradientClass = colorMap[glowColor] || colorMap.blue;
  
  return (
    <div className={`relative p-[2px] rounded-xl bg-gradient-to-r ${gradientClass} animate-gradient-shift ${className}`}>
      <div className="absolute inset-0 rounded-xl blur-sm opacity-50 bg-gradient-to-r animate-pulse-slow"></div>
      <div className="relative rounded-xl bg-white dark:bg-gray-800 h-full">
        {children}
      </div>
    </div>
  );
};

// Shimmer loading effect
export const ShimmerEffect = ({ className = "" }) => {
  return (
    <div className={`animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:400%_100%] rounded-lg ${className}`}>
      &nbsp;
    </div>
  );
};

export default {
  QRLoadingAnimation,
  QRRotatingAnimation,
  ConfettiAnimation,
  SpotlightAnimation,
  AnimatedCard,
  GlowingBorder,
  ShimmerEffect
};
