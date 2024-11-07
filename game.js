import * as THREE from 'three'
import { buildCanvasText } from './canvastext.js'
import GUI from 'lil-gui'

let game, spatialText1, spatialText2, spatialText3, floor, ambientLight, directionalLight, debug

const raycast = new THREE.Raycaster()
const gui = new GUI()

function updateSpatialText1() {
    if(spatialText1) {
        game.scene.remove(spatialText1)
        spatialText1.material.dispose()
    }
    
    spatialText1 = buildCanvasText(debug.fontText1, { font: `${debug.fontSize1}px ${debug.font1}`, textAlign: debug.fontAlign1 })
    spatialText1.position.z = 0
    spatialText1.position.y = 0.5
    spatialText1.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI / 2)
    spatialText1.material.opacity = 1
    spatialText1.castShadow = true
    game.scene.add(spatialText1)
}

function updateSpatialText2() {
    if(spatialText2) {
        game.scene.remove(spatialText2)
        spatialText2.material.dispose()
    }

    
    
    spatialText2 = buildCanvasText(debug.fontText2, { font: `${debug.fontSize2}px ${debug.font2}`, textAlign: debug.fontAlign2 })
    spatialText2.position.x = -1
    spatialText2.position.y = 0.5
    spatialText2.position.z = -3
    spatialText2.material.opacity = 1
    spatialText2.castShadow = true
    
    game.scene.add(spatialText2)
}

function updateSpatialText3() {
    if(spatialText3) {
        game.scene.remove(spatialText3)
        spatialText3.material.dispose()
    }
    
    spatialText3 = buildCanvasText(debug.fontText3, { font: `${debug.fontSize3}px ${debug.font3}`, textAlign: debug.fontAlign3 })
    spatialText3.position.x = 2
    spatialText3.position.y = 1.5
    spatialText3.position.z = 3
    spatialText3.rotateOnAxis(new THREE.Vector3(0, 1, 0), -Math.PI / 2)
    spatialText3.material.opacity = 1
    spatialText3.castShadow = true
    game.scene.add(spatialText3)
}

const possibleFonts = ["Alice", "Quicksand", "Shadows Into Light", "League Script", "Arial", "Courier New", "Times New Roman", "Brush Script MT"]

