load("//bzl/js:js.bzl", "js_library")

package(default_visibility = ["//reality/cloud:shared"])

js_library(
    name = "local-sync-types",
    srcs = [
        "local-sync-types.ts",
    ],
    deps = [
        "//reality/shared/studiohub:unix-path",
    ],
)

js_library(
    name = "electron-api",
    srcs = [
        "electron-api.ts",
    ],
    deps = [
        "//reality/shared/studiohub:console-server-url-types",
        "//reality/shared/studiohub:local-sync-types",
        "//reality/shared/studiohub:studiohub-protocol-types",
    ],
)

js_library(
    name = "console-server-url-types",
    srcs = [
        "console-server-url-types.ts",
    ],
)

js_library(
    name = "studiohub-protocol-types",
    srcs = [
        "studiohub-protocol-types.ts",
    ],
)

js_library(
    name = "create-browser-url",
    srcs = [
        "create-browser-url.ts",
    ],
)

js_library(
    name = "create-electron-url",
    srcs = [
        "create-electron-url.ts",
    ],
)

js_library(
    name = "preferences-types",
    srcs = [
        "preferences-types.ts",
    ],
)

js_library(
    name = "app-server-url-types",
    srcs = [
        "app-server-url-types.ts",
    ],
)

js_library(
    name = "unix-path",
    srcs = [
        "unix-path.ts",
    ],
)
