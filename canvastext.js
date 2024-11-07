import * as THREE from 'three'

let startPosition = 0

function wordWrap(text, context, options) {
    const words = text.split(" ")
    const lines = []
    let line = ""
    const maxWidth = options.width - (8 * 2)
    words.forEach(word => {
        const newLine = line+word+" "
        const metrics = context.measureText(newLine.trim())
        let fontWidth = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight
        if(fontWidth > maxWidth) {
            lines.push(line.trim())
            line = word + " "
        } else {
            line = newLine
        }
    })
    if (line != "") {
        lines.push(line.trim())
    }
    return lines
}

export function buildCanvasText(text, inOptions = {}) {    
    const options = {width: 512, height: 512, font: "86px Arial", textAlign: "center", lineWidth: 8}
    if(inOptions.width) options.width = inOptions.width
    if(inOptions.height) options.height = inOptions.height
    if(inOptions.font) options.font = inOptions.font
    if(inOptions.textAlign) options.textAlign = inOptions.textAlign
    if(inOptions.lineWidth) options.lineWidth = inOptions.lineWidth

    const texture = generateMap(text, options)
    const alphaMap = generateAlphaMap(text, options)

    const material = new THREE.MeshBasicMaterial({transparent: true, map: texture, side: THREE.DoubleSide, alphaMap: alphaMap, alphaTest: 0.1})
    const geometry = new THREE.PlaneGeometry(4,4)
    const textMesh = new THREE.Mesh(geometry, material)
    textMesh.castShadow = true
    return textMesh
}

function generateMap(text, options) {
    const textCanvas = document.createElement('canvas')
    textCanvas.width = options.width
    textCanvas.height = options.height
    const context = textCanvas.getContext('2d')

    context.clearRect(0, 0, options.width, options.height)

    context.font = options.font
    context.textAlign = options.textAlign
    context.lineWidth = options.lineWidth
    context.lineCap = "round"
    context.lineJoin = "round"

    const lines = wordWrap(text, context, options)

    startPosition = options.width / 2
    if(options.textAlign == "left") {
        startPosition = 0 + 8
    }
    if(options.textAlign == "right") {
        startPosition = options.width - 8
    }


    for(let i = 0; i < lines.length; i++) {
        const lineToDraw = lines[i]
        const metrics = context.measureText(lineToDraw)
        let fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent
        // context.beginPath()
        // context.fillStyle = "rbga(0,0,0,0.5)"
        // context.rect(0,0, options.width, options.height)
        // context.fill()

        context.beginPath()
        context.strokeStyle = "black"
        context.strokeText(lineToDraw, startPosition, 8 + (fontHeight * (i + 1)))

        context.beginPath()
        context.fillStyle = "white"
        context.fillText(lineToDraw, startPosition, 8 + (fontHeight * (i + 1)))
    }
    const texture = new THREE.CanvasTexture(textCanvas)

    texture.minFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.needsUpdate = true

    return texture
}

function generateAlphaMap(text, options) {
    const textCanvas = document.createElement('canvas')
    textCanvas.width = options.width
    textCanvas.height = options.height
    const context = textCanvas.getContext('2d')

    context.clearRect(0, 0, options.width, options.height)
    context.beginPath()
    context.fillStyle = "black"
    context.rect(0, 0, options.width, options.height)
    context.fill()
    // context.beginPath()
    // context.strokeStyle = "magenta"
    // context.rect(0,0, options.width, options.height)
    // context.stroke()

    context.font = options.font
    context.textAlign = options.textAlign
    context.lineWidth = options.lineWidth
    context.lineCap = "round"
    context.lineJoin = "round"

    const lines = wordWrap(text, context, options)


    startPosition = options.width / 2
    if(options.textAlign == "left") {
        startPosition = 0 + 8
    }
    if(options.textAlign == "right") {
        startPosition = options.width - 8
    }

    for(let i = 0; i < lines.length; i++) {
        const lineToDraw = lines[i]
        const metrics = context.measureText(lineToDraw)
        let fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent
        // context.beginPath()
        // context.fillStyle = "rbga(0,0,0,0.5)"
        // context.rect(0,0, options.width, options.height)
        // context.fill()

        context.beginPath()
        context.strokeStyle = "white"
        context.strokeText(lineToDraw, startPosition, 8 + (fontHeight * (i + 1)))

        context.beginPath()
        context.fillStyle = "white"
        context.fillText(lineToDraw, startPosition, 8 + (fontHeight * (i + 1)))
    }
    const texture = new THREE.CanvasTexture(textCanvas)

    texture.minFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.needsUpdate = true

    return texture
}