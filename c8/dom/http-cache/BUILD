load("//bzl/js:js.bzl", "js_library", "js_test")

js_library(
    name = "http-cache",
    srcs = [
        "http-cache.ts",
    ],
    visibility = [
        "//visibility:public",
    ],
    deps = [
        "//bzl/js:fetch",
        "//c8/dom/http-cache:http-cache-storage",
    ],
)

js_test(
    name = "http-cache-is-cachable-test",
    size = "small",
    esnext = 1,
    main = [
        "http-cache-is-cachable-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//c8/dom/http-cache",
    ],
)

js_library(
    name = "http-cache-storage",
    srcs = [
        "http-cache-storage.ts",
    ],
    deps = [
        "//reality/shared:run-queue",
    ],
)

js_test(
    name = "http-cache-test",
    size = "small",
    esnext = 1,
    main = [
        "http-cache-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//c8/dom/http-cache",
    ],
)
