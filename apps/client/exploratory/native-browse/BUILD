load("//bzl/js:js.bzl", "js_cli", "js_library")

js_cli(
    name = "native-browse",
    esnext = 1,
    main = [
        "native-browse.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    deps = [
        ":input-handler",
        "//bzl/js:fetch",
        "//bzl/js:vm-modules",
        "//c8/dom",
        "//c8/dom:dev-access",
        "//c8/dom:staging-access",
        "//c8/xrapi:xrapi-emulated",
        "//c8/xrapi:xrapi-install",
        "//third_party/glfw-raub",
        "//third_party/headless-gl",
    ],
)

js_library(
    name = "input-handler",
    srcs = [
        "input-handler.ts",
    ],
    esnext = 1,
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    deps = [
        ":glfw-event-types",
    ],
)

js_library(
    name = "glfw-event-types",
    srcs = [
        "glfw-event-types.ts",
    ],
    esnext = 1,
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
)
