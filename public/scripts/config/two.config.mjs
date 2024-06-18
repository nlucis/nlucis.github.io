"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const two_js_1 = require("two.js");
exports.default = {
    fitted: true,
    autostart: true,
    overdraw: true,
    fullscreen: false,
    type: two_js_1.default.Types.svg,
    ratio: (window.innerWidth > window.innerHeight) ?
        window.innerHeight / window.innerWidth :
        window.innerWidth / window.innerHeight || 1
};
