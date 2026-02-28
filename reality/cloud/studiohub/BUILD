load("//bzl/js:js.bzl", "js_binary", "js_cli", "js_library")
load("//bzl/npmpackage:typecheck.bzl", "npm_typecheck")

package(default_visibility = ["//reality/cloud/studiohub:__subpackages__"])

js_cli(
    name = "mcp-websocket-server",
    main = [
        "mcp-websocket-server.ts",
    ],
    npm_rule = "@npm-studiohub//:npm-studiohub",
    deps = [
        "//reality/cloud/studiohub/app/studio-use:mcp-websocket-server",
    ],
)

exports_files([
    "package.json",
    "package-lock.json",
])

npm_typecheck(name = "npm-studiohub")

js_library(
    name = "constants",
    srcs = [
        "constants.ts",
    ],
)

js_library(
    name = "project-helpers",
    srcs = [
        "project-helpers.ts",
    ],
)

js_library(
    name = "local-project-db",
    srcs = [
        "local-project-db.ts",
    ],
    deps = [
        "//reality/cloud/studiohub:application-state",
        "//reality/shared/studiohub:local-sync-types",
    ],
)

js_library(
    name = "errors",
    srcs = [
        "errors.ts",
    ],
    deps = [
        "//reality/cloud/studiohub:json-response",
    ],
)

js_library(
    name = "json-response",
    srcs = [
        "json-response.ts",
    ],
)

js_library(
    name = "query-params",
    srcs = [
        "query-params.ts",
    ],
)

js_library(
    name = "application-state",
    srcs = [
        "application-state.ts",
    ],
)

js_library(
    name = "local-preferences",
    srcs = [
        "local-preferences.ts",
    ],
    deps = [
        "//reality/cloud/studiohub:application-state",
    ],
)

js_library(
    name = "local-server",
    srcs = [
        "local-server.ts",
    ],
    deps = [
        "//c8/cli:ip",
        "//reality/cloud/studiohub:constants",
        "//reality/cloud/studiohub/app/file-sync:install-build-package",
        "//reality/cloud/studiohub/app/file-sync:run-commands",
    ],
)

js_binary(
    name = "builder",
    commonjs = 1,
    esnext = 1,
    export_library = 1,
    externals = "*",
    main = [
        "builder.config.ts",
    ],
    npm_rule = "@npm-studiohub//:npm-studiohub",
    target = "node",
    deps = [
        "//reality/cloud/studiohub/app:studiohub-protocol",
    ],
)
