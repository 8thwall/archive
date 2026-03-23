load("@niantic//bzl/node:node-addon.bzl", "node_addon")
load("@niantic//bzl/js:js.bzl", "js_cli", "js_library")
load("@niantic//bzl/apple:objc.bzl", "nia_objc_library")

node_addon(
    name = "miniaudio-addon",
    srcs = [
        "miniaudio-addon.cpp",
    ],
    deps = [
        "@miniaudio",
        "@niantic//bzl/node:node-addons-extra",
        "@nodejs-nan",
    ],
    copts = select({
        "@niantic//bzl/conditions:ios": [
            "-x objective-c++",
        ],
        "//conditions:default": [],
    }),
)

alias(
    name = "miniaudio-addon-bindings",
    actual = select({
        "@niantic//bzl/conditions:ios": ":miniaudio-addon-bindings-ios",
        "//conditions:default": ":miniaudio-addon-bindings-native",
    }),
    visibility = ["//visibility:public"],
)

cc_library(
    name = "miniaudio-addon-bindings-native",
    srcs = [
        "miniaudio-addon.cpp",
    ],
    hdrs = [
        "miniaudio-addon.h",
    ],
    deps = [
        "@miniaudio",
        "@niantic//bzl/node:node-addons-extra",
        "@nodejs-nan",
    ]
)

# For iOS, we need to compile as Objective-C. To pass notarization, we also need to compile with
# -DMA_NO_RUNTIME_LINKING and link a few Apple frameworks. You can read more here:
# - https://miniaud.io/docs/manual/index.html
# - https://github.com/mackron/miniaudio/blob/master/miniaudio.h (Click "View raw" and then search "iOS")
nia_objc_library(
    name = "miniaudio-addon-bindings-ios",
    srcs = [
        "miniaudio-addon.cpp",
    ],
    hdrs = [
        "miniaudio-addon.h",
    ],
    deps = [
        "@miniaudio",
        "@niantic//bzl/node:node-addons-extra",
        "@nodejs-nan",
    ],
    sdk_frameworks = [
        "CoreFoundation",
        "CoreAudio",
        "AudioToolbox",
    ],
    copts = [
        "-x objective-c++",
        "-DMA_NO_RUNTIME_LINKING",
    ]
)

js_library(
    name = "miniaudio",
    srcs = [
        "miniaudio.js",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    visibility = ["//visibility:public"],
    deps = [
        ":miniaudio-addon",
    ],
)
