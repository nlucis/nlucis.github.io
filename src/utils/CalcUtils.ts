import { Vector3 } from 'three';
import { generateUUID } from 'three/src/math/MathUtils.js';


export const Wrap = (value: number, min: number, max: number): number => {
    const range = max - min;
    return (min + ((((value - min) % range) + range) % range));
};

// Converts from the Three.js world space of a 3D object to its on-screen position
export function getScreenPosition(point: Vector3, camera: THREE.PerspectiveCamera): Vector3 {
    const vector = point.clone().project(camera);
    vector.x = (vector.x + 1) / 2 * window.innerWidth;
    vector.y = -(vector.y - 1) / 2 * window.innerHeight;
    return vector;
};

export { generateUUID };