"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUUID = exports.getScreenPosition = exports.Wrap = void 0;
const MathUtils_js_1 = require("three/src/math/MathUtils.js");
Object.defineProperty(exports, "generateUUID", { enumerable: true, get: function () { return MathUtils_js_1.generateUUID; } });
const Wrap = (value, min, max) => {
    const range = max - min;
    return (min + ((((value - min) % range) + range) % range));
};
exports.Wrap = Wrap;
// Converts from the Three.js world space of a 3D object to its on-screen position
function getScreenPosition(point, camera) {
    const vector = point.clone().project(camera);
    vector.x = (vector.x + 1) / 2 * window.innerWidth;
    vector.y = -(vector.y - 1) / 2 * window.innerHeight;
    return vector;
}
exports.getScreenPosition = getScreenPosition;
;
