"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subLoad = exports.scene3D = exports.eachFrame = exports.VIEWPORT = exports.GLASS_SCREEN = exports.TELEVISION = void 0;
require("./controllers/Mandorla");
require("/src/config/tilli.config.mts");
require("cesium/Build/Cesium/Widgets/widgets.css");
const two_config_mjs_1 = require("./config/two.config.mjs");
const three_config_mjs_1 = require("./config/three.config.mjs");
const two_js_1 = require("two.js");
const Tone = require("tone");
const three_1 = require("three");
const postprocessing_config_ts_1 = require("./config/postprocessing.config.ts");
const CalcUtils_1 = require("./utils/CalcUtils");
const _InputController_1 = require("./controllers/_InputController");
const MathUtils_js_1 = require("three/src/math/MathUtils.js");
exports.TELEVISION = document.getElementById('television');
exports.GLASS_SCREEN = document.getElementById('glass-screen');
exports.VIEWPORT = {
    width: window.innerWidth,
    height: window.innerHeight,
    centerX: window.innerWidth / 2,
    centerY: window.innerHeight / 2,
    aspectRatio: (window.innerWidth >= window.innerHeight) ?
        window.innerWidth / window.innerHeight : window.innerHeight / window.innerWidth
};
exports.eachFrame = [];
exports.scene3D = new three_1.Scene();
const _slQueue = [];
function subLoad(sl) { _slQueue.push(sl); }
exports.subLoad = subLoad;
// Main UI
document.addEventListener("DOMContentLoaded", async (e) => {
    window['SignallingEvents'] = _InputController_1.SignallingEvents;
    // Main 2D UI
    let overlay = new two_js_1.default({ ...two_config_mjs_1.default, overdraw: true }).appendTo(exports.GLASS_SCREEN);
    // Emulate audio / visual static
    const audioStatic = new Tone.Noise("brown").set({ volume: -6 }).toDestination();
    // Switch to the default mode (non-static) when ready
    _InputController_1.SignallingEvents.on('ready', e => audioStatic.start());
    // Setup - Rendering
    const camera3D = new three_1.PerspectiveCamera(35, exports.VIEWPORT.aspectRatio, 1e-1, 1e+3);
    const renderer = new three_1.WebGLRenderer({ ...three_config_mjs_1.default, canvas: exports.TELEVISION });
    renderer.setSize(exports.VIEWPORT.width, exports.VIEWPORT.height);
    renderer.setPixelRatio(1);
    renderer.toneMapping = three_1.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.6;
    renderer.setDrawingBufferSize(window.innerWidth, window.innerHeight, 1);
    const composer = new postprocessing_config_ts_1.EffectComposer(renderer);
    // Post-Processing Render Passes
    const main = new postprocessing_config_ts_1.TAARenderPass(exports.scene3D, camera3D, 0x2A2A2A, 0.9);
    const glow = postprocessing_config_ts_1.Bloom;
    const film = postprocessing_config_ts_1.RetroCRT;
    const haze = postprocessing_config_ts_1.AfterImage;
    const vine = postprocessing_config_ts_1.Vignette;
    const smaa = postprocessing_config_ts_1.SMAA;
    const fuzz = postprocessing_config_ts_1.ScreenStaticPass;
    // FX Stack
    composer.addPass(main);
    composer.addPass(fuzz);
    composer.addPass(glow);
    composer.addPass(film);
    composer.addPass(haze);
    composer.addPass(vine);
    composer.addPass(smaa);
    // Redshift Nighttime Filter
    _InputController_1.SignallingEvents.on('redshift:on', () => {
        main.clearColor = 0x000000;
        composer.addPass(postprocessing_config_ts_1.RedShift);
    });
    _InputController_1.SignallingEvents.on('redshift:off', () => {
        main.clearColor = 0x1A1A1A;
        composer.removePass(postprocessing_config_ts_1.RedShift);
    });
    // Main Render Loop
    renderer.setAnimationLoop(() => {
        fuzz.uniforms.time.value = (0, CalcUtils_1.Wrap)(fuzz.uniforms.time.value + 0.001, 0.001, 0.10);
        exports.eachFrame.forEach(cb => cb());
        composer.render();
    });
    // Visual static on no-signal
    if (exports.scene3D.children.length === 0) {
        film.uniforms['nIntensity'] = new three_1.Uniform(1.0);
    }
    _InputController_1.SignallingEvents.on('ready', e => composer.removePass(fuzz));
    // black framing bezel
    const bezel = overlay.makeRoundedRectangle(exports.VIEWPORT.centerX, exports.VIEWPORT.centerY, exports.VIEWPORT.width, exports.VIEWPORT.height, 36);
    bezel.noFill();
    bezel.stroke = '#000000';
    bezel.linewidth = 36;
    bezel.id = 'bezel';
    _InputController_1.SignallingEvents.on('resize', (v) => {
        bezel.width = v.width;
        bezel.height = v.height;
        bezel.position.set(v.centerX, v.centerY);
        postprocessing_config_ts_1.SMAA.setSize(v.width, v.height);
        postprocessing_config_ts_1.RetroCRT.uniforms['scanlinesCount'] = v.height * 2;
    });
    // Start Button Overlay
    const overlayScreen = overlay.makeRectangle(exports.VIEWPORT.centerX, exports.VIEWPORT.centerY, exports.VIEWPORT.width, exports.VIEWPORT.height);
    overlayScreen.noStroke();
    overlayScreen.fill = '#000';
    _InputController_1.SignallingEvents.on('ready', e => overlayScreen.remove());
    // Start button
    const orbitalR = overlay.makeCircle(exports.VIEWPORT.centerX, exports.VIEWPORT.centerY, 300, 360);
    orbitalR.noFill();
    orbitalR.stroke = '#fff';
    orbitalR.linewidth = 64;
    orbitalR.cap = 'round';
    orbitalR.join = 'round';
    orbitalR.closed = false;
    const orbitalL = overlay.makeCircle(exports.VIEWPORT.centerX, exports.VIEWPORT.centerY, 300, 360);
    orbitalL.noFill();
    orbitalL.stroke = '#fff';
    orbitalL.linewidth = 64;
    orbitalL.cap = 'round';
    orbitalL.join = 'round';
    orbitalL.closed = false;
    orbitalL.rotation = (0, MathUtils_js_1.degToRad)(180);
    const outlineInner = overlay.makeCircle(exports.VIEWPORT.centerX, exports.VIEWPORT.centerY, 300 - (64 / 2), 360);
    outlineInner.fill = '#000';
    outlineInner.noStroke();
    const outlineOuter = overlay.makeCircle(exports.VIEWPORT.centerX, exports.VIEWPORT.centerY, 300 + (64 / 2), 360);
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
    exports.eachFrame.push(() => {
        orbitalR.ending = index;
        orbitalR.beginning = min;
        orbitalL.ending = index;
        orbitalL.beginning = min;
        index = held ? (0, MathUtils_js_1.clamp)(index + rot, min, max / 2) : (0, MathUtils_js_1.clamp)(index - rot, min, max / 2);
    });
});
// Use this sub-loader for any resources that tend to not be available immediately on DOMContentLoaded
setTimeout(() => _slQueue.forEach(sl => sl()), 1);
