load("@niantic//bzl/node:node-addon.bzl", "node_addon")
load("@niantic//bzl/js:js.bzl", "js_binary", "js_library")

node_addon(
    name = "node-gles-addon",
    srcs = [
        "binding/binding.cc",
        "binding/egl_context_wrapper.cc",
        "binding/egl_context_wrapper.h",
        "binding/utils.h",
        "binding/webgl_extensions.cc",
        "binding/webgl_extensions.h",
        "binding/webgl_rendering_context.cc",
        "binding/webgl_rendering_context.h",
        "binding/webgl_sync.cc",
        "binding/webgl_sync.h",
    ],
    copts = [
        "-Iexternal",
    ],
    target_compatible_with = select({
        "@niantic//c8/pixels/opengl:with-angle": [],  # Requires flag --//c8/pixels/opengl:angle
        "@niantic//c8/pixels/opengl:without-angle": ["@platforms//:incompatible"],
    }),
    deps = [
        "@niantic//bzl/node:node-addons",
        "@niantic//c8/pixels/opengl:gl-headers",
    ],
)

js_library(
    name = "node-gles",
    srcs = [
        "src/binding.d.ts",
        "src/index.ts",
        "src/version.ts",
    ],
    visibility = ["//visibility:public"],
    deps = [
        ":node-gles-addon",
    ],
)
