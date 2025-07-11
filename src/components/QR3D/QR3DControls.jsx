import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Disc, Compass } from 'lucide-react';

const QR3DControls = ({ animationMode, setAnimationMode, viewMode, setViewMode }) => {
  return (
    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
      <div className="bg-black/50 backdrop-blur-sm rounded-full p-2 flex space-x-2">
        <button
          onClick={() => setAnimationMode('rotate')}
          className={`p-2 rounded-full ${animationMode === 'rotate' 
            ? 'bg-blue-500 text-white' 
            : 'text-white/80 hover:text-white hover:bg-gray-700/50'}`}
          aria-label="Rotate mode"
          title="Rotate mode"
        >
          <Disc className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => setAnimationMode('physics')}
          className={`p-2 rounded-full ${animationMode === 'physics' 
            ? 'bg-blue-500 text-white' 
            : 'text-white/80 hover:text-white hover:bg-gray-700/50'}`}
          aria-label="Physics mode"
          title="Physics mode"
        >
          <Compass className="w-5 h-5" />
        </button>
        
        <div className="w-px h-full bg-gray-600 mx-1"></div>
        
        <button
          onClick={() => setAnimationMode(prev => prev === 'paused' ? 'playing' : 'paused')}
          className="p-2 rounded-full text-white/80 hover:text-white hover:bg-gray-700/50"
          aria-label={animationMode === 'paused' ? 'Play animation' : 'Pause animation'}
          title={animationMode === 'paused' ? 'Play animation' : 'Pause animation'}
        >
          {animationMode === 'paused' ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
        </button>
        
        <button
          onClick={() => {/* Reset animation */}}
          className="p-2 rounded-full text-white/80 hover:text-white hover:bg-gray-700/50"
          aria-label="Reset animation"
          title="Reset animation"
        >
          <SkipBack className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => {/* Fast forward animation */}}
          className="p-2 rounded-full text-white/80 hover:text-white hover:bg-gray-700/50"
          aria-label="Fast forward"
          title="Fast forward"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default QR3DControls;
