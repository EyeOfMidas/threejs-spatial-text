import * as THREE from 'three'
import { GLTFLoader, EXRLoader, RGBELoader, OrbitControls, ShaderPass, GammaCorrectionShader } from 'three/examples/jsm/Addons.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
import { init, update, onClick, onKeyPress } from './game.js'

const game = {}
game.loaded = false
game.entities = []
game.loadingManager = new THREE.LoadingManager()
game.gltfLoader = new GLTFLoader(game.loadingManager)
game.textureLoader = new THREE.TextureLoader(game.loadingManager)
game.exrLoader = new EXRLoader(game.loadingManager)
game.rgbeLoader = new RGBELoader(game.loadingManager)
game.clock = new THREE.Clock()
game.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 256)
game.scene = new THREE.Scene()
game.mousePosition = new THREE.Vector2(0, 0)
game.keyboard = {}
game.lookAtFocus = new THREE.Vector3(0, 0, 0)

function loaded() {
    if(game.scene) {
        game.scene.clear()
    }
    game.renderer = new THREE.WebGLRenderer({
        canvas: game.canvas,
        antialias: true,

    })
    game.renderer.outputColorSpace = THREE.SRGBColorSpace
    game.renderer.setSize(game.canvas.offsetWidth, game.canvas.offsetHeight)
    game.renderer.shadowMap.enabled = true
    game.renderer.shadowMap.type = THREE.PCFSoftShadowMap

    /******************
     * Postprocessing *
     ******************/

    const renderPass = new RenderPass(game.scene, game.camera)

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(game.canvas.offsetWidth, game.canvas.offsetHeight));
    bloomPass.threshold = 0.5
    bloomPass.strength = 0.25
    bloomPass.radius = 0.0

    // Highlight
    game.outlinePass = new OutlinePass(new THREE.Vector2(game.canvas.offsetWidth, game.canvas.offsetHeight), game.scene, game.camera)
    // game.outlinePass.edgeThickness = 1
    // game.outlinePass.edgeGlow = 0
    game.outlinePass.edgeStrength = 4
    game.outlinePass.pulsePeriod = 4
    game.outlinePass.visibleEdgeColor = new THREE.Color(1, 1, 1)
    game.outlinePass.hiddenEdgeColor = new THREE.Color(1, 1, 1)

    const gammaCorrection = new ShaderPass( GammaCorrectionShader )

    const outputPass = new OutputPass()

    game.effectComposer = new EffectComposer(game.renderer)
    game.effectComposer.addPass(renderPass)
    game.effectComposer.addPass(game.outlinePass)
    game.effectComposer.addPass(bloomPass)
	// // game.effectComposer.addPass( gammaCorrection )    
    game.effectComposer.addPass(outputPass)

    game.orbitControls = new OrbitControls(game.camera, game.renderer.domElement)
    game.orbitControls.enabled = false
    onResize()

    console.log("calling init")
    init(game).then(() => {
        document.getElementById("loading").style.display = "none"
        game.clock.start()
        attachAnimationFrame()
    })
}

function onResize() {
    game.renderer.setSize(window.innerWidth, window.innerHeight, true)
    game.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))

    game.camera.aspect = game.canvas.offsetWidth / game.canvas.offsetHeight
    game.camera.updateProjectionMatrix()
}

function renderOneFrame() {

    update(game)
    game.orbitControls.update()
    if (!game.orbitControls.enabled) {
        game.camera.lookAt(game.lookAtFocus)
    }

    game.effectComposer.render()
    //game.renderer.render(game.scene, game.camera)
}

function attachAnimationFrame() {
    renderOneFrame()
    window.requestAnimationFrame(attachAnimationFrame)
}

let isDomLoaded = false
let expectedFonts = new Set()
let loadedFonts = []

export default async function main(canvasElement) {
    game.canvas = canvasElement

    document.fonts.addEventListener("loadingdone", (event) => {
        loadedFonts.push(...event.fontfaces.map(font => font.family))
        if(isDomLoaded && expectedFonts.size == loadedFonts.length) {
            loaded()
        }
    })

    document.fonts.ready.then((fontFaceSet) => {
        let expectedFontsArray = [...fontFaceSet].map(set => set.family)
        expectedFonts = new Set(expectedFontsArray);

        [...fontFaceSet].map(set => `1em ${set.family}`).map(fontFamily => {
            document.fonts.load(fontFamily)
        })
    })

    document.addEventListener("DOMContentLoaded", (event) => {
          isDomLoaded = true
          if(isDomLoaded && expectedFonts.size != 0 && expectedFonts.length == loadedFonts.length) {
            loaded()
        }
    })
    window.addEventListener('resize', onResize)
    game.canvas.addEventListener('mousemove', event => {
        game.mousePosition.x = 2 * (event.clientX / game.canvas.offsetWidth - 0.5)
        game.mousePosition.y = -2 * (event.clientY / game.canvas.offsetHeight - 0.5)
    })
    game.canvas.addEventListener('touchmove', event => {
        if (event.touches.length == 1) {
            game.mousePosition.x = 2 * (event.touches[0].clientX / game.canvas.offsetWidth - 0.5)
            game.mousePosition.y = -2 * (event.touches[0].clientY / game.canvas.offsetHeight - 0.5)
        }
    })

    game.canvas.addEventListener('touchstart', event => {
        if (event.touches.length == 1) {
            game.mousePosition.x = 2 * (event.touches[0].clientX / game.canvas.offsetWidth - 0.5)
            game.mousePosition.y = -2 * (event.touches[0].clientY / game.canvas.offsetHeight - 0.5)
        }
    })
    game.canvas.addEventListener('mousedown', event => {
        game.mousePosition.x = 2 * (event.clientX / game.canvas.offsetWidth - 0.5)
        game.mousePosition.y = -2 * (event.clientY / game.canvas.offsetHeight - 0.5)
    })

    game.canvas.addEventListener('click', event => {
        onClick()
    })

    window.addEventListener('keydown', event => {
        const lastKeyState = game.keyboard[event.code]
        game.keyboard[event.code] = true
        if (!lastKeyState) {
            onKeyPress(event.code)
        }
    })

    window.addEventListener('keyup', event => {
        game.keyboard[event.code] = false
    })
}