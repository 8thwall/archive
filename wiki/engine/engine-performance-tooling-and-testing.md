# Engine Performance Tooling and Testing

## Before you optimize: measure

Because of Amdahl's law, your optimization will have an effect on the entire engine proportional to the percentage of that part's usage within the engine. Functions that take up 20%+ of the engine are prime target for optimization.

To measure,

 * Build a debug version of omniscope `bazel build -c dbg //apps/client/internalqa/omniscope/imgui:omniscope`

 * Run dsymutil on the built binary `dsymutil bazel-out/darwin-dbg/bin/apps/client/internalqa/omniscope/imgui/omniscope`

 * Run the binary `bazel-out/darwin-dbg/bin/apps/client/internalqa/omniscope/imgui/omniscope`

 * Open MacOS Instrument, use Time Profiler, set the processs to collect data from to omniscope

 * Hit Record then Stop when the sequence run finishes.

 * Either drill down via the call stack, OR, Cmd + F, check "Auto expand" then find the interested function.

 * Double-click on a function to see time spent in it and its children (only available if you ran dsymutil).

## Tools to improve engine's performance

### Google Benchmark

 * Google Benchmark

Check out `*-benchmark.cc` files in our codebase for usage of Google Benchmark. These are micro-benchmark designed to optimize a hot loop.

### Benchmark JS

 * Benchmark JS - our internal js tool that looks at the self summarizing log.

 * For non-simd
`bazel run --platforms=//bzl:wasm32 //apps/client/benchmark/js:serve`

 * For simd:

`bazel run --platforms=//bzl:wasm32 --features=simd //apps/client/benchmark/js:serve`

### Special case for Ceres cost function

Ceres' cost functions are generally prime target for optimizing. Get your Ceres' cost function working in AutoDiff first. Once it works as you expect, you can produce an analytical version of your function using `sympy`. See an example in `reality/engine/geometry/analytical-residual/position-target.py`. The idea is to symbolically compute both the residual vector and its jacobian then generate the C++ code for it.

Note that there are a set of techniques for approximating calculations. Sympy won't be able to perform these tricks. Apply these tricks only if they show worthy improvement to the overall engine. They tend to make reading the code harder.

 * <https://en.wikipedia.org/wiki/Fast_inverse_square_root>

 * When x is close to zero, sin(x) ~= x (see ceres/rotation.h)

### Trace8

 * Trace8 - seems to add to c++ logging

### Admin console logs

 * We used to have phones attached to Jenkins that would post results to ac. Uses the SelfSummarizingLog.

# Memory Usage

We are unable to use Mac Instruments on our wasm package because the package is too big. On Android you can do it through Chrome.

### Valgrind

Note: I'm actually having issues with below, you may not want to do this! I get:
```json
[ RUN ] DetectionImageLoaderTest.TrackLoadPlanarImage
--32026-- UNKNOWN mach_msg unhandled MACH_SEND_TRAILER option
--32026-- UNKNOWN mach_msg unhandled MACH_SEND_TRAILER option (repeated 2 times)
UNKNOWN workq_ops option 1024
^Cexternal/bazel_tools/tools/test/test-setup.sh: line 306: 32030 Killed: 9 tee -a "${XML_OUTPUT_FILE}.log"
[1] 28075 killed bazel run //reality/engine/imagedetection:detection-image-loader-test -c dbg
```

 * Install with: <https://stackoverflow.com/a/61359781/4979029>

 * Run with something like: `bazel run //apps/client/internalqa/omniscope/imgui:omniscope --copt="-g" --run_under='valgrind --tool=callgrind' -- -r /Users/paris/datarecorder/Paris7/b/fishtank-log.1605558379-1800`

# SLAM Correctness

benchmarkjs shows the pixel difference between what we do and what ARCore does. Changes to the engine should keep these values similar and lower.
