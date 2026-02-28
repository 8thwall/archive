load("//bzl/js:js.bzl", "js_library")

package(default_visibility = [
    "//reality/cloud/studiohub:__subpackages__",
])

js_library(
    name = "api",
    srcs = [
        "api.ts",
    ],
    deps = [
        "//reality/shared/studiohub:electron-api",
    ],
)

js_library(
    name = "ports",
    srcs = [
        "ports.ts",
    ],
    deps = [
        "//reality/cloud/studiohub/app/file-watch:file-watcher",
        "//reality/shared/studiohub:local-sync-types",
    ],
)

js_library(
    name = "file-watcher",
    srcs = [
        "file-watcher.ts",
    ],
    deps = [
        "//reality/cloud/studiohub:local-project-db",
        "//reality/cloud/studiohub:project-helpers",
        "//reality/shared/studiohub:local-sync-types",
        "//reality/shared/studiohub:unix-path",
    ],
)
