"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LUTPass = exports.SMAAPass = exports.TAARenderPass = exports.ClearPass = exports.SavePass = exports.TexturePass = exports.UnrealBloomPass = exports.SSRPass = exports.SAOPass = exports.RenderPixelatedPass = exports.OutlinePass = exports.MaskPass = exports.HalftonePass = exports.GlitchPass = exports.FilmPass = exports.DotScreenPass = exports.BokehPass = exports.BloomPass = exports.AfterimagePass = exports.EffectComposer = exports.SMAA = exports.RetroCRT = exports.AfterImage = exports.Bloom = exports.Vignette = exports.ScreenStaticPass = exports.RedShift = void 0;
const EffectComposer_js_1 = require("three/examples/jsm/postprocessing/EffectComposer.js");
Object.defineProperty(exports, "EffectComposer", { enumerable: true, get: function () { return EffectComposer_js_1.EffectComposer; } });
// pre-set passes
const AfterimagePass_js_1 = require("three/examples/jsm/postprocessing/AfterimagePass.js");
Object.defineProperty(exports, "AfterimagePass", { enumerable: true, get: function () { return AfterimagePass_js_1.AfterimagePass; } });
const BloomPass_js_1 = require("three/examples/jsm/postprocessing/BloomPass.js");
Object.defineProperty(exports, "BloomPass", { enumerable: true, get: function () { return BloomPass_js_1.BloomPass; } });
const BokehPass_js_1 = require("three/examples/jsm/postprocessing/BokehPass.js");
Object.defineProperty(exports, "BokehPass", { enumerable: true, get: function () { return BokehPass_js_1.BokehPass; } });
const DotScreenPass_js_1 = require("three/examples/jsm/postprocessing/DotScreenPass.js");
Object.defineProperty(exports, "DotScreenPass", { enumerable: true, get: function () { return DotScreenPass_js_1.DotScreenPass; } });
const FilmPass_js_1 = require("three/examples/jsm/postprocessing/FilmPass.js");
Object.defineProperty(exports, "FilmPass", { enumerable: true, get: function () { return FilmPass_js_1.FilmPass; } });
const GlitchPass_js_1 = require("three/examples/jsm/postprocessing/GlitchPass.js");
Object.defineProperty(exports, "GlitchPass", { enumerable: true, get: function () { return GlitchPass_js_1.GlitchPass; } });
const HalftonePass_js_1 = require("three/examples/jsm/postprocessing/HalftonePass.js");
Object.defineProperty(exports, "HalftonePass", { enumerable: true, get: function () { return HalftonePass_js_1.HalftonePass; } });
const MaskPass_js_1 = require("three/examples/jsm/postprocessing/MaskPass.js");
Object.defineProperty(exports, "MaskPass", { enumerable: true, get: function () { return MaskPass_js_1.MaskPass; } });
const OutlinePass_js_1 = require("three/examples/jsm/postprocessing/OutlinePass.js");
Object.defineProperty(exports, "OutlinePass", { enumerable: true, get: function () { return OutlinePass_js_1.OutlinePass; } });
const RenderPixelatedPass_js_1 = require("three/examples/jsm/postprocessing/RenderPixelatedPass.js");
Object.defineProperty(exports, "RenderPixelatedPass", { enumerable: true, get: function () { return RenderPixelatedPass_js_1.RenderPixelatedPass; } });
const SAOPass_js_1 = require("three/examples/jsm/postprocessing/SAOPass.js");
Object.defineProperty(exports, "SAOPass", { enumerable: true, get: function () { return SAOPass_js_1.SAOPass; } });
const SSRPass_js_1 = require("three/examples/jsm/postprocessing/SSRPass.js");
Object.defineProperty(exports, "SSRPass", { enumerable: true, get: function () { return SSRPass_js_1.SSRPass; } });
const UnrealBloomPass_js_1 = require("three/examples/jsm/postprocessing/UnrealBloomPass.js");
Object.defineProperty(exports, "UnrealBloomPass", { enumerable: true, get: function () { return UnrealBloomPass_js_1.UnrealBloomPass; } });
const TexturePass_js_1 = require("three/examples/jsm/postprocessing/TexturePass.js");
Object.defineProperty(exports, "TexturePass", { enumerable: true, get: function () { return TexturePass_js_1.TexturePass; } });
const SavePass_js_1 = require("three/examples/jsm/postprocessing/SavePass.js");
Object.defineProperty(exports, "SavePass", { enumerable: true, get: function () { return SavePass_js_1.SavePass; } });
const ClearPass_js_1 = require("three/examples/jsm/postprocessing/ClearPass.js");
Object.defineProperty(exports, "ClearPass", { enumerable: true, get: function () { return ClearPass_js_1.ClearPass; } });
const TAARenderPass_js_1 = require("three/examples/jsm/postprocessing/TAARenderPass.js");
Object.defineProperty(exports, "TAARenderPass", { enumerable: true, get: function () { return TAARenderPass_js_1.TAARenderPass; } });
const SMAAPass_js_1 = require("three/examples/jsm/postprocessing/SMAAPass.js");
Object.defineProperty(exports, "SMAAPass", { enumerable: true, get: function () { return SMAAPass_js_1.SMAAPass; } });
// Color Tuning
const LUTPass_js_1 = require("three/examples/jsm/postprocessing/LUTPass.js");
Object.defineProperty(exports, "LUTPass", { enumerable: true, get: function () { return LUTPass_js_1.LUTPass; } });
// For passes that use a shader e.g. FXAA or SMAA
const VignetteShader_js_1 = require("three/examples/jsm/shaders/VignetteShader.js");
const ShaderPass_js_1 = require("three/examples/jsm/postprocessing/ShaderPass.js");
const ColorifyShader_js_1 = require("three/examples/jsm/shaders/ColorifyShader.js");
const three_1 = require("three");
// Global Variables
let _currentView;
let _canvasTexture;
// RedShift - Switches between monochromatic white and red modes depending on ambient brightness
const monochromeRed = new three_1.Uniform(new three_1.Color(0xFF0000));
const redshiftShader = Object.create(ColorifyShader_js_1.ColorifyShader);
redshiftShader.uniforms.color = monochromeRed;
exports.RedShift = new ShaderPass_js_1.ShaderPass(redshiftShader);
// Screen Static Configuration
const screenStaticShader = {
    uniforms: {
        time: { value: 0.0 },
        noiseColor: { value: new three_1.Color(0x2A2A2A) }
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
exports.ScreenStaticPass = new ShaderPass_js_1.ShaderPass(screenStaticShader);
// Vignette Configuration
const vignetteOffset = 5;
const vignetteDarkness = 10;
const vignetteShader = Object.create(VignetteShader_js_1.VignetteShader);
exports.Vignette = new ShaderPass_js_1.ShaderPass(VignetteShader_js_1.VignetteShader);
// Bloom Configuration
exports.Bloom = new UnrealBloomPass_js_1.UnrealBloomPass(
/* Resolution */ new three_1.Vector2(window.innerWidth, window.innerHeight), 
/* Strength   */ 0.23, 
/* Radius     */ 2.00, 
/* Threshold  */ 0.012);
// AfterImage Configuration
exports.AfterImage = new AfterimagePass_js_1.AfterimagePass(0.72);
// Retro CRT Visual FX for the "Television Screen"
exports.RetroCRT = new FilmPass_js_1.FilmPass(0.72, 0.69, window.innerHeight * 1.6, 0);
// Resets the shader clock every 3 seconds to mitigate banding;
setInterval(() => { exports.RetroCRT.uniforms['time'] = new three_1.Uniform(0); }, 3000);
// Spectral Morphological Anti-Aliasing to fix over-pixellation caused by scanlines
exports.SMAA = new SMAAPass_js_1.SMAAPass(window.innerWidth, window.innerHeight);