export async function init(inGame) {
    
    game = inGame

    game.orbitControls.enabled = true

    game.camera.position.y = 5
    game.camera.position.z = 5

    debug = {
        font1: "Alice",
        fontSize1: 86,
        fontAlign1: "center",
        fontText1: "Demo Text Goes Here",
        font2: "Quicksand",
        fontSize2: 32,
        fontAlign2: "left",
        fontText2: "This is a large block of text that will automatically wrap when it hits the boundaries of the texture. This is useful if you want to do extensive text or if you want to have dialog boxes in the world.",
        font3: "Shadows Into Light",
        fontSize3: 120,
        fontAlign3: "center",
        fontText3: `Demo
        Text`
    }

    gui.reset()

    const spatialText1Folder = gui.addFolder('Spatial Text 1')
    spatialText1Folder.close()
    spatialText1Folder.add(debug, 'font1', possibleFonts).name("Font Family").onChange(value => {
        updateSpatialText1()
    })

    spatialText1Folder.add(debug, 'fontSize1').min(8).max(200).step(1).name("Size").onChange(value => {
        updateSpatialText1()
    })

    spatialText1Folder.add(debug, 'fontAlign1', ["left", "center", "right"]).name("Align").onChange(value => {
        updateSpatialText1()
    })

    spatialText1Folder.add(debug, 'fontText1').name("Text").onChange(value => {
        updateSpatialText1()
    })

    const spatialText2Folder = gui.addFolder('Spatial Text 2')
    spatialText2Folder.close()
    spatialText2Folder.add(debug, 'font2', possibleFonts).name("Font Family").onChange(value => {
        updateSpatialText2()
    })

    spatialText2Folder.add(debug, 'fontSize2').min(8).max(200).step(1).name("Size").onChange(value => {
        updateSpatialText2()
    })

    spatialText2Folder.add(debug, 'fontAlign2', ["left", "center", "right"]).name("Align").onChange(value => {
        updateSpatialText2()
    })

    spatialText2Folder.add(debug, 'fontText2').name("Text").onChange(value => {
        updateSpatialText2()
    })

    const spatialText3Folder = gui.addFolder('Spatial Text 3')
    spatialText3Folder.close()
    spatialText3Folder.add(debug, 'font3', possibleFonts).name("Font Family").onChange(value => {
        updateSpatialText3()
    })

    spatialText3Folder.add(debug, 'fontSize3').min(8).max(200).step(1).name("Size").onChange(value => {
        updateSpatialText3()
    })

    spatialText3Folder.add(debug, 'fontAlign3', ["left", "center", "right"]).name("Align").onChange(value => {
        updateSpatialText3()
    })

    spatialText3Folder.add(debug, 'fontText3').name("Text").onChange(value => {
        updateSpatialText3()
    })

    updateSpatialText1()
    updateSpatialText2()
    updateSpatialText3()


    let floorGeometry = new THREE.PlaneGeometry(10,10)
    let floorMaterial = new THREE.MeshStandardMaterial({color: 0xa1a1a1, side: THREE.DoubleSide})
    floor = new THREE.Mesh(floorGeometry, floorMaterial)
    floor.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI / 2)
    floor.receiveShadow = true
    game.scene.add(floor)

    ambientLight = new THREE.AmbientLight(0xFFFFFF, 1)
    game.scene.add(ambientLight)

    const shadowSize = 24
    directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.9)
    directionalLight.position.set(8, 10, 6)
    directionalLight.castShadow = true
    directionalLight.shadow.camera.left = -shadowSize
    directionalLight.shadow.camera.right = shadowSize
    directionalLight.shadow.camera.top = -shadowSize
    directionalLight.shadow.camera.bottom = shadowSize
    directionalLight.shadow.camera.far = 28
    directionalLight.shadow.mapSize.width = Math.min(game.renderer.capabilities.maxTextureSize, 2048)
    directionalLight.shadow.mapSize.height = Math.min(game.renderer.capabilities.maxTextureSize, 2048)
    directionalLight.shadow.bias = -0.005
    directionalLight.shadow.radius = 6
    directionalLight.cameraOffset = new THREE.Vector3()
    directionalLight.cameraOffset.copy(directionalLight.position)
    directionalLight.cameraOffset.sub(new THREE.Vector3(0, 0, 0))
    directionalLight.target = game.camera
    directionalLight.update = function () {
        const currentOffset = new THREE.Vector3()
        currentOffset.copy(directionalLight.cameraOffset).add(game.camera.position)
        directionalLight.position.set(currentOffset.x, currentOffset.y, currentOffset.z)
        if (directionalLight.shadow) {
            directionalLight.shadow.camera.position.set(currentOffset.x, currentOffset.y, currentOffset.z)
        }
    }

    game.scene.add(directionalLight)
}

export function update(game) {
    let elapsedTime = game.clock.getElapsedTime()

    spatialText1.position.y = 0.25 * Math.sin(elapsedTime) + 0.5

    spatialText2.scale.set(0.25 * Math.sin(0.5 * elapsedTime) + 1, 0.25 * Math.sin(0.5 * elapsedTime) + 1, 0.25 * Math.sin(0.5 * elapsedTime) + 1)

    spatialText3.rotation.y = 0.75 * Math.sin(2 * elapsedTime)
    directionalLight.update()


    raycast.setFromCamera(game.mousePosition, game.camera)


    let intersects = raycast.intersectObjects([spatialText1,spatialText2,spatialText3].filter(entity => entity.visible))
    game.outlinePass.selectedObjects = []
    document.body.style.cursor = "default"
    if (intersects.length > 0) {
        document.body.style.cursor = "pointer"
        highlightParents(intersects, [spatialText1,spatialText2,spatialText3])
    }
}

function highlightParents(intersects, entities) {
    intersects.forEach(intersect => {
        entities.forEach(entity => {
            if(isAChildOf(entity, intersect.object)) {
                game.outlinePass.selectedObjects = [entity]
                return
            }
        })
    })
}

function isAChildOf(parent, childToCheck) {
    if (parent == childToCheck) return true
    if (childToCheck.parent != null) {
        return isAChildOf(parent, childToCheck.parent)
    }
    return false
}

export function onClick() {

}

export function onKeyPress(code) {
}

