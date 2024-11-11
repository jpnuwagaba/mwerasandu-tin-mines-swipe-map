declare module 'mapbox-gl-compare' {
  import mapboxgl from 'mapbox-gl';

  class Compare {
    constructor(
      before: mapboxgl.Map,
      after: mapboxgl.Map,
      container: HTMLElement,
      options?: {
        mousemove?: boolean;
        orientation?: 'vertical' | 'horizontal';
      }
    );

    setSlider(x: number): void;
    currentPosition: number;
  }

  export = Compare;
}