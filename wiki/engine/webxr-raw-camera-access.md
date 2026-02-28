# WebXR Raw Camera Access

## Introduction

[WebXR raw camera access](<https://github.com/immersive-web/raw-camera-access/blob/main/explainer.md>) is an experimental API that gives us direct access to the pose synchronized camera texture. This API is currently implemented as a method part of [XRWebGLBinding](<https://developer.mozilla.org/en-US/docs/Web/API/XRWebGLBinding>) interface, which is used to create layers/objects with a GPU backend.

## Session manager

Raw camera access is integrated into the camera pipeline using a session manager part of Threejs renderer. Session manager handles WebXR lifecycle, calculates the intrinsic and extrinsic, obtains the camera texture and dispatches an event notifying other modules of a new texture captured.

The session manager can be found at threejs-renderer-webxr.js

The session manager alone can be used through the code editor project for QR Marker based AR:

## WebXR controller

WebXR controller JS manages the data received from WebXR. The controller creates capnp messages for intrinsic and extrinsic, copies the texture from draw context to compute context and makes the texture accessible in emscripten. This file can also act as an entry point for AR experiences like Image targets etc. Currently image targets is implemented as a demo to show computer vision algorithms running on the camera texture.

The controller can be found in webxr-controller.js

WebXR controller CC manages the capnp messages with extrinsic and intrinsic information, wraps the texture id into 2D texture object and also acts as an entry point for CV algorithms to use the texture. Currently image targets is implemented as a demo to show computer vision algorithms running on the camera texture.

The controller can be found in webxr-controller.cc

## Additional Notes

 * The camera texture returned is an [opaque texture](<https://www.w3.org/TR/webxrlayers-1/#xropaquetextures>), not a normal WebGL texture. Of all the differences between them the most notable is that the opaque texture is invalid outside of the requestAnimationFrame callback for the session. Therefore in order to maintain a ring buffer of textures we need to copy the texture before the end of the RAF callback.

 * XRWebGLBinding interface requires a session and context to create it. Even though we use the compute context to create the XRWebGLBinding, the camera texture returned by the [getCameraImage() method belongs to the baseLayer context](<https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/modules/xr/xr_webgl_binding.cc;l=194>) which here is draw context. This is the reason we are currently copying the texture from draw context to compute context. This is inconsistent API behavior and maybe fixed in the future.

 * WebXR directly write to the device display framebuffer, it only requires a context and not a canvas to draw into, this can be verified by using an offscreen canvas and its context to create the base layer of the render state. This also means we can use the draw canvas for any intermediate computations/drawings if needed and it will not affect the AR session.

## Image Targets

Image Targets was implemented as a demo and visualization layers where created using dom-overlay.

Features 1.mp4matches 1.mp4

inliners.mp4locate.mp4

Presentation with architectures and videos : `<REMOVED_BEFORE_OPEN_SOURCING>` (Google Slides)

## To get things working

 * Add the threejs-renderer-webxr.js and webxr-controller.js in the jsxr.

 * Add webxr-controller CC and webxr.capnp to the build

 * And the code editor project that makes everything connect
