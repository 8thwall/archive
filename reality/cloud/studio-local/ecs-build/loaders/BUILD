load("//bzl/js:js.bzl", "js_binary")

package(default_visibility = ["//reality/cloud/studio-local/ecs-build:__subpackages__"])

js_binary(
    name = "asset-loader",
    commonjs = True,
    esnext = True,
    export_library = True,
    externals = "*",
    main = [
        "asset-loader.ts",
    ],
    npm_rule = "@npm-ecs-build//:npm-ecs-build",
    target = "node",
    deps = [
        "//reality/shared/studiohub:unix-path",
    ],
)
