load("//bzl/js:js.bzl", "js_library")

js_library(
    name = "create-controllers",
    srcs = [
        "create-controllers.js",
    ],
    visibility = [
        "//apps/client/public/web/responsive-immersive:__subpackages__",
    ],
    deps = [
        ":xr-controller-model-factory",
        ":xr-hand-model-factory",
    ],
)

js_library(
    name = "webxr-session",
    srcs = [
        "webxr-session.js",
    ],
    visibility = [
        "//apps/client/public/web/responsive-immersive:__subpackages__",
    ],
    deps = [
    ],
)

js_library(
    name = "xr-controller-model-factory",
    srcs = [
        "xr-controller-model-factory.js",
    ],
    deps = [
        ":xr-controller-model",
    ],
)

js_library(
    name = "xr-controller-model",
    srcs = [
        "xr-controller-model.js",
    ],
)

js_library(
    name = "xr-hand-mesh-model",
    srcs = [
        "xr-hand-mesh-model.js",
    ],
    deps = [
    ],
)

js_library(
    name = "xr-hand-model-factory",
    srcs = [
        "xr-hand-model-factory.js",
    ],
    deps = [
        ":xr-hand-mesh-model",
        ":xr-hand-model",
    ],
)

js_library(
    name = "xr-hand-model",
    srcs = [
        "xr-hand-model.js",
    ],
    deps = [
    ],
)
