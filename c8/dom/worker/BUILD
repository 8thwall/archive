load("//bzl/js:js.bzl", "js_binary", "js_library", "js_test")
load("//bzl/js:ts-declarations.bzl", "ts_declarations")

package(default_visibility = ["//c8/dom:__subpackages__"])

ts_declarations(
    name = "worker-core-types",
    binary = ":worker-core",
)

js_library(
    name = "worker-context",
    srcs = [
        "worker-context.ts",
    ],
    esnext = 1,
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    deps = [
        ":worker-core-types",
        "//c8/dom:context-helpers",
        "//third_party/headless-gl",
    ],
)

js_binary(
    name = "worker-core",
    esnext = 1,
    export_library = 1,
    externals = "third_party/headless-gl/*",
    externalsType = "module",
    main = [
        "worker-core.ts",
    ],
    mangle = 0,
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    deps = [
        "//c8/dom:dedicated-worker-global-scope",
        "//c8/dom:dom-events",
        "//c8/dom:dom-exception",
        "//c8/dom:encoding",
        "//c8/dom:environment",
        "//c8/dom:fetch-api",
        "//c8/dom:offscreen-canvas",
        "//c8/dom:offscreen-canvas-rendering-context-2d",
        "//c8/dom:script",
        "//c8/dom:webgl-rendering-context",
        "//c8/dom:webgl-rendering-context-base",
        "//c8/dom:webgl-rendering-context-overloads",
        "//c8/dom:webgl2-rendering-context",
        "//c8/dom:webgl2-rendering-context-base",
        "//c8/dom:webgl2-rendering-context-overloads",
        "//c8/dom:window-or-worker-global-scope",
        "//c8/dom:worker",
        "//c8/dom:worker-global-scope",
    ],
)

js_binary(
    name = "worker-fetch-execution",
    esnext = 1,
    main = [
        "worker-fetch-execution.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    deps = [
        ":worker-core-types",
    ],
)

js_binary(
    name = "worker-runner",
    esnext = 1,
    main = [
        "worker-runner.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    deps = [
        "//c8/dom:context-helpers",
        "//c8/dom/worker:worker-context",
    ],
)

js_test(
    name = "worker-test",
    size = "small",
    data = [
        "//c8/dom/worker/scripts:worker-test-data",
    ],
    esnext = 1,
    main = [
        "worker-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//c8/dom",
    ],
)

js_test(
    name = "worker-with-cache-test",
    size = "small",
    data = [
        "//c8/dom/worker/scripts:worker-test-with-cache-data",
    ],
    esnext = 1,
    main = [
        "worker-with-cache-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//c8/dom",
    ],
)
