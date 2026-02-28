load("//bzl/js:js.bzl", "js_binary", "js_library")
load("//bzl/wasm:wasm.bzl", "wasm_binary")
load("@rules_cc//cc:defs.bzl", "cc_binary")
load("//bzl/crosstool:wasm-pthread.bzl", "emoptsAllowMemoryGrowth")

js_binary(
    name = "omni-core",
    main = [
        "omni-binary.js",
    ],
    npm_rule = "@npm-omni-js//:npm-omni-js",
    polyfill = "none",
    visibility = [
        "//visibility:public",
    ],
    deps = [
        ":omni",
    ],
)

js_library(
    name = "omni-types",
    srcs = [
        "omni-types.ts",
    ],
    visibility = [
        "//visibility:public",
    ],
)

js_library(
    name = "omni",
    srcs = [
        "omni.ts",
    ],
    deps = [
        ":omni-types",
        ":omniscope-wasm",
        "//reality/app/xr/js/src:sensors",
        "//reality/engine/api:reality.capnp-ts",
    ],
)

js_library(
    name = "omniscope-context-wrapper",
    srcs = [
        "omniscope-context-wrapper.js",
    ],
    visibility = [
        "//apps/client/internalqa/omniscope/js:__subpackages__",
    ],
)

wasm_binary(
    name = "omniscope-wasm",
    cc_binary = ":omniscope-cc",
    embind = 1,
    emopts = emoptsAllowMemoryGrowth() + [
        "EXPORTED_RUNTIME_METHODS=[GL,stringToUTF8,writeArrayToMemory]",
        "EXPORT_ES6=1",  # Emit "import" compatible exports.
        "EXPORT_NAME=OMNI8",
        "FETCH=1",
        "MODULARIZE=1",
        "TOTAL_MEMORY=96mb",
        "USE_ES6_IMPORT_META=0",
        "DISABLE_EXCEPTION_CATCHING=0",  # Needed for zxing. Ideally we should excise exceptions.
    ],
    html = 0,
    single_file = 0,
    source_map_base = "/core/",
    visibility = [
        "//visibility:public",
    ],
)

cc_binary(
    name = "omniscope-cc",
    srcs = [
        "omniscope.cc",
    ],
    linkopts = [
        "--bind",
    ],
    target_compatible_with = select({
        "@niantic//bzl/conditions:wasm": [],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    deps = [
        "//apps/client/internalqa/omniscope/native:omniscope-app",
        "//apps/client/internalqa/omniscope/native/lib:detection-image",
        "//bzl/inliner:rules2",
        "//c8:c8-log",
        "//c8:quaternion",
        "//c8:symbol-visibility",
        "//c8:vector",
        "//c8/camera:device-infos",
        "//c8/io:capnp-messages",
        "//c8/stats:scope-timer",
        "//reality/engine/api/device:info.capnp-cc",
        "//reality/engine/features:gl-reality-frame",
    ],
)
