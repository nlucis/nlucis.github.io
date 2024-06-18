import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';

// pre-set passes
import { AfterimagePass      } from 'three/examples/jsm/postprocessing/AfterimagePass.js';
import { BloomPass           } from 'three/examples/jsm/postprocessing/BloomPass.js';
import { BokehPass           } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { DotScreenPass       } from 'three/examples/jsm/postprocessing/DotScreenPass.js';
import { FilmPass            } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { GlitchPass          } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { HalftonePass        } from 'three/examples/jsm/postprocessing/HalftonePass.js';
import { MaskPass            } from 'three/examples/jsm/postprocessing/MaskPass.js';
import { OutlinePass         } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { RenderPixelatedPass } from 'three/examples/jsm/postprocessing/RenderPixelatedPass.js';
import { SAOPass             } from 'three/examples/jsm/postprocessing/SAOPass.js';
import { SSRPass             } from 'three/examples/jsm/postprocessing/SSRPass.js';
import { UnrealBloomPass     } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { TexturePass         } from 'three/examples/jsm/postprocessing/TexturePass.js';
import { SavePass            } from 'three/examples/jsm/postprocessing/SavePass.js';
import { ClearPass           } from 'three/examples/jsm/postprocessing/ClearPass.js';
import { TAARenderPass       } from 'three/examples/jsm/postprocessing/TAARenderPass.js';
import { SMAAPass            } from 'three/examples/jsm/postprocessing/SMAAPass.js';

// Color Tuning
import { LUTPass                 } from 'three/examples/jsm/postprocessing/LUTPass.js';

// For passes that use a shader e.g. FXAA or SMAA
import { VignetteShader         } from 'three/examples/jsm/shaders/VignetteShader.js';
import { ShaderPass             } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader             } from 'three/examples/jsm/shaders/FXAAShader.js';
import { TriangleBlurShader     } from 'three/examples/jsm/shaders/TriangleBlurShader.js';
import { DepthLimitedBlurShader } from 'three/examples/jsm/shaders/DepthLimitedBlurShader.js';
import { ColorifyShader         } from 'three/examples/jsm/shaders/ColorifyShader.js';
import {
  Scene,
  Color,
  Vector2,
  Uniform,
  CanvasTexture,
  PerspectiveCamera,
  CineonToneMapping,
} from 'three';
import { SignallingEvents } from '../controllers/_InputController';


// Global Variables
let _currentView: TAARenderPass;
let _canvasTexture: CanvasTexture;

// RedShift - Switches between monochromatic white and red modes depending on ambient brightness
const monochromeRed = new Uniform(new Color(0xFF0000));
const redshiftShader = Object.create(ColorifyShader);
redshiftShader.uniforms.color = monochromeRed;
export const RedShift = new ShaderPass(redshiftShader);


// Screen Static Configuration
const screenStaticShader = {
  uniforms: {
    time: { value: 0.0 },
    noiseColor: { value: new Color(0x2A2A2A) }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    precision highp float;

    uniform float time;
    uniform vec3 noiseColor;

    // Function to generate noise
    float rand(vec2 co) {
      return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
    }

    // Hash function to generate pseudo-random numbers
    float hash(vec2 pran) {
      pran = 50.0 * fract(pran * 0.3183099 + vec2(0.71, 0.113));
      return fract(pran.x * pran.y * (pran.x + pran.y));
    }

    void main() {
      // Generate random offsets to add jitter to the noise pattern
      float offsetX = rand(gl_FragCoord.xy * time);
      float offsetY = rand(gl_FragCoord.yx * time);

      // Add jittered noise to the screen coordinates
      vec2 jitteredCoord = gl_FragCoord.xy + hash(vec2(offsetX, offsetY));

      // Generate noise using the jittered coordinates
      float noise = fract(sin(dot(jitteredCoord + time, vec2(12.9898, 78.233))) * 43758.5453);
    
      // Apply color shift for emulating a phosphor screen's glow
      vec3 color = mix(vec3(0.5, 0.5, 0.5), noiseColor, noise);
    
      gl_FragColor = vec4(color, 1.0);
    }
  `
};
export const ScreenStaticPass = new ShaderPass(screenStaticShader);

// Vignette Configuration
const vignetteOffset = 5;
const vignetteDarkness = 10;
const vignetteShader = Object.create(VignetteShader);
export const Vignette = new ShaderPass(VignetteShader);


// Bloom Configuration
export const Bloom = new UnrealBloomPass(
  /* Resolution */ new Vector2(window.innerWidth, window.innerHeight),
  /* Strength   */ 0.23,
  /* Radius     */ 2.00,
  /* Threshold  */ 0.012,
);


// AfterImage Configuration
export const AfterImage = new AfterimagePass(0.72);


// Retro CRT Visual FX for the "Television Screen"
export const RetroCRT = new FilmPass(0.72, 0.69, window.innerHeight * 1.6, 0);

// Resets the shader clock every 3 seconds to mitigate banding;
setInterval(() => {RetroCRT.uniforms['time'] = new Uniform(0)}, 3000);


// Spectral Morphological Anti-Aliasing to fix over-pixellation caused by scanlines
export const SMAA = new SMAAPass(window.innerWidth, window.innerHeight);

export {
  EffectComposer,
  AfterimagePass,
  BloomPass,
  BokehPass,
  DotScreenPass,
  FilmPass,
  GlitchPass,
  HalftonePass,
  MaskPass,
  OutlinePass,
  RenderPixelatedPass,
  SAOPass,
  SSRPass,
  UnrealBloomPass,
  TexturePass,
  SavePass,
  ClearPass,
  TAARenderPass,
  SMAAPass,
  LUTPass,
}
