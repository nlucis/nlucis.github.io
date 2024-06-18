/** @type {import('vite').UserConfig} */

import { 
  defineConfig,
  ServerOptions,
} from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import { viteStaticCopy } from 'vite-plugin-static-copy';


// Restrict origin to tilli.earth in prod and * in dev
const allowOrigin = process.env.mode === 'production' ? 'https://nlucis.github.io' : '*';

const cesiumBaseUrl = "cesium";
const cesiumSource = "node_modules/cesium/Build/Cesium";

export default defineConfig({
  server: { 
    port: 3000,
    cors: true,
    https: {},
    headers: { 
      "Set-Cookie": "SameSite=Strict",
      "X-Frame-Options": "SAMEORIGIN",
      "X-Content-Type-Options": "nosniff",
      "X-XSS-Protection": "1; mode=block",
      'Content-Security-Policy': 'upgrade-insecure-requests',
      "Strict-Transport-Security": "max-age=86400; includeSubDomains",
      "Access-Control-Allow-Origin": `${allowOrigin}`
    },
    fs: { allow: ['public/', 'src/', 'node_modules/'] }
  } as ServerOptions,
  plugins: [ 
    basicSsl(), 
    viteStaticCopy({
      targets: [
        { src: `${cesiumSource}/ThirdParty`, dest: cesiumBaseUrl },
        { src: `${cesiumSource}/Workers`, dest: cesiumBaseUrl },
        { src: `${cesiumSource}/Assets`, dest: cesiumBaseUrl },
        { src: `${cesiumSource}/Widgets`, dest: cesiumBaseUrl },
      ],
    }), 
  ],
  build: {
    outDir: 'dist',
    manifest: true,
    minify: true,
    assetsDir: 'public/assets',
    copyPublicDir: true,
    commonjsOptions: { requireReturnsDefault: true },
  },
});