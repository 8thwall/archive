load("//bzl/js:js.bzl", "js_library", "js_test")

js_library(
    name = "audio-decode-cache",
    srcs = [
        "audio-decode-cache.ts",
    ],
    visibility = [
        "//visibility:public",
    ],
    deps = [
        "//c8/dom/audio:audio-buffer",
    ],
)

js_test(
    name = "audio-decode-cache-test",
    size = "small",
    esnext = 1,
    main = [
        "audio-decode-cache-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//c8/dom",
        "//c8/dom:dom-core-lib",
        "//c8/dom/audio:audio-buffer",
        "//c8/dom/audio-decode-cache",
    ],
)
