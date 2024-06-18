"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addInteraction = exports.InputManager = exports.InteractionEvents = exports.SignallingEvents = void 0;
const eventemitter3_1 = require("eventemitter3");
// Signalling Events are used as inter-application triggers
exports.SignallingEvents = new eventemitter3_1.default();
// Interaction Events are all user-initiated gestures and actions
exports.InteractionEvents = new eventemitter3_1.default();
/*
* The input manager orchestrates user interaction events,
* inter-application triggers, and commands issued by the AI
*/
class InputManager {
    _holdCheck;
    // using class + constructor to ensure that the dom has loaded before attempting to manipulate it
    constructor() {
        // Handle Double-Clicks
        document.addEventListener('dblclick', (e) => {
            e.preventDefault();
            exports.InteractionEvents.emit('double-tapped', e.target?.['id']);
        });
        // Handle Pressing / Taps
        document.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            exports.InteractionEvents.emit('tapped', e.target?.['id']);
        });
        // Handle Hold Events
        document.addEventListener('pointerdown', (e) => {
            this._holdCheck = setTimeout(() => exports.InteractionEvents.emit('hold', e.target?.['id']), 1200);
        });
        // Handle Release Events
        document.addEventListener('pointerup', (e) => {
            e.preventDefault();
            clearTimeout(this._holdCheck);
            exports.InteractionEvents.emit('release', e.target?.['id']);
        });
    }
}
exports.InputManager = InputManager;
function addInteraction(type, el, handler) {
    // TODO:...
}
exports.addInteraction = addInteraction;
const doubleTapEventTest = exports.InteractionEvents.on('double-tapped', target => {
    console.debug(`${target} was double-tapped!`);
});
const tappedEventTest = exports.InteractionEvents.on('tapped', target => {
    console.debug(`${target} was tapped!`);
});
const holdEventTest = exports.InteractionEvents.on('hold', target => {
    console.debug(`${target} was held!`);
});
const releaseEventTest = exports.InteractionEvents.on('release', target => {
    console.debug(`${target} was released!`);
});
