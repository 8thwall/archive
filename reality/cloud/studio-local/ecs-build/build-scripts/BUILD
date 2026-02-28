load("//bzl/js:js.bzl", "js_binary")

js_binary(
    name = "main",
    commonjs = 1,
    esnext = 1,
    export_library = 1,
    externals = "*",
    main = [
        "main.js",
    ],
    npm_rule = "@npm-ecs-build//:npm-ecs-build",
    target = "node",
    deps = [
        "//c8/cli:args",
    ],
)

js_binary(
    name = "validate-ecs-main",
    commonjs = 1,
    esnext = 1,
    export_library = 1,
    externals = "*",
    main = [
        "validate-ecs-main.js",
    ],
    npm_rule = "@npm-ecs-build//:npm-ecs-build",
    target = "node",
    deps = [
        "//c8/cli:args",
        "//c8/ecs/src/shared:parse-component-ast",
    ],
)
