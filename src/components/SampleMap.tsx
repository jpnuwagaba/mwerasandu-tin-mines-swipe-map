"use client";

import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const SampleMap = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (mapRef.current) return; // Initialize map only once

    mapboxgl.accessToken = 'pk.eyJ1Ijoiam9obnBldGVybnV3YWdhYmEiLCJhIjoiY20zNXQ2cTFxMGJzMDJrcjJ5aGp0bnB4eCJ9.wwYHGrJ4KR2jOXHJqrGSmA';

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [30.387386,-0.994369],
      zoom: 16,
    });

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  return (
    <div
      ref={mapContainerRef}
      style={{
        width: '100%',
        height: '400px',
      }}
    />
  );
};

export default SampleMap;