load("//bzl/js:js.bzl", "js_binary")

filegroup(
    name = "build-mode-fetch-test-data",
    srcs = [
        "build-mode-fetch-test-0.html",
        "build-mode-fetch-test-1.html",
        "metadata.json",
        "//c8/dom/build-mode-fetch-test-data:build-mode-fetch-worker",
    ],
    visibility = [
        "//c8/dom:__subpackages__",
    ],
)

js_binary(
    name = "build-mode-fetch-worker",
    main = [
        "build-mode-fetch-worker.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    deps = [
        "//c8/dom:fetch-worker-helper",
    ],
)
