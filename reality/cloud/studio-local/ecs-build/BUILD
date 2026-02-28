load("//bzl/js:js.bzl", "js_binary")
load("//bzl/npmpackage:typecheck.bzl", "npm_typecheck")

npm_typecheck(name = "npm-ecs-build")

js_binary(
    name = "webpack-local",
    commonjs = 1,
    esnext = 1,
    export_library = 1,
    externals = "*",
    main = [
        "webpack-local.config.ts",
    ],
    npm_rule = "@npm-ecs-build//:npm-ecs-build",
    target = "node",
    deps = [
        "//reality/cloud/studio-local/ecs-build/plugins:asset-bundle-resolver-plugin",
        "//reality/cloud/studio-local/ecs-build/plugins:asset-manifest-plugin",
        "//reality/cloud/studio-local/ecs-build/plugins:code-import-plugin",
        "//reality/cloud/studio-local/ecs-build/plugins:dependency-import-plugin",
    ],
)
