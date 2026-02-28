# Three.js: Unreal Bloom Postprocessing

To apply postprocessing filters on objects in a Three.js scene, you should use a custom Three.js camera pipeline module that renders the Three.js scene with transparency and uses a shader to combine the scene with the camera feed texture. You should also use a custom UnrealBloomPass that supports transparent backgrounds - see AlphaUnrealBloomPass.js.

The effect composer should be set up in the onStart function of the custom Three.js pipeline module:

```
const renderer = new WebGLRenderer({
  canvas,
  context: GLctx,
  alpha: true,
  antialias: true,
})
renderer.debug.checkShaderErrors = false
renderer.autoClear = false
renderer.autoClearDepth = false
renderer.setClearColor(0xffffff, 0)

sceneTarget = new WebGLRenderTarget(canvasWidth, canvasHeight, {
  generateMipmaps: false,
})

// Bloom Composer
const bloomComposer = new EffectComposer(renderer)
bloomComposer.renderToScreen = false

// Copy scene into bloom
copyPass = new TexturePass(sceneTarget.texture)
bloomComposer.addPass(copyPass)

// Bloom Pass
bloomPass = new UnrealBloomPass(
  new Vector2(canvasWidth, canvasHeight),
  1.5,
  0.4,
  0.85
)
bloomPass.clearColor = new Color(0xffffff)

bloomPass.threshold = params.bloomThreshold
bloomPass.strength = params.bloomStrength
bloomPass.radius = params.bloomRadius

bloomComposer.addPass(bloomPass)

// Final composer
const composer = new EffectComposer(renderer)
composer.addPass(copyPass)

// Combine scene and camerafeed pass
combinePass = new ShaderPass(combineShader)
combinePass.clear = false
combinePass.renderToScreen = true
composer.addPass(combinePass)
```

The other key part of making postprocessing work in AR is to build the combine shader. This is achieved with a fragment shader and a vertex shader.

The camera feed and canvas size are different dimensions, so the camera feed texture should be stretched to line up with the scene in the fragment shader. The fragment shader is combined with a standard vertex shader to create the combine shader.

You should also handle canvas resizing in the onCanvasResizeChange function of the custom Three.js camera pipeline module.

The final step is render the Three.js scene on the composer in the onRender function, instead of on the renderer.

![](https://media.giphy.com/media/DLMkCuGo93UADqFnF4/giphy.gif)

Based on [webGL postprocessing unreal bloom example](https://threejs.org/examples/?q=postproc#webgl_postprocessing_unreal_bloom).

Thanks to Connor Guy Meehan and Umut BAYĞUT for [trailblazing integration with 8th Wall](https://github.com/UMUTBAYGUT/BloomTest).

See the [github issue on Unreal Bloom transparency support](https://github.com/mrdoob/three.js/issues/14104) and [the fix](https://github.com/mbalex99/threejs-unrealbloompass-transparent-background-example)

CC Attribution: [Primary Ion Drive model by indierocktopus](https://sketchfab.com/3d-models/primary-ion-drive-d3f50a66fee74c6588dd9bc92f7fe7b3)
