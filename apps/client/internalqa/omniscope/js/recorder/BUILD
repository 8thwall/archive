load("@rules_cc//cc:defs.bzl", "cc_binary")
load("//bzl/crosstool:wasm-pthread.bzl", "emoptsAllowMemoryGrowth")
load("//bzl/js:js.bzl", "js_binary", "js_library")
load("//bzl/wasm:wasm.bzl", "wasm_binary")

js_binary(
    name = "recorder-binary",
    main = [
        "recorder-binary.js",
    ],
    npm_rule = "@npm-omni-js//:npm-omni-js",
    polyfill = "none",
    visibility = [
        "//visibility:public",
    ],
    deps = [
        ":recorder",
    ],
)

js_library(
    name = "yuv-canvas",
    srcs = [
        "full-view-canvas.ts",
    ],
    visibility = [
        "//visibility:public",
    ],
    deps = [
        "//reality/app/xr/js/src:gl-renderer",
    ],
)

js_library(
    name = "recorder",
    srcs = [
        "recorder.ts",
    ],
    visibility = [
        "//visibility:public",
    ],
    deps = [
        "//apps/client/internalqa/omniscope/js/recorder:recorder-wasm",
        "//c8/ecs/src/runtime/xr:xr-helpers",
        "//c8/protolog/api:remote-request.capnp-ts",
        "//reality/app/xr/js/src:sensors",
        "//reality/app/xr/js/src/types:recorder",
        "//reality/engine/api:reality.capnp-ts",
        "//reality/engine/api/response:pose.capnp-ts",
    ],
)

wasm_binary(
    name = "recorder-wasm",
    cc_binary = ":recorder-cc",
    embind = 1,
    emopts = emoptsAllowMemoryGrowth() + [
        "EXPORTED_RUNTIME_METHODS=[GL,stringToUTF8,writeArrayToMemory]",
        "EXPORT_ES6=1",  # Emit "import" compatible exports.
        "EXPORT_NAME=RECORDER8",
        "FETCH=1",
        "MODULARIZE=1",
        "TOTAL_MEMORY=96mb",
        "USE_ES6_IMPORT_META=0",
    ],
    html = 0,
    single_file = 0,
    source_map_base = "/recorder/",
    visibility = [
        "//visibility:public",
    ],
)

cc_binary(
    name = "recorder-cc",
    srcs = [
        "recorder.cc",
    ],
    linkopts = [
        "--bind",
    ],
    target_compatible_with = select({
        "@niantic//bzl/conditions:wasm": [],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    deps = [
        "//bzl/inliner:rules2",
        "//c8:c8-log",
        "//c8:c8-log-proto",
        "//c8:quaternion",
        "//c8:symbol-visibility",
        "//c8:vector",
        "//c8/geometry:device-pose",
        "//c8/geometry:egomotion",
        "//c8/geometry:intrinsics",
        "//c8/io:capnp-messages",
        "//c8/io:image-io",
        "//c8/pixels:pixel-buffer",
        "//c8/pixels:pixel-transforms",
        "//c8/pixels/pipeline:gl-texture-pipeline",
        "//c8/protolog:xr-requests",
        "//c8/protolog/api:remote-request.capnp-cc",
        "//reality/engine/api/base:image-types.capnp-cc",
        "//reality/engine/api/device:info.capnp-cc",
        "//reality/engine/api/request:app.capnp-cc",
        "//reality/engine/api/request:sensor.capnp-cc",
        "//reality/engine/executor:xr-engine",
        "//reality/engine/features:gl-reality-frame",
    ],
)
