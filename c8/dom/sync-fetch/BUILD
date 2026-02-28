load("//bzl/js:js.bzl", "js_binary", "js_library", "js_test")

package(default_visibility = ["//c8/dom:__subpackages__"])

js_library(
    name = "sync-threads",
    srcs = [
        "sync-threads.ts",
    ],
)

js_library(
    name = "sync-fetch",
    srcs = [
        "sync-fetch.ts",
    ],
    data = [
        ":sync-fetch-worker",
    ],
    deps = [
        "//c8/dom/sync-fetch:sync-fetch-serialization",
        "//c8/dom/sync-fetch:sync-threads",
    ],
)

# TODO(akashmahesh): Change sync-fetch-serialization to fetch-serialization
js_library(
    name = "sync-fetch-serialization",
    srcs = [
        "sync-fetch-serialization.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
)

js_binary(
    name = "sync-fetch-worker",
    main = [
        "sync-fetch-worker.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    deps = [
        "//c8/dom:fetch-overload",
        "//c8/dom/http-cache",
        "//c8/dom/sync-fetch:sync-fetch-serialization",
        "//c8/dom/sync-fetch:sync-threads",
    ],
)

js_test(
    name = "sync-fetch-test",
    size = "small",
    main = [
        "sync-fetch-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    deps = [
        "//bzl/js:chai-js",
        "//c8/dom:fetch-overload",
        "//c8/dom/http-cache",
        "//c8/dom/sync-fetch",
    ],
)
