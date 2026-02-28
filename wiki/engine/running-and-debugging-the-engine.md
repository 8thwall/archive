# Running and Debugging the Engine

## Using a local engine for a production app

To run a local version of the engine, there are a few steps:

 1. Be on a WiFi that allows cross-device communication

 2. Starting the server on your laptop

 3. Updating your phone’s token to point to your local engine.

 4. Bypassing security warning

 5. Going to a cloud editor project to test your engine.

#### 1) Be on a WiFi that allows cross-device communication

The Palo Alto office and SF office, you have to get access to `vessel-demark`.

#### 2) Starting the server on your laptop

`bazel run --platforms=//bzl:wasm32 //reality/app/xr/js:serve-xr --features=simd`

#### 3) Updating your phone’s token to point to your local engine.

Go to your cloud editor project page on the 8thwall dev workspace. For the 8th Wall “Pipeline Tester” project page, you can go to . Note these instructions work for any project.

Select `Device Authorization`, then choose `Local Version`, put `<https://yourip:8888/reality/app/xr/js/xr.js`> as your engine location (NOTE: replace `yourip` with your own ip)

Scan the QR code using your phone, then DO NOT use the preview link in the editor but instead go directly to the experience link. If you scan the preview link, it will update your token to a production token. Here’s an example of a preview link that you do NOT want to use.

If you do use it, you’ll have to scan the project page token again. Using the preview link will override your engine settings. Make sure that the log says your engine version is `0.0.0.0`. If it is not, then you are not running the local version.

#### 4) Bypassing security warning

Input `https://yourip:8888/reality/app/xr/js/xr.js` in your browser’s address bar to see if you can load the script. The browser may prompt you with security warnings. Click on `Advanced` button to ignore the warnings. If the script is successfully loaded, your device is authorized. If you have an issues:

 * make sure your phone and laptop are on the same wifi

 * make sure a local script isn’t already being loaded on your phone. iPhone can’t seem to load more than one local server at a time.

 * If all else fails, switch from Safari to Chrome on your phone. No clue why this has worked.

 * Delete cookies

 * Restart phone

 * Cry

#### 5) Go to project page.

I like to go to the preview link url on my desktop and then create a QR code in chrome so that I can get to it easily on mobile.

If you run into a problem loading engine version 0.0.0.0 after these instructions, consider wiping your cookie for the experience.

#### 6) Run local engine inside the simulator

If you run into a problem loading engine version 0.0.0.0 inside the simulator after these instructions, you can follow these steps to resolve the problem -

1\. open the project page in a separate tab

2\. authorize the local engine version 0.0.0.0, this will overwrite the page cookie to point the local build

3\. refresh the simulator page to load the local engine version 0.0.0.0

## Javascript Debugging

You can start serving your own local engine with:
```bash
bazel run --platforms=//bzl:wasm32 //reality/app/xr/js:serve-xr --features=simd
```

It's by default in production mode. Therefore, the code is minified and stripped of any debugging symbols. In order to step through your code while seeing the original symbols, you want to edit the Webpack config for our engine here, changing:
```js
optimization: {
 minimize: mode === 'production',
 ...
},
```

to:
```js
optimization: {
 minimize: false,
},
```

Then you can run the Bazel `server-xr` command again. You can then also add the JS keyword `debugger` in your code and if your Chrome inspector is open, it will automatically stop at that line.

## C++ Debugging

In order for your C8Logs to appear, you must set verbose to true in your run config, like `XR8.run({verbose: true, ...})`. Also, most of the existing C8Logs within the engine are behind the `NDEBUG` flag. Adding `-c dbg` to the bazel run command will rebuild with `NDEBUG` set. If you are only interested in new logs you add, you can skip this. If you want to see all of the existing logs, consider building with `-c dbg`.
```bash
bazel run -c dbg --platforms=//bzl:wasm32 //reality/app/xr/js:serve-xr --features=simd
```

Our C++ code is transpiled down to WASM. By default, this removes assert symbols as well as exception catching. In order to bring these features back, uncomment the following emopts lines in the `xr-js-asm` rule for `code8/reality/app/xr/js/BUILD`:
```
#"ASSERTIONS=1",
#"DISABLE_EXCEPTION_CATCHING=0",
```

### Debugging with sanitizers

If you are trying the debug the engine with sanitizers like ASan, you may not get line numbers for where the error occured. You can follow these steps to get line numbers.

 1. `bazel build -c dbg --build_tests_only --test_output=errors --copt=-fsanitize=address --linkopt=-fsanitize=address //reality/quality/benchmark/cvlite:fast-score-benchmark-test`

 2. `dsymutil bazel-bin/reality/quality/benchmark/cvlite/fast-score-benchmark-test`

 3. `lldb bazel-bin/reality/quality/benchmark/cvlite/fast-score-benchmark-test`

 4. In lldb enter `r`

## Chrome Desktop Debugging

The best way to track down errors is using Chrome on your desktop. You'll have to set your project to XR8.run({enabledDevices: 'any'}) in order to do this.

Turn on "Pause on exceptions" as well as "Pause on caught exceptions". This even catches C++ exceptions transpiled to Emscripten if the build configurations in xr-js-asm are enabled.

## WebGL Debugging

