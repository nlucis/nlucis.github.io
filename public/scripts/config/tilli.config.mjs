"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cesium = require("cesium");
const portfolio_1 = require("../portfolio");
const _InputController_1 = require("../controllers/_InputController");
window['CESIUM_BASE_URL'] = '/cesium';
document.addEventListener("DOMContentLoaded", e => {
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5ZGI4OWYxOS1lYTRkLTQ5NWItOGFlZS1lYmJkNjliY2Y1NDEiLCJpZCI6ODIyOTgsImlhdCI6MTcxNjY3OTAzNX0.sr5keydawS_B93WYiT8taU_dz3FUoyEufrLF5SbbOLc';
    // Resize Handler
    window.addEventListener('resize', () => {
        portfolio_1.VIEWPORT.aspectRatio = (window.innerWidth > window.innerHeight) ?
            window.innerWidth / window.innerHeight :
            window.innerHeight / window.innerWidth;
        portfolio_1.VIEWPORT.width = window.innerWidth;
        portfolio_1.VIEWPORT.height = window.innerHeight;
        portfolio_1.VIEWPORT.centerX = window.innerWidth / 2;
        portfolio_1.VIEWPORT.centerY = window.innerHeight / 2;
        _InputController_1.SignallingEvents.emit('resize', portfolio_1.VIEWPORT);
    });
});
