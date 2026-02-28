load("//bzl/js:js.bzl", "js_binary", "js_library")

package(default_visibility = [
    "//reality/cloud/studiohub:__subpackages__",
])

js_binary(
    name = "start",
    esnext = 1,
    externals = "electron",
    main = [
        "start.ts",
    ],
    npm_rule = "@npm-studiohub//:npm-studiohub",
    target = "node",
    deps = [
        "//reality/cloud/studiohub:application-state",
        "//reality/cloud/studiohub/app:console-server-url",
        "//reality/cloud/studiohub/app:menu",
        "//reality/cloud/studiohub/app:studiohub-protocol",
        "//reality/cloud/studiohub/app/desktop-app:deep-link",
        "//reality/cloud/studiohub/app/desktop-app:dev-cookie",
        "//reality/cloud/studiohub/app/desktop-app:permissions",
        "//reality/cloud/studiohub/app/desktop-app:protocol",
        "//reality/cloud/studiohub/app/desktop-app:register-on-open-url-handler",
        "//reality/cloud/studiohub/app/desktop-app:register-second-instance-handler",
        "//reality/cloud/studiohub/app/file-sync:protocol",
        "//reality/cloud/studiohub/app/file-watch:ports",
        "//reality/cloud/studiohub/app/preferences:protocol",
        "//reality/cloud/studiohub/app/studio-use:mcp-websocket-server",
    ],
)

js_binary(
    name = "preload",
    esnext = 1,
    externals = "electron",
    main = [
        "preload.ts",
    ],
    npm_rule = "@npm-studiohub//:npm-studiohub",
    deps = [
        "//reality/cloud/studiohub/app:studiohub-protocol",
        "//reality/cloud/studiohub/app/file-watch:api",
        "//reality/shared/studiohub:console-server-url-types",
        "//reality/shared/studiohub:electron-api",
    ],
)

js_library(
    name = "console-server-url",
    srcs = [
        "console-server-url.ts",
    ],
    deps = [
        "//reality/cloud/studiohub:local-preferences",
        "//reality/shared/studiohub:console-server-url-types",
    ],
)

js_library(
    name = "app-server-url",
    srcs = [
        "app-server-url.ts",
    ],
    deps = [
        "//reality/cloud/studiohub/app:console-server-url",
        "//reality/shared/studiohub:app-server-url-types",
        "//reality/shared/studiohub:console-server-url-types",
    ],
)

js_library(
    name = "studiohub-protocol",
    srcs = [
        "studiohub-protocol.ts",
    ],
    deps = [
        "//reality/shared/studiohub:studiohub-protocol-types",
    ],
)

js_library(
    name = "menu",
    srcs = [
        "menu.ts",
    ],
    deps = [
        "//reality/cloud/studiohub/app:console-server-url",
    ],
)
