# Semantics Segmentation

## Current State

Currently the working version of the semantics model running on C8 → webworker can be found here: . It only runs the landscape tflite model. It will display semantics if the mobile device is rotated portrait, but its cropped to fit a letterbox landscape.

Note that this requires running the engine locally. In order to get this working, make sure to go into: `reality/app/xr/js/src/semantics-controller.js` to change the following code:
```cpp
const blob = new Blob([`
 importScripts(\`https://10.8.8.158:8888/reality/app/xr/js/semantics-worker.js\`)
 SEMANTICSMODULE().then(() => self.initWorker())
```

to use your localhost ip address.

Note: There isn’t a full implementation for accommodating between Android using SIMD and IOS. Thus, to achieve optimal performance on Android run:

`bazel run --config=jsreleasesimd //reality/app/xr/js:serve-xr`

Otherwise run:

`bazel run --config=jsrelease //reality/app/xr/js:serve-xr`

Decision on the chosen semantics model can be found at `<REMOVED_BEFORE_OPEN_SOURCING>` (Google Doc). TLDR: Using quarter res, non inverted residuals TFLite FP16

Next steps:

 * Support portrait and landscape inputs (check Supporting Landscape/Portrait Inputs for current progress and further steps)

 * Consider fetching the TFLite directly from cc instead of js->cc

 * Consider optimizing the model such as adding quantization. It seems like the DLProd is doing some kind of quantization during the conversion stage here.

 * Upload `semantics-webworker.js` on cdn and update the `importScripts` line above.

## Supporting Landscape/Portrait Inputs

There are two current approaches: rotating the weights and changing the tensor shapes. The approach to rotating the weights works without bugs but doesn’t show the most accurate results. Changing the tensor shapes has proven to be quite difficult due to the transposing between NHWC and NCHW and also introduces some bugs that will be noted below

Note that most of these changes aren’t adjusted for the rest of the semantics code such as `semantics-classifer-test` and omniscope views.

References:

 * TFLite Flatbuffer schema [documentation](<https://github.com/tensorflow/tensorflow/blob/master/tensorflow/lite/schema/schema.fbs>)

 * Rotating weights (from DLProd):

 * Rewriting the tensor

 * Obtaining weights

 * Setting matrices to rotate the kernel weights

 * Rotating weights function

### Rotating the Weights

The PR containing this code can be found here following this PR (which includes some documentation on the rotator).

When rotating the weights, the tensors selected to be rotated are only the convolutional tensors with the same height and width, both of which should be greater than 1. It can rotate either CCW or CW depending on the initial orientation of the model.

The PR above assumes the original model is landscape that will be needed to be rotated portrait to support portrait inputs.

Some examples on the results of this current approach here (displaying sky, ground, grass respectively):

These results are less confident than the original portrait appearance:

The differences is also confirmed in ARDK. Further testing could be done to see the differences between these portrait models.

To run this approach run:
```bash
bazel run reality/quality/semantics:semantics-from-generator -- /Users/lynndang/repo/code8/reality/engine/semantics/testdata/test-input-portrait.png /tmp/ && open /tmp/
```

This will automatically rotate the model weights to accommodate a portrait image turn landscape.

Next steps if we go this route:

 * Continue investigating the issue with the discrepancy between the rotated weights and the original portrait image.

 * Update `semantics-classifier-test` . It currently uses a rotated landscape input for the portrait.

 * In `semantics-controller.cc` and `semantics-worker.js`, add code to rotate the weights.

 * In `semantics-controller.js` , allow the portrait image to be rotated CCW before being fed into the webworker. Possibly by adding `gpu-resizer-controller.cc` into the pipeline module.

 * Refactor `semantics-operations.h` new change to use the input constants `SEMANTICS_INPUT_HEIGHT` and `SEMANTICS_INPUT_WIDTH` everywhere else instead of the definitions ins `semantics-classifier.cc`

### Changing the Tensor Shapes

The PR containing this code can be found here.

Currently there is no automated process for changing the tensors since the tranpose between NHWC to NCHW make it harder to figure out which parts of the shape to swap for example (from the diff between running `tflite-graph` on the portrait and the landscape models:
```
< {idx: 334, name: Pad_7, shape: [1][192][34][2], type: FLOAT32, has_buffer: 1, quantization: non-null!!!}
---
> {idx: 334, name: Pad_7, shape: [1][192][2][34], type: FLOAT32, has_buffer: 1, quantization: non-null!!!}
828c828
< {idx: 335, name: transpose_58, shape: [1][34][2][192], type: FLOAT32, has_buffer: 1, quantization: non-null!!!}
---
> {idx: 335, name: transpose_58, shape: [1][2][34][192], type: FLOAT32, has_buffer: 1, quantization: non-null!!!}
```

As of now the implementation copies the shape from the portrait model to the landscape model. However, when running the new model it will give the follow error upon loading the model:
```
ERROR: external/org_tensorflow/tensorflow/lite/kernels/concatenation.cc:80 t->dims->data[d] != t0->dims->data[d] (16 != 9)
ERROR: Node number 335 (CONCATENATION) failed to prepare.
```

To test this approach, first ensure that both semantics tflite’s are the original landscape and portrait versions. Then run `model-rotator` which will produce a `semantics_fp16_new.tflite` in `/tmp/`.
```bash
bazel run reality/quality/deepnets:model-rotator
```

This file can be copied over to `reality/engine/semantics/data/`. Change the file name to `semantics_fp16_portrait.tflite` , and run:
```bash
bazel run reality/quality/semantics:semantics-from-generator -- /Users/lynndang/repo/code8/reality/engine/semantics/testdata/test-input-portrait.png /tmp/ && open /tmp/
```

Make sure `bool isLandscape = false;`

This should provide visual results of the semantics, but it will instead give the error as seen above.

Some ways to debug this:

 * Using Netron to open up the models and compare the nodes. Documentation can be found here.

 * Model inspector can be used running the following command (be sure to modify the `model-inspect.cc` to the desired tflite file):

```bash
bazel run reality/quality/deepnets:model-inspector | less
```

Next steps if we go this route:

 * Debug the problem with rotating the shapes by comparing the rotated model with the fp16 portrait tflite.

 * Model inspector provides information about the tensor index, name, shape, type, buffer, quantization

 * Netron can search through the nodes for the tensor name and provide information on the weights.

 * Add the new model rotator into `semantics-operations.cc` and `semantics-classifier.cc`

 * Update omniscope’s class views to not take in the portrait tflite and instead the landscape semantics model but rotated from `semantics-classifier`

 * Update `semantics-controller.cc` and `semantics-worker.js` to rotate the model.

 * `semantics-controller.js` is mostly adjusted already to deal with rotated orientation, but the display still assumes everything is landscape

 * Update `semantics-classifier-test.cc` for the portrait input test.

 * Refactor `semantics-operations.h` new change to use the input constants `SEMANTICS_LONG_AXIS` and `SEMANTICS_SHORT_AXIS` everywhere else instead of the definitions ins `semantics-classifier.cc`

## Performance Testing

Documentation for using TFJS `model.json` format and problems with using `tfjs-tflite` on WebGL can be found at `<REMOVED_BEFORE_OPEN_SOURCING>` (Google Doc).

The performance chart below is based on running the tflite. `input` involves resizing and setting up the input tensor. `invoke` only includes running the tflite with the input tensor. `output` includes obtaining the output tensor from the semantics. `total semantics generation` is the total of all 3 processes.

For android only, `omniscope-js` is built with `simd`.

# 09/28/22

Inference results quality study here

This study compares the results of:

 1. landscape image + landscape model

 2. landscape-rotate portrait image + portrait model

 3. landscape-rotate portrait image + tensor-rotated portrait model

Comparison between 3 & 1

MSE value is **15.453559027777779**

portrait model CW PSNR value is **36.24051845513267 dB**

Comparison between 2 & 1

MSE value is **40.443874782986114**

portrait model PSNR value is **32.062276037546965 dB**

Rotating landscape images with tensor rotated model produces better quality results than not rotating the convolution tensors.

# 09/15/22

Test the performance of single channel sky semantics model.

iOS devices are running with engine built by -

`bazel run --config=jsrelease //reality/app/xr/js:serve-xr`

Android devices are running with engine built by -

`bazel run --config=jsreleasesimd //reality/app/xr/js:serve-xr`

Omniscope is build by -

bazel run --cpu=js apps/client/internalqa/omniscope/js/server

omniscope-js is running the inference using tflite wasm inside omniscope.

tflite webworker is running through a web worker outside engine code.

The results from landscape models are as expected.

semantics_sky_**small** _landscape_09152022_fp16.tflite

| Build | **Phone** | **FPS** | **Input (ms)** | **Invoke (ms)** | **Output (ms)** | **Semantics Generation (ms)** | **Additional notes** |
|------------------|--------------------|----------|-----------------|------------------|------------------|--------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| omniscope-js | iPhone 12 Pro Max | 8.9 | 0.09 | 103 | 0.0156 | | invoke time increases over time |
| tflite webworker | iPhone 12 Pro Max | | | 103 | | | invoke time increases over time. If refresh the apge, the invoke time decreases for a few frames, then starts to increase again. |
| omniscope-js | iPhone 7 | 3.9 | | 234 | | | |
| tflite webworker | iPhone 7 | | | 410 | | | invoke time increases over time |
| omniscope-js | Samsung S10 | 4.5 | | 194 | | | invoke time increases over time |
| tflite webworker | Samsung S10 | | | 82 | | | |
| omniscope-js | OnePlus 9 Pro | 5.5 | | 155 | | | |
| tflite webworker | OnePlus 9 Pro | | | 66 | | | |

semantics_sky_**tiny** _**landscape** _09152022_fp16.tflite

| Build | **Phone** | **FPS** | **Input (ms)** | **Invoke (ms)** | **Output (ms)** | **Semantics Generation (ms)** | **Additional notes** |
|------------------|--------------------|----------|-----------------|------------------|------------------|--------------------------------|-----------------------------------------------|
| omniscope-js | iPhone 12 Pro Max | 9.85 | 0.0976 | 92.82 | 0.0132 | | |
| tflite webworker | iPhone 12 Pro Max | | | 90 | | | webworker invoke time increases over time |
| omniscope-js | iPhone 7 | 4.7 | | 192.3 | | | |
| tflite webworker | iPhone 7 | | | 230 | | | |
| omniscope-js | Pixel 3 | | | | | | |
| tflite webworker | Pixel 3 | | | | | | |
| omniscope-js | Samsung S10 | 5.4 | | 157 | | | |
| tflite webworker | Samsung S10 | | | 96 | | | |
| omniscope-js | Samsung S22 | | | | | | |
| tflite webworker | Samsung S22 | | | | | | |
| omniscope-js | OnePlus 9 Pro | 6 | | 132 | | | invoke time increases **slightly** over time |
| tflite webworker | OnePlus 9 Pro | | | 60 | | | |

# As of 09/02/22

| Build | Phone | FPS | Input (ms) | Invoke (ms) | Output (ms) | Semantics Generation (ms) | Additional notes |
|----------------|--------------------|--------|-------------|--------------|--------------|----------------------------|------------------------------------------------------------------------------------|
| omniscope-js | Samsung S22 | 9-11 | 0.099 | 72 | 2.75 | | |
| tf-js; wasm | Samsung S22 | 10 | 0.695 | 60-80 | 14.734 | 80.986 | invoke creeps up over time (same goes for webgl) |
| tf-js; webgl | Samsung S22 | 9-11 | 0.7 | 60-70 | 13 | 82-85 | |
| android native | Samsung S22 | 9-11 | 0.169 | 70-90 | 3.287 | 70-90 | invoke fluctuates a lot |
| omniscope-js | Samsung S21 | | | | | | |
| tf-js; wasm | Samsung S21 | 3-4 | 1.138 | 310 - 320 | 20.25 | 340-350 | |
| tf-js; webgl | Samsung S21 | 4-5 | 0.9 | 310-320 | 16.782 | 330-340 | |
| android native | Samsung S21 | 9-10 | 0.17 | 90-105 | 3.17 | | |
| ARDK app | Samsung S21 | 30(?) | | | | | Time delay to identify the semantics seems to be rather similar to android native |
| omniscope-js | Pixel 3 | 2-3 | 0.333 | 328 | 6.16 | | |
| tf-js; wasm | Pixel 3 | 2-3 | 1.7 | 330-340 | 34.049 | 370 | |
| tf-js; webgl | Pixel 3 | 2-4 | | 330-335 | | 365 | invoke creeps up over time |
| android native | Pixel 3 | 5-8 | 0.211 | 113-140 | 7.08 | | starts off fast but slows down later |
| omniscope-js | iPhone 12 Pro Max | 4-5 | 0.1 | 210-220 | 0.75 | | |
| tf-js; wasm | iPhone 12 Pro Max | 4-6 | 0.502 | 230-240 | 3.60 | 240-250 | |
| tf-js; webgl | iPhone 12 Pro Max | 4-6 | 0.340 | 230-240 | 3.7 | 240-250 | |
| tf-js; wasm | iPhone 7 | 2-3 | 1.228 | 360-370 | 9.950 | 370-380 | |
| tf-js; webgl | iPhone 7 | 2-3 | 0.726 | 360-370 | 6.188 | 370-380 | |

# As of 08/02/22

Notes:

 * tf-js wasm doens’t work due to this [error](<https://github.com/tensorflow/tfjs/issues/4824>):

`Kernel 'SparseToDense' not registered for backend 'wasm'`

 * tf-js runs with dynamic input; but tflite runs with fixed-sized input

 * tflite on fp16 seems much slower than before

 * tflite on int8 seems to run really slow, so some data couldn’t be retrieved

## Semantics v0_10

### fp32

| Build | Phone | FPS | FPS (async) | Input (ms) | Invoke (ms) | Output (ms) | Total Time (ms) |
|----------------|--------------------|------|--------------|-------------|--------------|--------------|------------------|
| omniscope-js | Samsung S22 | 5-6 | | 0.098 | 140-150 | 0.397 | |
| android native | Samsung S22 | 6-7 | | 0.116 | 130-140 | 0.370 | |
| tflite-js | Samsung S22 | 5-7 | 5-6 | 0.540 | 150-160 | 11.531 | |
| tf-js; webgl | Samsung S22 | 4-5 | 8-10 | 0.703 | 130-140 | 100.309 | |
| tf-js; wasm | Samsung S22 | | | | | | |
| omniscope-js | iPhone Pro 12 Max | 2-3 | | 0.11 | 320-330 | 0.306 | |
| tflite-js | iPhone Pro 12 Max | 3-4 | 3-4 | 0.383 | 330-340 | 4.678 | 340-350 |
| tf-js; webgl | iPhone Pro 12 Max | 6-7 | 7-8 | 0.472 | 100-120 | 33.163 | 150-160 |
| tf-js; wasm | iPhone Pro 12 Max | | | | | | |

### fp16

| Build | Phone | FPS | FPS (async) | Input (ms) | Invoke (ms) | Output (ms) | Total Time (ms) |
|----------------|--------------------|------|--------------|-------------|--------------|--------------|------------------|
| omniscope-js | Samsung S22 | 5-6 | | 0.133 | 150-160 | 0.424 | |
| android native | Samsung S22 | 5-6 | | 0.131 | 160-170 | 0.411 | |
| tflite-js | Samsung S22 | 4-5 | 3-4 | 0.736 | 210-220 | 14.338 | 230-240 |
| tf-js; webgl | Samsung S22 | 4-5 | 7 | 1.124 | 110-120 | 104.303 | 200-215 |
| tf-js; wasm | Samsung S22 | | | | | | |
| omniscope-js | iPhone Pro 12 Max | 2-3 | | 0.118 | 420-430 | 0.52 | |
| tflite-js | iPhone Pro 12 Max | 3-4 | 2-4 | 0.532 | 350-360 | 3.866 | 370 |
| tf-js; webgl | iPhone Pro 12 Max | 6-7 | 7-8 | 0.474 | 110-120 | 34.088 | 140-150 |
| tf-js; wasm | iPhone Pro 12 Max | | | | | | |

### int8

| Build | Phone | FPS | FPS (async) | Input (ms) | Invoke (ms) | Output (ms) | Total Time (ms) |
|----------------|--------------------|--------|--------------|-------------|--------------|--------------|------------------|
| omniscope-js | Samsung S22 | 0.441 | | 0.120 | 2100-2200 | 0.4258 | |
| android native | Samsung S22 | | | | | | |
| tflite-js | Samsung S22 | | | | | | |
| tf-js; webgl | Samsung S22 | 4-5 | 8-10 | 0.213 | 130-140 | 16.617 | 230-240 |
| tf-js; wasm | Samsung S22 | | | | | | |
| omniscope-js | iPhone Pro 12 Max | | | | | | |
| android native | | | | | | | |
| tflite-js | iPhone Pro 12 Max | | | | | | |
| tf-js; webgl | iPhone Pro 12 Max | 6-7 | 6-8 | 0.532 | 110-120 | 32.279 | 140-150 |
| tf-js; wasm | iPhone Pro 12 Max | | | | | | |

 * Note: tflite seems wrong

## Semantics v0_10__quarter_res

### fp32

| Build | Phone | FPS | FPS (async) | Input (ms) | Invoke (ms) | Output (ms) | Total Time (ms) |
|----------------|--------------------|-------|--------------|-------------|--------------|--------------|------------------|
| omniscope-js | Samsung S22 | 5-6 | | 0.130 | 120-130 | 0.470 | |
| android native | Samsung S22 | | | | | | |
| tflite-js | Samsung S22 | 7 | 6-7 | 0.546 | 95-105 | 11.944 | 115-125 |
| tf-js; webgl | Samsung S22 | 5-6 | 9-10 | 0.743 | 110-120 | 48.122 | 170-180 |
| tf-js; wasm | Samsung S22 | | | | | | |
| omniscope-js | iPhone Pro 12 Max | 3-4 | | 0.122 | 270-280 | 0.557 | |
| tflite-js | iPhone Pro 12 Max | 4-5 | 4-5 | 0.751 | 210-220 | 3.378 | 220-230 |
| tf-js; webgl | iPhone Pro 12 Max | 9-10 | 9-10 | 0.416 | 85-95 | 8.101 | 90-100 |
| tf-js; wasm | iPhone Pro 12 Max | | | | | | |

### fp16

| Build | Phone | FPS | FPS (async) | Input (ms) | Invoke (ms) | Output (ms) | Total Time (ms) |
|----------------|--------------------|------|--------------|-------------|--------------|--------------|------------------|
| omniscope-js | Samsung S22 | 7-8 | | 0.104 | 95-105 | 0.389 | |
| android native | Samsung S22 | | | | | | |
| tflite-js | Samsung S22 | 5-6 | 5-6 | 0.741 | 140-150 | 15.134 | 160-170 |
| tf-js; webgl | Samsung S22 | 5-6 | 8-9 | 1.010 | 120-130 | 55.342 | 190-200 |
| tf-js; wasm | Samsung S22 | | | | | | |
| omniscope-js | iPhone Pro 12 Max | 3-4 | | 0.13 | 285-295 | 0.595 | |
| tflite-js | iPhone Pro 12 Max | 2-4 | 2-3 | 0.925 | 380-390 | 5.860 | 390-400 |
| tf-js; webgl | iPhone Pro 12 Max | 8-9 | 6-8 | 0.47 | 90-100 | 8.463 | 100-110 |
| tf-js; wasm | iPhone Pro 12 Max | | | | | | |

### int8

| Build | Phone | FPS | FPS (async) | Input (ms) | Invoke (ms) | Output (ms) | Total Time (ms) |
|----------------|--------------------|-------|--------------|-------------|--------------|--------------|------------------|
| omniscope-js | Samsung S22 | | | | | | |
| android native | Samsung S22 | | | | | | |
| tflite-js | Samsung S22 | | | | | | |
| tf-js; webgl | Samsung S22 | 5 | 9-10 | 1.023 | 120-130 | 53.93 | 180-190 |
| tf-js; wasm | Samsung S22 | | | | | | |
| omniscope-js | iPhone Pro 12 Max | | | | | | |
| android native | | | | | | | |
| tflite-js | iPhone Pro 12 Max | | | | | | |
| tf-js; webgl | iPhone Pro 12 Max | 9-10 | 8-10 | 0.392 | 85-95 | 7.993 | 100-110 |
| tf-js; wasm | iPhone Pro 12 Max | | | | | | |

## Semantics single_inv_residuals

### fp32

| Build | Phone | FPS | FPS (async) | Input (ms) | Invoke (ms) | Output (ms) | Total Time (ms) |
|----------------|--------------------|--------|--------------|-------------|--------------|--------------|------------------|
| omniscope-js | Samsung S22 | 6-7 | | 0.111 | 120-130 | 0.384 | |
| android native | Samsung S22 | | | | | | |
| tflite-js | Samsung S22 | 4-7 | 6-8 | 0.728 | 130-140 | 13.490 | 160-170 |
| tf-js; webgl | Samsung S22 | 5-6 | 9-11 | 0.898 | 120-130 | 57.578 | 190-200 |
| tf-js; wasm | Samsung S22 | | | | | | |
| omniscope-js | iPhone Pro 12 Max | 4-5 | | 0.008 | 200-110 | 0.461 | |
| tflite-js | iPhone Pro 12 Max | 3-6 | 5-6 | 0.429 | 240-250 | 7.322 | 260-270 |
| tf-js; webgl | iPhone Pro 12 Max | 10-11 | 10-12 | 0.353 | 60-70 | 15.598 | 70-80 |
| tf-js; wasm | iPhone Pro 12 Max | | | | | | |

### fp16

| Build | Phone | FPS | FPS (async) | Input (ms) | Invoke (ms) | Output (ms) | Total Time (ms) |
|----------------|--------------------|------|--------------|-------------|--------------|--------------|------------------|
| omniscope-js | Samsung S22 | 6-7 | | 0.09757 | 110-125 | 0.3667 | |
| android native | Samsung S22 | | | | | | |
| tflite-js | Samsung S22 | 5-6 | 5-7 | 0.723 | 135-140 | 12.89 | 160-170 |
| tf-js; webgl | Samsung S22 | 5-6 | 9-11 | 0.699 | 140-150 | 62.502 | 160-170 |
| tf-js; wasm | Samsung S22 | | | | | | |
| omniscope-js | iPhone Pro 12 Max | 3-4 | | 0.112 | 230-240 | 0.675 | |
| tflite-js | iPhone Pro 12 Max | 2-3 | 2-3 | 0.716 | 270-280 | 4.736 | 290-300 |
| tf-js; webgl | iPhone Pro 12 Max | 3-4 | 9-10 | 0.445 | 280-290 | 8.207 | 290-300 |
| tf-js; wasm | iPhone Pro 12 Max | | | | | | |

### int8

| Build | Phone | FPS | FPS (async) | Input (ms) | Invoke (ms) | Output (ms) | Total Time (ms) |
|----------------|--------------------|------|--------------|-------------|--------------|--------------|------------------|
| omniscope-js | Samsung S22 | | | | | | |
| android native | Samsung S22 | | | | | | |
| tflite-js | Samsung S22 | | | | | | |
| tf-js; webgl | Samsung S22 | 5-6 | 12-13 | 0.973 | 130-140 | 60.666 | 200-210 |
| tf-js; wasm | Samsung S22 | | | | | | |
| omniscope-js | iPhone Pro 12 Max | | | | | | |
| android native | | | | | | | |
| tflite-js | iPhone Pro 12 Max | | 1-2 | | | | |
| tf-js; webgl | iPhone Pro 12 Max | 4-5 | 9-11 | 0.585 | 210-220 | 4.255 | 220-230 |
| tf-js; wasm | iPhone Pro 12 Max | | | | | | |

## Semantics single_inv_residuals__quarter_res

 * Omniscope-js might not work:

 * `Attempting to use a delegate that only supports static-sized tensors with a graph that has dynamic-sized tensors`

### fp32

| Build | Phone | FPS | FPS (async) | Input (ms) | Invoke (ms) | Output (ms) | Total Time (ms) |
|----------------|--------------------|--------|--------------|-------------|--------------|--------------|------------------|
| omniscope-js | Samsung S22 | 9-10 | | 0.1 | 70-80 | 0.416 | |
| android native | Samsung S22 | | | | | | |
| tflite-js | Samsung S22 | 4-5 | 3-4 | 0.587 | 70-80 | 12.317 | 90-100 |
| tf-js; webgl | Samsung S22 | 6-7 | 11-13 | 0.868 | 90-100 | 43.929 | 150-160 |
| tf-js; wasm | Samsung S22 | | | | | | |
| omniscope-js | iPhone Pro 12 Max | 5-6 | | 0.151 | 160-170 | 0.650 | |
| tflite-js | iPhone Pro 12 Max | 4-5 | 6-7 | 0.318 | 180-190 | 7.163 | 190-200 |
| tf-js; webgl | iPhone Pro 12 Max | 12-13 | 10-13 | 0.432 | 50-60 | 7.882 | 70-80 |
| tf-js; wasm | iPhone Pro 12 Max | | | | | | |

### fp16

| Build | Phone | FPS | FPS (async) | Input (ms) | Invoke (ms) | Output (ms) | Total Time (ms) |
|----------------|--------------------|--------|--------------|-------------|--------------|--------------|------------------|
| omniscope-js | Samsung S22 | 8-10 | | 0.148 | 70-80 | 0.4122 | |
| android native | Samsung S22 | | | | | | |
| tflite-js | Samsung S22 | 7-9 | 6-8 | 0.769 | 90-100 | 14.463 | 115-125 |
| tf-js; webgl | Samsung S22 | 5-6 | 9-11 | 0.997 | 100-110 | 48.727 | 160-170 |
| tf-js; wasm | Samsung S22 | | | | | | |
| omniscope-js | iPhone Pro 12 Max | 5-6 | | 0.18 | 160-170 | 0.656 | |
| tflite-js | iPhone Pro 12 Max | 3-4 | 6-7 | 0.741 | 210-220 | 6.358 | 220-230 |
| tf-js; webgl | iPhone Pro 12 Max | 10-13 | 9-10 | 0.417 | 60-70 | 8.297 | 80-90 |
| tf-js; wasm | iPhone Pro 12 Max | | | | | | |
| | | | | | | | |

### int8

| Build | Phone | FPS | FPS (async) | Input (ms) | Invoke (ms) | Output (ms) | Total Time (ms) |
|----------------|--------------------|--------|--------------|-------------|--------------|--------------|------------------|
| omniscope-js | Samsung S22 | | | | | | |
| android native | Samsung S22 | | | | | | |
| tflite-js | Samsung S22 | | | | | | |
| tf-js; webgl | Samsung S22 | 5-6 | 9-11 | 0.955 | 90-100 | 48.459 | 155-165 |
| tf-js; wasm | Samsung S22 | | | | | | |
| omniscope-js | iPhone Pro 12 Max | | | | | | |
| android native | | | | | | | |
| tflite-js | iPhone Pro 12 Max | 1-2 | 4 | | | | |
| tf-js; webgl | iPhone Pro 12 Max | 10-11 | 11-12 | 0.511 | 60-80 | 12.098 | 75-90 |
| tf-js; wasm | iPhone Pro 12 Max | | | | | | |

## Webworker

 * int8 has poor quality

 * iPhone has better FPS, but very poor invoke time

 * It is actually running with cpu backend because

 * `Initialization of backend webgl failed`

 * This is also a [problem](<https://stackoverflow.com/questions/63475815/tensorflowjs-initialization-of-backend-webgl-failed-on-firefox-and-safari-with>) with firefox

 * The first table records data for the webworker passing in only 1 class of semantics as an array.

 * The second table records data for the webworker passing in ArrayBuffer which sends the full 21 semantics class scores

## Semantics single_inv_residuals__quarter_res

### fp32

| Build | Phone | FPS | Input (ms) | Invoke (ms) | Output (ms) | Total Time (ms) |
|--------------|--------------------|--------|-------------|--------------|--------------|------------------|
| tf-js; webgl | Samsung S22 | 15-23 | | 100-110 | | 180-190 |
| tf-js; webgl | iPhone Pro 12 Max | 20-30 | 0.308 | 8000+ | 6.769 | 8000+ |

| Build | Phone | FPS (arraybuf) | Input (ms) | Invoke (ms) | Output (ms) | Total Time (ms) |
|--------------|--------------------|-----------------|-------------|--------------|--------------|------------------|
| tf-js; webgl | Samsung S22 | 25-35 | 0.334 | 110-120 | 9.091 | 90-110 |
| tf-js; webgl | iPhone Pro 12 Max | 35-40 | 0.100 | 6000+ | ~0 | |

### fp16

| Build | Phone | FPS | FPS (async) | Input (ms) | Invoke (ms) | Output (ms) | Total Time (ms) |
|--------------|--------------------|--------|--------------|-------------|--------------|--------------|------------------|
| tf-js; webgl | Samsung S22 | 20-35 | | | 100-110 | | 170-180 |
| tf-js; webgl | iPhone Pro 12 Max | 30-35 | | | 6000+ | | 6000+ |

| Build | Phone | FPS | FPS (async) | Input (ms) | Invoke (ms) | Output (ms) | Total Time (ms) |
|--------------|--------------------|--------|--------------|-------------|--------------|--------------|------------------|
| tf-js; webgl | Samsung S22 | 35-35 | | 0.292 | 110-120 | 8.372 | |
| tf-js; webgl | iPhone Pro 12 Max | 35-50 | | 0.333 | 3000+ | 0.089 | |

 * iPhone cpu backend seems to have similar invoke time

### int8

| Build | Phone | FPS | FPS (async) | Input (ms) | Invoke (ms) | Output (ms) | Total Time (ms) |
|--------------|--------------------|--------|--------------|-------------|--------------|--------------|------------------|
| tf-js; webgl | Samsung S22 | 20-30 | | | 100-110 | | 160-170 |
| tf-js; webgl | iPhone Pro 12 Max | 25-35 | | | 5000+ | | 5000+ |

| Build | Phone | FPS | FPS (async) | Input (ms) | Invoke (ms) | Output (ms) | Total Time (ms) |
|--------------|--------------------|--------|--------------|-------------|--------------|--------------|------------------|
| tf-js; webgl | Samsung S22 | 25-40 | | 0.300 | 100-110 | 8.061 | |
| tf-js; webgl | iPhone Pro 12 Max | 30-40 | | 0.154 | 9000+ | ~0 | |
