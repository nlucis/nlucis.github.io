import TWO from 'two.js';
export default {
  fitted: true,
  autostart: true,
  overdraw: true,
  fullscreen: false,
  type: TWO.Types.svg,
  ratio: (window.innerWidth > window.innerHeight) ? 
    window.innerHeight / window.innerWidth : 
    window.innerWidth / window.innerHeight || 1
}