WebGL debugging given the current 8th Wall architecture is challenging for two reasons:

 1. For our THREE.js, AFrame, and Babylon projects, the camera frame and the client share the same canvas and WebGL context. The GL image manipulation done in our C++ code is done on a separate offscreen canvas. This upside to sharing a canvas and WebGL context is that it makes some operations like making the canvas full size or taking a screenshot of the canvas easier than if we were to use two canvases. Our PlayCanvas project uses two canvases because there were too many difficulties having them run together (this may be addressed in the future).

 2. We have a WebGL cache defined in `context-wrapper.js` that stores part of the WebGL state. This cache greatly speeds up our WebGL calls. However, in some situations, it has provided incorrect/stale data (hopefully these bugs have all been fixed!). When debugging WebGL bugs, I recommend first checking to see if removing the context-wrapper from `camera-loop.js` fixes the problem to help narrow down the issue. This means going to `camera-loop.js` and finding and commenting out:

```js
// remove contextWrapper's wrapping
 // contextWrapper(drawCtx, xrcc.config.verbose, isWebGl2)
 // contextWrapper(computeCtx, xrcc.config.verbose, isWebGl2)

 // You still need this for WebGL1, since we act like even WebGL1.bindVertexArray() is a function
 if (!isWebGl2) {
 const drawExt = drawCtx.getExtension('OES_vertex_array_object')
 console.log('drawExt: ', drawExt)
 drawCtx.createVertexArray = () => drawExt.createVertexArrayOES()
 drawCtx.deleteVertexArray = (vao) => { drawExt.deleteVertexArrayOES(vao) }
 drawCtx.bindVertexArray = (vao) => { drawExt.bindVertexArrayOES(vao) }
 drawCtx.isVertexArray = vao => drawExt.isVertexArrayOES(vao)
 drawCtx.VERTEX_ARRAY_BINDING = drawExt.VERTEX_ARRAY_BINDING_OES

 const computeExt = computeCtx.getExtension('OES_vertex_array_object')
 console.log('computeExt: ', computeExt)
 computeCtx.createVertexArray = () => computeExt.createVertexArrayOES()
 computeCtx.deleteVertexArray = (vao) => { computeExt.deleteVertexArrayOES(vao) }
 computeCtx.bindVertexArray = (vao) => { computeExt.bindVertexArrayOES(vao) }
 computeCtx.isVertexArray = vao => computeExt.isVertexArrayOES(vao)
 computeCtx.VERTEX_ARRAY_BINDING = computeExt.VERTEX_ARRAY_BINDING_OES
 }
```

#### Reading the buffer data

In WebGL2 there is a function `gl.getBufferSubData` that will allow you to read the contents of a buffer. Note that WebGL2, even though it's based on OpenGL ES 3.0 does not support `gl.mapBuffer` because there is no performant and safe way to expose that function.

#### webgl-debug.js

<https://www.khronos.org/webgl/wiki/Debugging>

First you want to download `webgl-debug.js` which you can find [here](<https://github.com/KhronosGroup/WebGLDeveloperTools/blob/master/src/debug/webgl-debug.js>).

Add the following tag to your `head.html`.
```html
<script src="https://raw.githubusercontent.com/KhronosGroup/WebGLDeveloperTools/master/src/debug/webgl-debug.js"></script>
```

Sometimes, this doesn't add WebGLDebugUtils to the window, so I'll copy the file over into my project and then add the line `window.WebGLDebugUtils = WebGLDebugUtils`. I also change `WebGLDebugUtils = function() {` to `const WebGLDebugUtils = function() {`. Finally, I'll import the file in `app.js`.

Then wrap the contexts inside `camera-loop.js`'s `createContext()` with the following line:
```js
drawCtx = WebGLDebugUtils.makeDebugContext(drawCtx)
computeCtx = WebGLDebugUtils.makeDebugContext(computeCtx)
```

The `logGLCall` function can be added at the top of the file:
```js
function logGLCall(functionName, args) {
 console.log("gl." + functionName + "(" +
 WebGLDebugUtils.glFunctionArgsToString(functionName, args) + ")");
}
```

# Spector

[Spector.js](<https://github.com/BabylonJS/Spector.js>) helps debug WebGL scenes by listing all WebGL calls and visualizing frame buffers.

One reason Spector is so useful is that it adds ids to each WebGL object, such as framebuffers. This allows you to clearly determine when a buffer was changed.
```html
<script type="text/javascript" src="https://spectorcdn.babylonjs.com/spector.bundle.js"></script>
```

My standard flow is:
```js
// inside camera-loop createContext()
const createContext = () => {
 // ... creation of contexts ...

 const spector = new SPECTOR.Spector();
 window.spector = spector
 window.spector.startCapture(
 computeCanvas, // works better with canvas instead of context
 30000, // max number of commands to capture
 false // false records framebuffers
 )
 window.spector.displayUI()

 // ...
}

// inside camera-loop updateFrame()
let frameIdx = 0

const updateFrame = (timestamp_) => {
 if (window.spector) {
 	// this is incredibly useful to see how the opengl calls and state change each run loop
 window.spector.setMarker(`Frame ${frameIdx}`)
 }
 frameIdx = frameIdx + 1
 console.log('On frame : ', frameIdx)
 // Only go 15 frames before stopping and showing the webgl commands made during those 15 frames
 if (frameIdx === 15) {
 console.log('Stopping capture')
 window.spector.stopCapture()
 XR8.stop()
 }

 // ... other logic
}
```

## Other Tips

#### Internal QR code scanner site

If the mobile phone’s camera app does not support QR code scanning and redirecting, you can open the URL link below to access 8th Wall QR code scanner site to scan the QR code.

**
