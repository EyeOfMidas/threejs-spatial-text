import wasm from 'vite-plugin-wasm'
import glsl from 'vite-plugin-glsl'
import topLevelAwait from 'vite-plugin-top-level-await'
import { defineConfig } from 'vite'

export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
    return {
        root: './',
    publicDir: './assets/',
    base: './',
    server:
    {
        host: true, // Open to local network and display URL
        open: !('SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env) // Open if it's not a CodeSandbox
    },
    build:
    {
        outDir: './dist', // Output in the dist/ folder
        emptyOutDir: true, // Empty the folder first
        sourcemap: true // Add sourcemap
    },
    plugins:
    [
        wasm(), glsl(), topLevelAwait(),
    ]
    }

})

/*
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
    return {
        'rootDir': './jupiter-jazz/',
        'publicDir': './jupiter-jazz/',
        'mode': 'development',
        'build': {
            'rootDir': './jupiter-jazz/',
            'publicDir': './jupiter-jazz/',
            'target': 'modules',
            'outDir': '../dist/'
        },
        'server': {
            // https://vitejs.dev/config/server-options.html
            'host': true,
            'port': '3000',
            'strictPort': true,
            'open': '/editor/index.html'
        },
        'plugins': [wasm(), glsl()]
    }

})
*/
