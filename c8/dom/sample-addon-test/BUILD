load("//bzl/js:js.bzl", "js_binary", "js_test")
load("//bzl/node:node-addon.bzl", "node_addon")

js_test(
    name = "worker-sample-addon-test",
    size = "small",
    data = [
        ":sample-addon",
        ":sample-addon-worker-1",
        ":sample-addon-worker-2",
    ],
    main = [
        "worker-sample-addon-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    deps = [
        ":sample-addon",
        "//bzl/js:chai-js",
        "//c8/dom",
    ],
)

js_binary(
    name = "sample-addon-worker-1",
    main = [
        "sample-addon-worker-1.ts",
    ],
    deps = [
        ":sample-addon",
    ],
)

js_binary(
    name = "sample-addon-worker-2",
    main = [
        "sample-addon-worker-2.ts",
    ],
    deps = [
        ":sample-addon",
    ],
)

node_addon(
    name = "sample-addon",
    srcs = [
        "sample-addon.cc",
    ],
    target_compatible_with = select({
        "//bzl/conditions:apple": [],
        "//bzl/conditions:windows": [],
        "//bzl/conditions:linux": [],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    deps = [
        "//bzl/node:node-addons",
        "//bzl/node:node-addons-extra",
        "@nodejs-nan",
    ],
)
