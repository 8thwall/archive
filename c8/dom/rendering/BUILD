load("//bzl/js:js.bzl", "js_binary", "js_test")

filegroup(
    name = "texture-loading-test-data",
    srcs = [
        "texture-loading-test-source.html",
        "//c8/dom/rendering:texture-loading-test-source",
    ],
)

js_test(
    name = "texture-loading-test",
    size = "small",
    data = [
        "//c8/dom:fetch-test-worker",
        "//c8/dom/rendering:texture-loading-test-data",
    ],
    esnext = 1,
    main = [
        "texture-loading-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//c8/dom",
    ],
)

js_binary(
    name = "texture-loading-test-source",
    esnext = 1,
    main = [
        "texture-loading-test-source.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
)
