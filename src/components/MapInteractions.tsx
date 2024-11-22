import React from 'react';
import { Menu, ShuffleIcon as Swipe, Sliders, Play, Layers, Compass, ZoomIn, ZoomOut } from 'lucide-react';

interface MapInteractionsProps {
  toggle3D: () => void;
  resetNorth: () => void;
  is3D: boolean;
  compassBearing: number;
  showMapCompare: () => void;
  showMapSlider: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
}

const MapInteractions: React.FC<MapInteractionsProps> = ({
  toggle3D,
  resetNorth,
  is3D,
  compassBearing,
  showMapCompare,
  showMapSlider,
  zoomIn,
  zoomOut,
}) => {
  return (
    <>
      {/* Middle Buttons */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg transition-all duration-300 ease-in-out overflow-hidden">
        <div className="flex items-center h-full">
          <button className="p-3 hover:bg-gray-100 transition-colors" aria-label="Menu">
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
          <button className="p-3 hover:bg-gray-100 transition-colors" onClick={showMapCompare} aria-label="Swipe">
            <Swipe className="w-5 h-5 text-gray-700" />
          </button>
          <button className="p-3 hover:bg-gray-100 transition-colors" onClick={showMapSlider} aria-label="Slider">
            <Sliders className="w-5 h-5 text-gray-700" />
          </button>
          <button className="p-3 hover:bg-gray-100 transition-colors" aria-label="Animate">
            <Play className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Right Buttons */}
      <div className="absolute bottom-4 right-4 bg-white rounded-full shadow-lg transition-all duration-300 ease-in-out overflow-hidden">
        <div className="flex items-center h-full">
          <button className="p-3 hover:bg-gray-100 transition-colors" aria-label="Layers">
            <Layers className="w-5 h-5 text-gray-700" />
          </button>
          <button className="p-3 hover:bg-gray-100 transition-colors" onClick={toggle3D} aria-label={is3D ? "Switch to 2D view" : "Switch to 3D view"}>
            {is3D ? '2D' : '3D'}
          </button>
          <button className="p-3 hover:bg-gray-100 transition-colors" onClick={resetNorth} aria-label="Reset to North">
            <Compass className="w-5 h-5 text-gray-700" style={{ transform: `rotate(${compassBearing}deg)` }} />
          </button>
          <button className="p-3 hover:bg-gray-100 transition-colors" onClick={zoomIn} aria-label="Zoom in">
            <ZoomIn className="w-5 h-5 text-gray-700" />
          </button>
          <button className="p-3 hover:bg-gray-100 transition-colors" onClick={zoomOut} aria-label="Zoom out">
            <ZoomOut className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
    </>
  );
};

export default MapInteractions;