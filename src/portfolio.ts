import './controllers/Mandorla';
import '/src/config/tilli.config.mts';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import twoConfig from './config/two.config.mjs';
import threeConfig from './config/three.config.js';
import TWO from 'two.js';
import * as Tone from 'tone';
import { 
  Scene, 
  WebGLRenderer,
  PerspectiveCamera,
  Uniform,
  Mesh,
  MeshBasicMaterial,
  IcosahedronGeometry,
  CanvasTexture,
  ACESFilmicToneMapping,
  Texture,
  ImageLoader,
} from "three";
import {
  AfterImage,
  Bloom,
  EffectComposer,
  FilmPass,
  RedShift,
  RetroCRT,
  ScreenStaticPass,
  SMAA,
  TAARenderPass,
  TexturePass,
  Vignette
} from './config/postprocessing.config.ts'
import { Wrap } from './utils/CalcUtils';
import { SignallingEvents } from './controllers/_InputController';
import { clamp, degToRad } from 'three/src/math/MathUtils.js';

export const TELEVISION = document.getElementById('television') as HTMLCanvasElement;
export const GLASS_SCREEN = document.getElementById('glass-screen') as HTMLDivElement;
export const VIEWPORT: {width: number, height: number, centerX: number, centerY: number, aspectRatio: number} = {
  width: window.innerWidth,
  height: window.innerHeight,
  centerX: window.innerWidth / 2,
  centerY: window.innerHeight / 2,
  aspectRatio: (window.innerWidth >= window.innerHeight) ? 
    window.innerWidth / window.innerHeight : window.innerHeight / window.innerWidth
};
export const eachFrame: (() => void)[] = [];
export let scene3D = new Scene();

const _slQueue:(() => void)[] = [];
export function subLoad (sl: () => void) {_slQueue.push(sl);}


// Main UI
document.addEventListener("DOMContentLoaded", async e => {
  window['SignallingEvents'] = SignallingEvents;

  // Main 2D UI
  let overlay = new TWO({...twoConfig, overdraw: true}).appendTo(GLASS_SCREEN);

  // Emulate audio / visual static
  const audioStatic = new Tone.Noise("brown").set({ volume: -6 }).toDestination();

  // Switch to the default mode (non-static) when ready
  SignallingEvents.on('ready', e => audioStatic.start());

  // Setup - Rendering
  const camera3D = new PerspectiveCamera(35, VIEWPORT.aspectRatio, 1e-1, 1e+3);
  const renderer = new WebGLRenderer({ ...threeConfig, canvas: TELEVISION });
    renderer.setSize(VIEWPORT.width, VIEWPORT.height);
    renderer.setPixelRatio(1);
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.6;
    renderer.setDrawingBufferSize(window.innerWidth, window.innerHeight, 1);

  const composer = new EffectComposer(renderer);

  // Post-Processing Render Passes
  const main = new TAARenderPass(scene3D, camera3D, 0x2A2A2A, 0.9);
  const glow = Bloom;
  const film = RetroCRT;
  const haze = AfterImage;
  const vine = Vignette;
  const smaa = SMAA;
  const fuzz = ScreenStaticPass;

  // FX Stack
  composer.addPass(main);
  composer.addPass(fuzz);
  composer.addPass(glow);
  composer.addPass(film);
  composer.addPass(haze);
  composer.addPass(vine);
  composer.addPass(smaa);

  // Redshift Nighttime Filter
  SignallingEvents.on('redshift:on', () => {
    main.clearColor = 0x000000;
    composer.addPass(RedShift);
  });
  SignallingEvents.on('redshift:off', () => { 
    main.clearColor = 0x1A1A1A;
    composer.removePass(RedShift);
  });

  // Main Render Loop
  renderer.setAnimationLoop(() => {
    fuzz.uniforms.time.value = Wrap(fuzz.uniforms.time.value + 0.001, 0.001, 0.10);
    eachFrame.forEach(cb => cb());
    composer.render();
  });

  // Visual static on no-signal
  if (scene3D.children.length === 0) {
    film.uniforms['nIntensity'] = new Uniform(1.0);
  }

  SignallingEvents.on('ready', e => composer.removePass(fuzz));

  // black framing bezel
  const bezel = overlay.makeRoundedRectangle(
    VIEWPORT.centerX, VIEWPORT.centerY, 
    VIEWPORT.width, VIEWPORT.height, 
    36
  );

  bezel.noFill();
  bezel.stroke = '#000000';
  bezel.linewidth = 36;
  bezel.id = 'bezel';

  SignallingEvents.on('resize', (v: typeof VIEWPORT) => {
    bezel.width = v.width;
    bezel.height = v.height;
    bezel.position.set(v.centerX, v.centerY);
    SMAA.setSize(v.width, v.height);
    RetroCRT.uniforms['scanlinesCount'] = v.height * 2;
  });

  // Start Button Overlay
  const overlayScreen = overlay.makeRectangle(VIEWPORT.centerX, VIEWPORT.centerY, VIEWPORT.width, VIEWPORT.height);
  overlayScreen.noStroke();
  overlayScreen.fill = '#000';
  SignallingEvents.on('ready', e => overlayScreen.remove());

    // Start button
  const orbitalR = overlay.makeCircle(VIEWPORT.centerX, VIEWPORT.centerY, 300, 360);
  orbitalR.noFill();
  orbitalR.stroke = '#fff';
  orbitalR.linewidth = 64;
  orbitalR.cap = 'round';
  orbitalR.join = 'round';
  orbitalR.closed = false;

  const orbitalL = overlay.makeCircle(VIEWPORT.centerX, VIEWPORT.centerY, 300, 360);
  orbitalL.noFill();
  orbitalL.stroke = '#fff';
  orbitalL.linewidth = 64;
  orbitalL.cap = 'round';
  orbitalL.join = 'round';
  orbitalL.closed = false;
  orbitalL.rotation = degToRad(180);

  const outlineInner = overlay.makeCircle(VIEWPORT.centerX, VIEWPORT.centerY, 300 - (64 / 2), 360);
  outlineInner.fill = '#000';
  outlineInner.noStroke();

  const outlineOuter = overlay.makeCircle(VIEWPORT.centerX, VIEWPORT.centerY, 300 + (64 / 2), 360);
  outlineOuter.noFill();
  outlineOuter.linewidth = 1;
  outlineOuter.stroke = '#fff';

  const btn = overlay.makeGroup(orbitalR, outlineInner, outlineOuter);
  let held = false;

  document.body.addEventListener('pointerdown', () => {
    held = true;
    console.debug(held);
  });
  document.body.addEventListener('pointerup', () => {
    held = false;
    console.debug(held);
  });

  outlineInner.linewidth = 1;
  outlineInner.stroke = '#fff';
  
  const rot = 0.03;
  let index = 0.000;
  const max = 0.999;
  const min = 0.000;

  eachFrame.push(() => {
    orbitalR.ending = index;
    orbitalR.beginning = min;
    orbitalL.ending = index;
    orbitalL.beginning = min;
    index = held? clamp(index+rot, min, max / 2) : clamp(index-rot, min, max / 2);
  });
});

// Use this sub-loader for any resources that tend to not be available immediately on DOMContentLoaded
setTimeout(() => _slQueue.forEach(sl => sl()), 1);