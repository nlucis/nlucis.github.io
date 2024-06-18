import * as THREE from 'three';

export default {

  alpha: true,
  antialias: true,
  preserveDrawingBuffer: true,
  powerPreference: 'high-performance',
  depth: false,
  logarithmicDepthBuffer: true,
  precision: 'highp',
  stencil: true,
  failIfMajorPerformanceCaveat: true,
  
} as THREE.WebGLRendererParameters;