load("@niantic//bzl/js:js.bzl", "js_cli", "js_library", "js_test")

package(default_visibility = ["//c8/dom:__subpackages__"])

js_library(
    name = "audio-lib",
    srcs = [
        "analyser-node.ts",
        "audio-buffer.ts",
        "audio-buffer-source-node.ts",
        "audio-context.ts",
        "audio-listener.ts",
        "audio-node.ts",
        "audio-param.ts",
        "audio-scheduled-source-node.ts",
        "dynamics-compressor-node.ts",
        "gain-node.ts",
        "media-element-audio-source-node.ts",
        "panner-node.ts",
    ],
    esnext = 1,
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    visibility = ["//visibility:public"],
    deps = [
        ":miniaudio",
        "//c8/ecs/src/runtime/math",
    ],
)

filegroup(
    name = "audio-element-test-htmls",
    srcs = [
        "audio-element-test.html",
        "audio-element-test-decode-play-mp3.html",
        "audio-element-test-decode-play-wav.html",
        "audio-element-test-decode-two-mp3s.html",
        "audio-element-test-invalid-audio-file.html",
        "audio-element-test-load-play.html",
        "audio-element-test-loop.html",
        "audio-element-test-loud-sounds.html",
        "audio-element-test-overlapping-sounds.html",
        "audio-element-test-play-same-elem-twice.html",
        "audio-element-test-set-src-twice.html",
        "audio-element-test-two-plays.html",
    ],
    visibility = ["//c8/dom:__subpackages__"],
)

filegroup(
    name = "audio-test-files",
    srcs = [
        # license: https://commons.wikimedia.org/wiki/File:BAK.wav
        "test_files/BAK.wav",
        # license: https://commons.wikimedia.org/wiki/File:%22Attention%22.mp3
        "test_files/attention.mp3",
        "test_files/wingFlap.mp3",
    ],
    visibility = ["//visibility:public"],
)

js_test(
    name = "audio-test",
    size = "small",
    data = [
        ":audio-test-files",
    ],
    esnext = 1,
    main = [
        "audio-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//c8/dom",
        "//c8/dom:dom-core-lib",
        "//c8/dom/audio:audio-buffer",
        "//c8/dom/audio:audio-context",
        "//c8/dom/audio:audio-node",
        "//c8/dom/audio:panner-node",
    ],
)

js_test(
    name = "audio-test-manual",
    size = "small",
    data = [
        ":audio-test-files",
        ":test-utils.js",
    ],
    esnext = 1,
    main = [
        "audio-test-manual.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    tags = ["manual"],
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//c8/dom",
        "//c8/dom:dom-core-lib",
        "//c8/dom/audio:audio-context",
        "//c8/dom/audio:miniaudio",
        "//c8/dom/audio:test-utils",
    ],
)

js_library(
    name = "test-utils",
    srcs = [
        "test-utils.js",
    ],
    esnext = 1,
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
)

js_cli(
    name = "miniaudio-test",
    esnext = 1,
    main = [
        "miniaudio-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    deps = [
        "//c8/dom",
        "//c8/dom:dom-core-lib",
        "//c8/dom/audio:miniaudio",
        "//c8/dom/audio:test-utils",
    ],
)

exports_files(["test-utils.js"])

js_library(
    name = "analyser-node",
    srcs = [],
    deps = [
        ":audio-lib",
    ],
)

js_library(
    name = "audio-buffer-source-node",
    srcs = [],
    deps = [
        ":audio-lib",
    ],
)

js_library(
    name = "audio-buffer",
    srcs = [],
    deps = [
        ":audio-lib",
    ],
)

js_library(
    name = "audio-context",
    srcs = [],
    deps = [
        ":audio-lib",
    ],
)

js_library(
    name = "audio-listener",
    srcs = [],
    deps = [
        ":audio-lib",
    ],
)

js_library(
    name = "audio-node",
    srcs = [],
    deps = [
        ":audio-lib",
    ],
)

js_library(
    name = "audio-param",
    srcs = [],
    deps = [
        ":audio-lib",
    ],
)

js_library(
    name = "miniaudio",
    srcs = [
        "miniaudio.d.ts",
        "miniaudio.js",
    ],
    deps = [
        "@miniaudio-addon//:miniaudio",
    ],
)

js_library(
    name = "audio-scheduled-source-node",
    srcs = [],
    deps = [
        ":audio-lib",
    ],
)

js_library(
    name = "dynamics-compressor-node",
    srcs = [],
    deps = [
        ":audio-lib",
    ],
)

js_library(
    name = "gain-node",
    srcs = [],
    deps = [
        ":audio-lib",
    ],
)

js_library(
    name = "media-element-audio-source-node",
    srcs = [],
    deps = [
        ":audio-lib",
    ],
)

js_library(
    name = "panner-node",
    srcs = [],
    deps = [
        ":audio-lib",
    ],
)
