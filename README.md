# ThreeJS Spatial Text

A small demo of how to put browser-page fonts into a threejs scene as physical text.

You can try it [here](https://eyeofmidas.github.io/threejs-spatial-text/dist/index.html)!

After cloning, run `npm install` and then `npm start` to start up a local vite server and see the scene.

Build a deployable version of this demo with `npm run build` which will put it into the `dist/` directory.

For developers trying to implement this: there are a couple of snags I need to work through which I'll mention here:

## Font Loading
Fonts in the browser are actually loaded async, which means when the text object is being created, the font it's using isn't actually the font you specified.
It's not related to the `DOMContentLoaded` document event, and there's not a good built-in way in the browser to say when the css and fonts are loaded. I have a two-step handler in `main.js` to try and enforce the fonts are actually ready before starting the scene.


```
let isFontLoaded = false
let isDomLoaded = false

export default async function main(canvasElement) {
    game.canvas = canvasElement

    document.fonts.addEventListener("loadingdone", (event) => {
        isFontLoaded = true
        if(isDomLoaded && isFontLoaded) {
            loaded()
        }
    })

    document.fonts.ready.then((fontFaceSet) => {
        [...fontFaceSet].map(set => `1em ${set.family}`).map(fontFamily => {
            document.fonts.load(fontFamily)
        })
    })

    document.addEventListener("DOMContentLoaded", (event) => {
          isDomLoaded = true
          if(isDomLoaded && isFontLoaded) {
            loaded()
        }
    })
```
What I'd really rather have is something that calls an event listener when th styling or fonts are finished loading. This is pretty close so I'm going to call this done.

## Shadows and Alpha
Because of the alpha map, the texture-on-a-plane approach works pretty well, even with movement. If you want text to fade in or fade out, however, the shadows don't react properly.

I'm still trying to figure this one out.

## Performance
This currently is done really cheaply; each text string is a separate two textures; a color map and an alpha map. If you have more than a few of these you're going to start to eat up a bunch of texture memory.

The correct approach here is to make a font texture and then build up a sentence using UV mapping instead. Definitely a future goal of mine, but for now this implementation is good enough.

## lil-gui Issues
Adding a lil-gui to the scene causes the dom content to re-load again. I set the `loaded()` function in `main.js` to clear out the scene when it's called but it would be nice to not have to do this. There might be some remnants of the previous call left behind...