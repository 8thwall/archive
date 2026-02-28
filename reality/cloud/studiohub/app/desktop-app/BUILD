load("//bzl/js:js.bzl", "js_library")

package(default_visibility = [
    "//reality/cloud/studiohub:__subpackages__",
])

js_library(
    name = "protocol",
    srcs = [
        "protocol.ts",
    ],
    deps = [
        "//reality/cloud/studiohub:errors",
        "//reality/cloud/studiohub/app:console-server-url",
        "//reality/shared/studiohub:create-browser-url",
        "//reality/shared/studiohub:create-electron-url",
    ],
)

js_library(
    name = "register-on-open-url-handler",
    srcs = [
        "register-on-open-url-handler.ts",
    ],
    deps = [
        "//reality/cloud/studiohub/app/desktop-app:deep-link",
    ],
)

js_library(
    name = "dev-cookie",
    srcs = [
        "dev-cookie.ts",
    ],
    deps = [
        "//reality/cloud/studiohub/app:console-server-url",
    ],
)

js_library(
    name = "register-second-instance-handler",
    srcs = [
        "register-second-instance-handler.ts",
    ],
    deps = [
        "//reality/cloud/studiohub/app/desktop-app:deep-link",
    ],
)

js_library(
    name = "deep-link",
    srcs = [
        "deep-link.ts",
    ],
    deps = [
        "//reality/cloud/studiohub/app:studiohub-protocol",
        "//reality/cloud/studiohub/app/desktop-app:window-visibility",
    ],
)

js_library(
    name = "window-visibility",
    srcs = [
        "window-visibility.ts",
    ],
)

js_library(
    name = "permissions",
    srcs = [
        "permissions.ts",
    ],
)
