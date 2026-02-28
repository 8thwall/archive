load("//bzl/node:node-addon.bzl", "node_addon")
load("//bzl/js:js.bzl", "js_library", "js_test")

node_addon(
    name = "image-decoding-addon",
    srcs = [
        "image-decoding-addon.cc",
    ],
    target_compatible_with = select({
        "//bzl/conditions:wasm": ["@platforms//:incompatible"],
        "//bzl/asan:with-asan": ["@platforms//:incompatible"],
        "//conditions:default": [],
    }),
    visibility = ["//visibility:public"],
    deps = [
        "//bzl/node:node-addons",
        "//c8:vector",
        "//c8/io:image-io",
        "//c8/io:mime-sniff",
        "//c8/pixels:pixel-transforms",
    ],
)

js_library(
    name = "image-decoding",
    srcs = [
        "image-decoding.ts",
    ],
    visibility = [
        "//visibility:public",
    ],
    deps = [
        ":image-decoding-addon",
    ],
)

js_test(
    name = "image-decoding-test",
    size = "small",
    data = [
        "//c8/io:tiny-jpg",
        "//c8/pixels/testdata:frame0",
        "//c8/pixels/testdata:test-gif-input",
        "//c8/pixels/testdata:test-input-landscape",
        "//c8/pixels/testdata:test-input-portrait",
    ],
    main = [
        "image-decoding-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    deps = [
        "//bzl/js:chai-js",
        "//c8/dom:fetch-overload",
        "//c8/dom/image-decoding",
    ],
)
