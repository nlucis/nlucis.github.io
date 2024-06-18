"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addInteraction = exports.InputManager = exports.InteractionEvents = exports.SignallingEvents = void 0;
var eventemitter3_1 = require("eventemitter3");
// Signalling Events are used as inter-application triggers
exports.SignallingEvents = new eventemitter3_1.default();
// Interaction Events are all user-initiated gestures and actions
exports.InteractionEvents = new eventemitter3_1.default();
/*
* The input manager orchestrates user interaction events,
* inter-application triggers, and commands issued by the AI
*/
var InputManager = /** @class */ (function () {
    // using class + constructor to ensure that the dom has loaded before attempting to manipulate it
    function InputManager() {
        var _this = this;
        // Handle Double-Clicks
        document.addEventListener('dblclick', function (e) {
            var _a;
            e.preventDefault();
            exports.InteractionEvents.emit('double-tapped', (_a = e.target) === null || _a === void 0 ? void 0 : _a['id']);
        });
        // Handle Pressing / Taps
        document.addEventListener('pointerdown', function (e) {
            var _a;
            e.preventDefault();
            exports.InteractionEvents.emit('tapped', (_a = e.target) === null || _a === void 0 ? void 0 : _a['id']);
        });
        // Handle Hold Events
        document.addEventListener('pointerdown', function (e) {
            _this._holdCheck = setTimeout(function () { var _a; return exports.InteractionEvents.emit('hold', (_a = e.target) === null || _a === void 0 ? void 0 : _a['id']); }, 1200);
        });
        // Handle Release Events
        document.addEventListener('pointerup', function (e) {
            var _a;
            e.preventDefault();
            clearTimeout(_this._holdCheck);
            exports.InteractionEvents.emit('release', (_a = e.target) === null || _a === void 0 ? void 0 : _a['id']);
        });
    }
    return InputManager;
}());
exports.InputManager = InputManager;
function addInteraction(type, el, handler) {
    // TODO:...
}
exports.addInteraction = addInteraction;
var doubleTapEventTest = exports.InteractionEvents.on('double-tapped', function (target) {
    console.debug("".concat(target, " was double-tapped!"));
});
var tappedEventTest = exports.InteractionEvents.on('tapped', function (target) {
    console.debug("".concat(target, " was tapped!"));
});
var holdEventTest = exports.InteractionEvents.on('hold', function (target) {
    console.debug("".concat(target, " was held!"));
});
var releaseEventTest = exports.InteractionEvents.on('release', function (target) {
    console.debug("".concat(target, " was released!"));
});
