import { Material, WebGLRenderer, WebGLRenderTarget } from "three";

export class Pass {
    constructor();
    public clear: boolean;
    public isPass: boolean;
    public enabled: boolean;
    public needsSwap: boolean;
    public renderToScreen: boolean;
    setSize(width: number, height: number): void;
    render(
        renderer: WebGLRenderer,
        writeBuffer: WebGLRenderTarget,
        readBuffer: WebGLRenderTarget,
        deltaTime: number,
        maskActive: boolean,
    ): void;
    dispose(): void;
}

export class FullScreenQuad {
    constructor(material?: Material);
    render(renderer: WebGLRenderer): void;
    dispose(): void;
    material: Material;
}
