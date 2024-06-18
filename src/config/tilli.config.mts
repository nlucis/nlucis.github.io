import * as Cesium from 'cesium';
import { VIEWPORT } from '../portfolio';
import { SignallingEvents } from '../controllers/_InputController';

window['CESIUM_BASE_URL'] = '/cesium';

document.addEventListener("DOMContentLoaded", e => {
  Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5ZGI4OWYxOS1lYTRkLTQ5NWItOGFlZS1lYmJkNjliY2Y1NDEiLCJpZCI6ODIyOTgsImlhdCI6MTcxNjY3OTAzNX0.sr5keydawS_B93WYiT8taU_dz3FUoyEufrLF5SbbOLc';

    // Resize Handler
  window.addEventListener('resize', () => {
    VIEWPORT.aspectRatio = (window.innerWidth > window.innerHeight) ? 
      window.innerWidth / window.innerHeight :
      window.innerHeight / window.innerWidth;
    
    VIEWPORT.width = window.innerWidth;
    VIEWPORT.height = window.innerHeight;
    VIEWPORT.centerX = window.innerWidth / 2;
    VIEWPORT.centerY = window.innerHeight / 2;

    SignallingEvents.emit('resize', VIEWPORT);
  });
});