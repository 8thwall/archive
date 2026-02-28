# Human AR - Face Effects Lifecycle

# Overview

### DeepNets

We use two deep learning models provided by MediaPipeline to run FaceEffects:

 * Blazeface - A face detector model that operates on the full image and computes the bounding box of face locations.

 * FaceMesh - a 3D face landmark model that operates on the bounding box output of Blazeface and predicts the approximate surface geometry via regression.

>
In the above gif, the red box indicates the bounding box output of BlazeFace, which is the input to the landmark model, FaceMesh. The red dots represent the 468 landmarks in 3D, and the green lines connecting landmarks illustrate the contours around the eyes, eyebrows, lips and the entire face.

### Birds Eye View

 * Frame 1

 * onProcessGpu

 * Pass camera feed to Face Effects engine, which draws the full camera feed to a 128x128 portion of the viewport.

 * onProcessCpu

 * Blazeface reads in the 128x128 full camera feed to detect faces

 * Frame 2

 * onProcessGpu

 * Pass camera feed to Face Effects engine. Saved as 128x128 portion of the viewport.

 * Draw the detected faces as 192x192 crops to portions of the viewport.

 * onProcessCpu

 * Blazeface reads in the 128x128 full camera feed to detect faces

 * Facemesh runs on crop

 * repeat Frame 2

### Resources

 * [MediaPipe FaceMesh Documentation](<https://google.github.io/mediapipe/solutions/face_mesh.html>)

# Lifecycle

## 1) Passing camera feed to Face Effects engine

TODO - confirm the source of window._c8.readyTexture

`camera-loop.js`'s `readCameraToTexture` extracts the frame from the video element that contains the camera feed using:
```js
let cameraTexture = window._c8.readyTexture
computeCtx.bindTexture(computeCtx.TEXTURE_2D, cameraTexture)
computeCtx.texImage2D(computeCtx.TEXTURE_2D, 0, computeCtx.RGBA, computeCtx.RGBA, computeCtx.UNSIGNED_BYTE, video)
```

Now, `cameraTexture` is filled with the current frame of the video element.

TODO: We then call `xrcc._c8EmAsm_markTextureFilledInPipeline()`. This calls GLTexturePipeline in `xr-js.cc`'s singleton called `Data`. GLTexturePipeline stores 9 texture buffers that it re-uses for the camera feed textures. However... these don't seem to be used.

We pass this texture to `onProcessGpu` as `frameStartResult`. `face-controller.js` `onProcessGpu` takes this texture, and calls:
```js
xrcc_._c8EmAsm_stageFaceControllerFrame(cameraTexture.name)
```

## 2) TICK - Ingesting camera feed frame within Face Effects engine

There are two stages: tick and tock. Tick is for loading the starting the processing of the texture.

`stageFaceControllerFrame` stores the `texture.name` in the `data()` singleton's `pipeline` deque. The deque stores instances of the struct `FacePipelineData`, and records the id of the texture as `cameraTextureId`.
```cpp
struct FacePipelineData {
 uint32_t cameraTextureId = 0;
 int captureWidth = 0;
 int captureHeight = 0;
 int captureRotation = 0;
 ConstRootMessage<FaceResponse> response;
};
```

We then take that texture and render it using `FaceRoiRenderer::draw()` in `DEFER_READ` mode. This means we are doing the following order:
```cpp
FaceRoiRenderer::readPixels()    // reads the entire FBO onto RGBA8888PlanePixelBuffer outpix_.
FaceRoiRenderer::drawTexture()   // draws the full camera texture as well as the detected faces region of interests onto the FBO as separate quads
```

### FaceRoiRenderer::readPixels()

### FaceRoiRenderer::drawTexture()

This loads the camera feed texture from the GPU onto the CPU in the following steps:

 * sets active texture to GL_TEXTURE0... TODO add why.

 * binds the FaceRoiRenderer's framebuffer

 * binds the FaceRoiRenderer's framebuffer's color texture.

 * copies the texture data from the GPU to the CPU using:

```cpp
// WebGL1 only
glReadPixels(0, 0, o.cols(), o.rows(), GL_RGBA, GL_UNSIGNED_BYTE, o.pixels());
```
```cpp
// WebGL2 only
 EM_ASM_(
 {
 Module.ctx.bindBuffer(Module.ctx.PIXEL_PACK_BUFFER, GL.buffers[$2]);
 Module.ctx.getBufferSubData(Module.ctx.PIXEL_PACK_BUFFER, 0, HEAPU8.subarray($0, $0 + $1));
 Module.ctx.bindBuffer(Module.ctx.PIXEL_PACK_BUFFER, null);
 },
 o.pixels(),
 o.rows() * o.rowBytes(),
 pixelBuffer_);
```

 * copies over local variables like `drawnFaceRois` to `faceRois`. TODO explain how this works with the tick tock pattern
