"use strict";
/** @type {import('vite').UserConfig} */
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const plugin_basic_ssl_1 = require("@vitejs/plugin-basic-ssl");
const vite_plugin_static_copy_1 = require("vite-plugin-static-copy");
// Restrict origin to tilli.earth in prod and * in dev
const allowOrigin = process.env.mode === 'production' ? 'https://nlucis.github.io' : '*';
const cesiumBaseUrl = "cesium";
const cesiumSource = "node_modules/cesium/Build/Cesium";
exports.default = (0, vite_1.defineConfig)({
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
        // fs: { allow: ['public/', 'src/', 'node_modules/'] }
    },
    plugins: [
        (0, plugin_basic_ssl_1.default)(),
        (0, vite_plugin_static_copy_1.viteStaticCopy)({
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
