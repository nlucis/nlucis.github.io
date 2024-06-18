/// <reference types="./types/CalcUtils" />
/// <reference types="./types/Pass" />
/// <reference types="./types/ShaderPass" />
/// <reference types='./types/EffectComposer' />
import { SignallingEvents } from './src/controllers/_InputController';

interface Window {
  SignallingEvents: SignallingEvents;
}