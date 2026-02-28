load("//bzl/js:js.bzl", "js_library")

package(default_visibility = ["//reality/cloud/studio-local/ecs-build:__subpackages__"])

js_library(
    name = "asset-bundle-resolver-plugin",
    srcs = [
        "asset-bundle-resolver-plugin.ts",
    ],
)

js_library(
    name = "asset-manifest-plugin",
    srcs = [
        "asset-manifest-plugin.ts",
    ],
    deps = [
        "//reality/shared/studiohub:unix-path",
    ],
)

js_library(
    name = "code-import-plugin",
    srcs = [
        "code-import-plugin.ts",
    ],
    deps = [
        "//reality/shared/studiohub:unix-path",
    ],
)

js_library(
    name = "dependency-import-plugin",
    srcs = [
        "dependency-import-plugin.ts",
    ],
)
