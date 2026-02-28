load("//bzl/js:js.bzl", "js_library")

js_library(
    name = "responsive-immersive-component",
    srcs = [
        "responsive-immersive-component.js",
    ],
    visibility = [
        "//apps/client/public/web/responsive-immersive:__subpackages__",
    ],
    deps = [
        "//apps/client/public/web/responsive-immersive/webxr-threejs:create-controllers",
        "//apps/client/public/web/responsive-immersive/webxr-threejs:webxr-session",
    ],
)
