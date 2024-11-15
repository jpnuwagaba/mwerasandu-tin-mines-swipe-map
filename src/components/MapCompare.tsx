"use client"

import React, { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import MapboxCompare from 'mapbox-gl-compare'
import 'mapbox-gl/dist/mapbox-gl.css'
import 'mapbox-gl-compare/dist/mapbox-gl-compare.css'
import { Menu, Mountain, RefreshCw, ArrowUp, Play } from 'lucide-react'

const MapCompare = () => {
  const mapRef = useRef<{ beforeMap: mapboxgl.Map; afterMap: mapboxgl.Map } | null>(null)
  const beforeMapContainerRef = useRef<HTMLDivElement | null>(null)
  const afterMapContainerRef = useRef<HTMLDivElement | null>(null)
  const comparisonContainerRef = useRef<HTMLDivElement | null>(null)
  const compareRef = useRef<MapboxCompare | null>(null);
  const [isExpanded, setIsExpanded] = useState(false)
  const [is3D, setIs3D] = useState(false)
  const [compassBearing, setCompassBearing] = useState(0)

  const mapStyle: React.CSSProperties = { position: 'absolute', top: 0, bottom: 0, width: '100%' }

  // These values should be adjusted based on the actual bounds of your tileset
  const tilesetBounds: [mapboxgl.LngLatLike, mapboxgl.LngLatLike] = [
    [30.385, -0.996], // Southwest coordinates
    [30.389, -0.992]  // Northeast coordinates
  ]

  const initialView = {
    center: [
      ((tilesetBounds[0] as [number, number])[0] + (tilesetBounds[1] as [number, number])[0]) / 2,
      ((tilesetBounds[0] as [number, number])[1] + (tilesetBounds[1] as [number, number])[1]) / 2
    ] as [number, number],
    zoom: 20,
    pitch: 0,
    bearing: 0
  }

  useEffect(() => {
    if (mapRef.current) return

    mapboxgl.accessToken = 'pk.eyJ1Ijoiam9obnBldGVybnV3YWdhYmEiLCJhIjoiY20zNXQ2cTFxMGJzMDJrcjJ5aGp0bnB4eCJ9.wwYHGrJ4KR2jOXHJqrGSmA'

    const beforeMap = new mapboxgl.Map({
      container: beforeMapContainerRef.current!,
      style: {
        version: 8,
        sources: {},
        layers: []
      },
      ...initialView,
      maxBounds: [(tilesetBounds[0] as [number, number])[0], (tilesetBounds[0] as [number, number])[1], (tilesetBounds[1] as [number, number])[0], (tilesetBounds[1] as [number, number])[1]] as [number, number, number, number],
    })

    const afterMap = new mapboxgl.Map({
      container: afterMapContainerRef.current!,
      style: {
        version: 8,
        sources: {},
        layers: []
      },
      ...initialView,
      maxBounds: tilesetBounds,
    })

    beforeMap.on('load', () => {
      beforeMap.addSource('before-image', {
        type: 'raster',
        url: 'mapbox://johnpeternuwagaba.8yjcd0p6'
      })

      beforeMap.addLayer({
        id: 'before-layer',
        type: 'raster',
        source: 'before-image',
        paint: { 'raster-opacity': 1 }
      })
    })

    afterMap.on('load', () => {
      afterMap.addSource('after-image', {
        type: 'raster',
        url: 'mapbox://johnpeternuwagaba.59sh9dld'
      })

      afterMap.addLayer({
        id: 'after-layer',
        type: 'raster',
        source: 'after-image',
        paint: { 'raster-opacity': 1 }
      })
    })

    const compare = new MapboxCompare(beforeMap, afterMap, comparisonContainerRef.current!, {});
    compareRef.current = compare;

    mapRef.current = { beforeMap, afterMap }

    const updateCompassBearing = () => {
      if (mapRef.current) {
        setCompassBearing(mapRef.current.afterMap.getBearing())
      }
    }

    beforeMap.on('rotate', updateCompassBearing)
    afterMap.on('rotate', updateCompassBearing)

    return () => {
      beforeMap.remove()
      afterMap.remove()
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current) return;

    const { beforeMap, afterMap } = mapRef.current;

    const updateViewState = () => {
      const newIs3D = beforeMap.getPitch() > 0 || afterMap.getPitch() > 0;
      setIs3D(newIs3D);
    };

    beforeMap.on('pitch', updateViewState);
    afterMap.on('pitch', updateViewState);

    return () => {
      beforeMap.off('pitch', updateViewState);
      afterMap.off('pitch', updateViewState);
    };
  }, []);

  const toggle3D = () => {
    if (mapRef.current) {
      const { beforeMap, afterMap } = mapRef.current;
      const newPitch = is3D ? 0 : 60;
      const newBearing = is3D ? 0 : 30;

      beforeMap.easeTo({ pitch: newPitch, bearing: newBearing, duration: 1000 });
      afterMap.easeTo({ pitch: newPitch, bearing: newBearing, duration: 1000 });
    }
  };

  const refreshView = () => {
    if (mapRef.current && compareRef.current) {
      const { beforeMap, afterMap } = mapRef.current;
      beforeMap.easeTo({ ...initialView, duration: 1000 });
      afterMap.easeTo({ ...initialView, duration: 1000 });
      setIs3D(false);
      
      // Reset the swiper position to the middle
      compareRef.current.setSlider(comparisonContainerRef.current!.clientWidth / 2);
    }
  };

  const resetNorth = () => {
    if (mapRef.current) {
      const { beforeMap, afterMap } = mapRef.current
      beforeMap.easeTo({ bearing: 0, duration: 1000 })
      afterMap.easeTo({ bearing: 0, duration: 1000 })
    }
  }

  return (
    <div className="relative h-screen">
      <div ref={comparisonContainerRef} style={mapStyle}>
        <div ref={beforeMapContainerRef} style={mapStyle} />
        <div ref={afterMapContainerRef} style={mapStyle} />
      </div>
      <div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg transition-all duration-300 ease-in-out overflow-hidden flex"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        style={{ 
          width: isExpanded ? 'auto' : '42px',
          height: '42px',
          maxWidth: isExpanded ? '400px' : '42px',
          transition: 'all 0.3s ease-in-out',
          zIndex: 50
        }}
      >
        <div className="flex items-center h-full w-full">
          <button className="p-3 hover:bg-gray-100 transition-colors" aria-label="Menu">
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
          <div className={`h-6 w-px bg-gray-200 mx-1.5 transition-all duration-300 ${isExpanded ? 'opacity-100' : 'w-0 opacity-0'}`} />
          <div className={`flex items-center space-x-1 transition-all duration-300 ${isExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
            <button className="p-3 hover:bg-gray-100 transition-colors text-sm font-medium" onClick={toggle3D} aria-label={is3D ? "Switch to 2D view" : "Switch to 3D view"}>
              {is3D ? '2D' : '3D'}
            </button>
            <button className="p-3 hover:bg-gray-100 transition-colors" onClick={resetNorth} aria-label="Reset to North">
              <ArrowUp
                className="w-5 h-5 text-gray-700 transition-transform duration-300"
                style={{ transform: `rotate(${compassBearing}deg)` }}
              />
            </button>
            <button className="p-3 hover:bg-gray-100 transition-colors" aria-label="Show terrain">
              <Mountain className="w-5 h-5 text-gray-700" />
            </button>
            <button className="p-3 hover:bg-gray-100 transition-colors" aria-label="Start tour">
              <Play className="w-5 h-5 text-gray-700" />
            </button>
            <button className="p-3 hover:bg-gray-100 transition-colors" onClick={refreshView} aria-label="Reset view">
              <RefreshCw className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MapCompare