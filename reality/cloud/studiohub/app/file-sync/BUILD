load("//bzl/js:js-stringloader.bzl", "js_stringloader")
load("//bzl/js:js.bzl", "js_library")

package(default_visibility = [
    "//reality/cloud/studiohub:__subpackages__",
])

js_library(
    name = "file-handler",
    srcs = [
        "file-handler.ts",
    ],
    deps = [
        "//reality/cloud/studiohub:constants",
        "//reality/cloud/studiohub:errors",
        "//reality/cloud/studiohub:json-response",
        "//reality/cloud/studiohub:local-project-db",
        "//reality/cloud/studiohub:project-helpers",
        "//reality/cloud/studiohub:query-params",
        "//reality/cloud/studiohub/app/file-sync:create-project-files",
        "//reality/cloud/studiohub/app/file-sync:file-handler-types",
        "//reality/cloud/studiohub/app/file-sync:paths",
        "//reality/cloud/studiohub/app/preferences:code-editor",
        "//reality/shared/studiohub:local-sync-types",
        "//reality/shared/studiohub:unix-path",
    ],
)

js_library(
    name = "project-handler",
    srcs = [
        "project-handler.ts",
    ],
    deps = [
        "//reality/cloud/studiohub:errors",
        "//reality/cloud/studiohub:json-response",
        "//reality/cloud/studiohub:local-project-db",
        "//reality/cloud/studiohub:local-server",
        "//reality/cloud/studiohub:project-helpers",
        "//reality/cloud/studiohub:query-params",
        "//reality/cloud/studiohub/app/file-sync:create-project-files",
        "//reality/cloud/studiohub/app/file-sync:paths",
        "//reality/cloud/studiohub/app/file-sync:project-handler-types",
        "//reality/cloud/studiohub/app/preferences:code-editor",
        "//reality/shared:run-queue",
    ],
)

js_library(
    name = "protocol",
    srcs = [
        "protocol.ts",
    ],
    deps = [
        "//reality/cloud/studiohub/app/file-sync:file-handler",
        "//reality/cloud/studiohub/app/file-sync:paths",
        "//reality/cloud/studiohub/app/file-sync:project-handler",
    ],
)

js_library(
    name = "paths",
    srcs = [
        "paths.ts",
    ],
)

js_library(
    name = "file-handler-types",
    srcs = [
        "file-handler-types.ts",
    ],
)

js_library(
    name = "project-handler-types",
    srcs = [
        "project-handler-types.ts",
    ],
)

js_library(
    name = "create-project-files",
    srcs = [
        "create-project-files.ts",
    ],
    deps = [
        "//c8/ecs/src/shared:runtime-version",
        "//c8/ecs/src/shared:scene-graph",
        "//reality/cloud/studiohub:errors",
        "//reality/cloud/studiohub:project-helpers",
        "//reality/cloud/studiohub/app:app-server-url",
        "//reality/cloud/studiohub/app/file-sync:studio-tsconfig",
        "//reality/shared/studio:generate-url",
        "//reality/shared/studio:load-ecs-manifest",
    ],
)

js_stringloader(
    name = "studio-tsconfig",
    srcs = [
        "//reality/cloud/studiohub/app/file-sync:studio-tsconfig.json",
    ],
)

js_library(
    name = "install-build-package",
    srcs = [
        "install-build-package.ts",
    ],
    deps = [
        "//reality/cloud/studiohub:errors",
        "//reality/cloud/studiohub/app/file-sync:run-commands",
    ],
)

js_library(
    name = "run-commands",
    srcs = [
        "run-commands.ts",
    ],
)
