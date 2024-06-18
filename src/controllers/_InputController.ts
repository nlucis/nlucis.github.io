import EE from 'eventemitter3';
  // Signalling Events are used as inter-application triggers
  export const SignallingEvents = new EE<string>();

  // Interaction Events are all user-initiated gestures and actions
  export const InteractionEvents = new EE<string>();


/*
* The input manager orchestrates user interaction events,
* inter-application triggers, and commands issued by the AI
*/
export class InputManager {
  private _holdCheck: NodeJS.Timeout;
  // using class + constructor to ensure that the dom has loaded before attempting to manipulate it
  constructor () {
    // Handle Double-Clicks
    document.addEventListener('dblclick', (e) => {
      e.preventDefault();
      InteractionEvents.emit('double-tapped', e.target?.['id']);
    });
    // Handle Pressing / Taps
    document.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      InteractionEvents.emit('tapped', e.target?.['id']);
    });
    // Handle Hold Events
    document.addEventListener('pointerdown', (e) => { 
      this._holdCheck = setTimeout(() => InteractionEvents.emit('hold', e.target?.['id']), 1200);
    });
    // Handle Release Events
    document.addEventListener('pointerup', (e) => { 
      e.preventDefault();
      clearTimeout(this._holdCheck); 
      InteractionEvents.emit('release', e.target?.['id']);
    });
  }
}

export function addInteraction(type: 'TAP' | 'DOUBLE-TAP' | 'HOLD' | 'RELEASE', el: any, handler: () => void): void {
  // TODO:...
}

const doubleTapEventTest = InteractionEvents.on('double-tapped', target => {
  console.debug(`${target} was double-tapped!`);
});
const tappedEventTest = InteractionEvents.on('tapped', target => {
  console.debug(`${target} was tapped!`);
});
const holdEventTest = InteractionEvents.on('hold', target => {
  console.debug(`${target} was held!`);
});
const releaseEventTest = InteractionEvents.on('release', target => {
  console.debug(`${target} was released!`);
});

