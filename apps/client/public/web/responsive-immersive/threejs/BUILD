load("//bzl/js:js.bzl", "js_library")

js_library(
    name = "responsive-immersive",
    srcs = [
        "responsive-immersive.js",
    ],
    visibility = [
        "//apps/client/public/web/responsive-immersive:__subpackages__",
    ],
    deps = [
        ":pipline-module",
        "//apps/client/public/web/responsive-immersive/webxr-threejs:create-controllers",
        "//apps/client/public/web/responsive-immersive/webxr-threejs:webxr-session",
    ],
)

js_library(
    name = "pipline-module",
    srcs = [
        "pipeline-module.js",
    ],
    deps = [
    ],
)
