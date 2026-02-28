load("//bzl/js:js.bzl", "js_library")

package(default_visibility = [
    "//reality/cloud/studiohub:__subpackages__",
])

js_library(
    name = "preferences-handler",
    srcs = [
        "preferences-handler.ts",
    ],
    deps = [
        "//reality/cloud/studiohub:errors",
        "//reality/cloud/studiohub:json-response",
        "//reality/cloud/studiohub:local-preferences",
        "//reality/cloud/studiohub/app/preferences:code-editor",
        "//reality/shared/studiohub:preferences-types",
    ],
)

js_library(
    name = "protocol",
    srcs = [
        "protocol.ts",
    ],
    deps = [
        "//reality/cloud/studiohub/app/preferences:preferences-handler",
    ],
)

js_library(
    name = "code-editor",
    srcs = [
        "code-editor.ts",
    ],
    deps = [
        "//reality/cloud/studiohub:local-preferences",
        "//reality/shared:run-queue",
        "//reality/shared/studiohub:preferences-types",
    ],
)
