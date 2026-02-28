load("//bzl/crosstool:wasm-pthread.bzl", "emoptsAllowMemoryGrowth")
load("//bzl/httpfileserver:http-file-server.bzl", "http_file_server")
load("//bzl/js:js.bzl", "js_binary", "js_test")
load("//bzl/wasm:wasm.bzl", "wasm_binary")

package(default_visibility = ["//visibility:public"])

cc_library(
    name = "wgpu-utils",
    srcs = [
        "wgpu-utils.cc",
    ],
    hdrs = [
        "wgpu-utils.h",
    ],
    visibility = [
        "//visibility:public",
    ],
    deps = [
        "//c8:c8-log",
    ] + select({
        "//bzl/conditions:wasm": [
        ],
        "//conditions:default": [
            "@dawn//:dawn-common",
            "@dawn//:dawn-glfw",
            "@dawn//:dawn-native",
            "@dawn//:dawn-proc",
            "@dawn//:dawn-utils",
            "@dawn//:dawn-wire",
            "@glfw",
        ],
    }),
    linkopts = select({
        "@niantic//bzl/conditions:wasm": ["-sUSE_WEBGPU=1"],
        "//conditions:default": [],
    }),
)

cc_library(
    name = "wgpu-renderer",
    srcs = [
        "wgpu-renderer.cc",
    ],
    hdrs = [
        "wgpu-renderer.h",
    ],
    visibility = [
        "//visibility:public",
    ],
    deps = [
        "//bzl/inliner:rules2",
        "//c8:symbol-visibility",
        "//c8/stats:scope-timer",
    ] + select({
        "//bzl/conditions:wasm": [
        ],
        "//conditions:default": [
            "@dawn//:dawn-common",
        ],
    }),
    linkopts = select({
        "@niantic//bzl/conditions:wasm": ["-sUSE_WEBGPU=1"],
        "//conditions:default": [],
    }),
)

cc_binary(
    name = "wgpu-glfw",
    srcs = [
        "wgpu-glfw.cc",
    ],
    deps = [
        ":wgpu-utils",
        ":wgpu-renderer",
        "@glfw",
    ],
)

# TODO(yuyan): enable this target once imgui is upgraded
#cc_binary(
#    name = "wgpu-imgui",
#    srcs = [
#        "wgpu-imgui.cc",
#    ],
#    deps = [
#        ":wgpu-utils",
#        ":wgpu-renderer",
#        "@glfw",
#        "@imgui//:imgui-wgpu",
#    ],
#)

js_binary(
    name = "sample",
    main = [
        "sample.ts",
    ],
    deps = [
        ":webgpu-wasm",
    ],
)

http_file_server(
    name = "serve-sample",
    data = [
        "sample.html",
        ":sample",
    ],
)

wasm_binary(
    name = "webgpu-wasm",
    cc_binary = ":webgpu-js-cc",
    emopts = emoptsAllowMemoryGrowth() + [
        "ENVIRONMENT=web",
        "EXPORT_ES6=1",
        "EXPORT_NAME=WEBGPUCC",
        "EXPORTED_FUNCTIONS=[_malloc,_free]",
        "EXPORTED_RUNTIME_METHODS=[writeArrayToMemory,lengthBytesUTF8,stringToUTF8]",
        "FETCH=0",
        "MODULARIZE=1",
        "SPLIT_MEMORY=0",
        "USE_ES6_IMPORT_META=0",
        "USE_WEBGPU=1",
        "ASYNCIFY=1",
    ] + select({
        "@niantic//bzl/conditions:wasm-pthread": [
            "TOTAL_MEMORY=32mb",  # Must be a multiple of 16MB.
        ],
        "//conditions:default": [
            "TOTAL_MEMORY=16mb",  # Must be a multiple of 16MB.
        ],
    }),
    html = 0,
    single_file = select({
        "@niantic//bzl/conditions:wasm-pthread": 0,
        "//conditions:default": 1,
    }),
)

cc_binary(
    name = "webgpu-js-cc",
    srcs = [
        "webgpu-js.cc",
    ],
    deps = [
        ":wgpu-renderer",
        ":wgpu-utils",
        "//bzl/inliner:rules2",
        "//c8:symbol-visibility",
        "//c8/stats:scope-timer",
    ],
)
