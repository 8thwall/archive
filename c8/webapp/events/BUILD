load("//bzl/js:js.bzl", "js_library", "js_test")

js_library(
    name = "callback-manager",
    srcs = [
        "callback-manager.ts",
    ],
    visibility = ["//visibility:public"],
)

js_test(
    name = "callback-manager-test",
    size = "small",
    main = [
        "callback-manager-test.ts",
    ],
    npm_rule = "@npm-c8//:npm-c8",
    deps = [
        ":callback-manager",
        "//bzl/js:chai-js",
    ],
)
