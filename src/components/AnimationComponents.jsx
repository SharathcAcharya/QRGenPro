import React from 'react';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Floating geometric shapes */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/5 rounded-full animate-float blur-xl"></div>
      <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-purple-500/5 rounded-full animate-float blur-xl" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/3 rounded-full animate-float blur-2xl" style={{ animationDelay: '2s' }}></div>
      
      {/* Gradient mesh overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-purple-50/20 dark:from-blue-900/10 dark:via-transparent dark:to-purple-900/10"></div>
    </div>
  );
};

const GlassCard = ({ children, className = '', animated = true }) => {
  return (
    <div className={`
      backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 
      border border-gray-200/50 dark:border-gray-700/50 
      rounded-xl shadow-glass 
      ${animated ? 'animate-scale-in' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};

const FloatingElement = ({ children, delay = 0, className = '' }) => {
  return (
    <div 
      className={`animate-float ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
};

const ShimmerEffect = ({ children, className = '' }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
    </div>
  );
};

const PulseGlow = ({ children, className = '', color = 'blue' }) => {
  const glowColors = {
    blue: 'shadow-blue-500/25',
    green: 'shadow-green-500/25',
    purple: 'shadow-purple-500/25',
    red: 'shadow-red-500/25'
  };

  return (
    <div className={`animate-pulse-glow ${glowColors[color]} ${className}`}>
      {children}
    </div>
  );
};

const TypewriterText = ({ text, className = '', speed = 100 }) => {
  const [displayText, setDisplayText] = React.useState('');
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className={className}>
      {displayText}
      {currentIndex < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
};

const MorphingIcon = ({ icons, duration = 2000, className = '' }) => {
  const [currentIconIndex, setCurrentIconIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIconIndex(prev => (prev + 1) % icons.length);
    }, duration);

    return () => clearInterval(interval);
  }, [icons.length, duration]);

  return (
    <div className={`relative ${className}`}>
      {icons.map((Icon, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-500 ${
            index === currentIconIndex 
              ? 'opacity-100 scale-100 rotate-0' 
              : 'opacity-0 scale-75 rotate-45'
          }`}
        >
          <Icon />
        </div>
      ))}
    </div>
  );
};

const AnimatedCounter = ({ end, duration = 1000, suffix = '', className = '' }) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let startTime;
    const start = 0;
    
    const updateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentCount = Math.floor(progress * (end - start) + start);
      setCount(currentCount);
      
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };
    
    requestAnimationFrame(updateCount);
  }, [end, duration]);

  return (
    <span className={className}>
      {count}{suffix}
    </span>
  );
};

const ParallaxContainer = ({ children, speed = 0.5, className = '' }) => {
  const [offset, setOffset] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      setOffset(window.pageYOffset * speed);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div 
      className={className}
      style={{ transform: `translateY(${offset}px)` }}
    >
      {children}
    </div>
  );
};

export {
  AnimatedBackground,
  GlassCard,
  FloatingElement,
  ShimmerEffect,
  PulseGlow,
  TypewriterText,
  MorphingIcon,
  AnimatedCounter,
  ParallaxContainer
};
