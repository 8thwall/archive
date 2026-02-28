# Engine Codelab

## Overview

The "engine" means the JS and C++ code that backs our AR algorithms. The C++ code is transpiled into wasm using our Bazel build system and served to the client where it runs locally.

The JS code is a light wrapper over the C++ logic. There are two main pipelines in the engine: Face Effects and SLAM. The SLAM pipeline is for world and image tracking.

Below is one way to categorize the layers of the engine:

#### 1) JS Graphics Integration Layer

These provide an abstraction layer over our two main pipelines to easily integrate them into the supported Javascript graphics engines.

You can learn more about the lifecycle and API that we provide to our users at our public docs.

They are all located in [8thwall/reality/app/xr/js/src](<https://github.com/8thwall/8thwall/tree/master/reality/app/xr/js/src>).

Examples include:

 * threejs-renderer.js

 * xr-aframe.js

 * xr-bablyonjs.js

 * xr-playcanvas.js

 * xr-sumerian.js

#### 2) Pipeline Javascript Layer

The two current examples are XR8.FaceController.pipelineModule() and XR8.XrController.pipelineModule(). These directly call the C++ logic.

Other lower level pipeline modules include:

 * camera-loop.js - handles visualizing the camera input

 * gl-renderer.js - logic for webgl rendering and state management

 * context-wrapper.js - wrapper and cache layer around webgl calls

 * callback-manager.js - manages communication between the different pipeline modules

 * and more!

#### 3) Cap'n Proto

This serialization library lets us easily pass data between our Javascript and C++ (Wasm) logic. The files that define the data types have a .capnp extension, such as `reality.capnp` or `face.capnp`.

When JS calls a C++ function that has been transpiled into wasm, the function has the signature `_c8EmAsm_<cppfunc>`.

#### 4) C++ Entrypoint

The two examples are `facecontroller.cc` and `engine.cc`

#### 5) C++ Backend

Most of the logic for the engine is in [8thwall/reality/engine/](<https://github.com/8thwall/8thwall/tree/master/reality/app/engine>).

A lot of the debugging tools for the C++ logic are in [8thwall/reality/quality/](<https://github.com/8thwall/8thwall/tree/master/reality/app/quality>). This code is not compiled to WASM or sent to the client. These debugging tools most involve visualizing the graphics using opencv windows.

The lowest level of the C++ backend is in [8thwall/c8](<https://github.com/8thwall/8thwall/c8>), such as the matrix, vector, and camera classes.

<br />

## Developing

When developing across all layers of the engine's stack, you're typically using and 8w workspace project that retrieves its 8th Wall package from your local server.

This development is typically done using 8th Walls developement workspace "8w" .

You start your server by running:
```bash
bazel run --platforms=//bzl:wasm32 //reality/app/xr/js:serve-xr
```

or if you want to run in release run:
```bash
bazel run --config=wasmrelease //reality/app/xr/js:serve-xr
```

or if you want to run in release with simd run:
```bash
bazel run --config=wasmreleasesimd //reality/app/xr/js:serve-xr
```

If you are getting errors, you may have to run `npm install` from `/8thwall` and from `/8thwall/apps/client/public/web/xrextras`.

To point your 8w project to your local server, you'll do the following:

 * Go to the project section of your server.

 * Click "Device Authorization"

 * Change "Release Version [XX.X.X.XXX](<http://XX.X.X.XXX>)" to "Local Version 0.0.0.0"

 * Input your public wifi's address into custom engine location. This can be found using `ipconfig getifaddr en0` or going to `System Preferences -> Network`. An example custom engine location is `https://192.168.1.99:8888/reality/app/xr/js/xr.js`. You could also use `https://localhost:8888/reality/app/xr/js/xr.js` if you were only doing desktop development, however your phone wouldn't be able to communicate with your computer's server.

 * Click "Update browser token"

 * You'll now have to accept permissions. To do this in your phone or computer's browser, go to the custom engine location, such as `<https://192.168.1.99:8888/reality/app/xr/js/xr.js`,> and follow the instructions until you see the code.

 * Now, when you go to your version of the project's url, such as it will be using your local 8thwall.

### Developing for PlayCanvas

This guide should get you started: but there are a few custom steps to get it working with a local engine:

 * Fork a sample project on Play Canvas.

 * Set the app key under external scripts to the app key from an 8th Wall project, i.e.

 * Run the project successfully once with the release engine to confirm things are working (get a release token on your phone from the 8th Wall project if your device doesn't already have it).

 * Go to that 8th wall project and set it to Local Version 0.0.0.0 and put in the local engine URL as `https://10.8.8.123:8888/reality/app/xr/js/xr.js?appKey=XXXXXX` where `XXXXXX` is your app key that you also set in Play Canvas. Scan the QR code with your phone to get the local token. You'll also need to visit `https://10.8.8.123:8888/reality/app/xr/js/xr.js?appKey=XXXXXX` from your device and navigate past the security warning.

 * You can now run the Play Canvas project with a local engine version.

This is the link for accessing the nightly PlayCanvas engine build: <https://code.playcanvas.com/playcanvas-latest.dbg.js>

### Developing on Web

Developing for the Web has a higher developer velocity in comparison to mobile development. For now don't click on the "open here" link in the Preview button of the editor for your project or it will update your token. Instead, just have a separate tab open with your version of the project's url.

### Developing on iOS

<https://www.kenst.com/2019/03/how-to-debug-problems-on-mobile-safari/>

You may encounter problems when debugging such as your Safari window crashing whenever you are trying to debug. Follow these suggestions:
<https://stackoverflow.com/a/49538957/4447761>

### Developing on Android

<https://developers.google.com/web/tools/chrome-devtools/remote-debugging>

<br />

<br />

## Testing your code
```bash
bazel build //reality/quality/...
bazel test //reality/engine/... --test_output=errors
```

## Linting your code

You can use `clang-format -i` to lint your code .cc / .h files, or the "clang-format" VSCode extension. These aliases might also be useful, you can add them to your `.zshrc` or `.bashrc` file:
```bash
alias cf="clang-format -i"
alias cfm="git diff --name-only | egrep '\.h$|\.cc$' | xargs -I {} clang-format -i {}"
```

## Running benchmark code through a browser

In 8thwall
```bash
bazel test //reality/engine/features:<target_name>-benchmark-test --config=jsrun --test_arg=--browser --test_arg=--chrome
```

In repo/niantic
```bash
bazel test --config=chrome //reality/engine/features:<target_name>-benchmark-test
```
