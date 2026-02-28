load("//bzl/js:js.bzl", "js_library")

package(default_visibility = ["//reality/cloud:shared"])

js_library(
    name = "models",
    srcs = [
        "models.ts",
    ],
    deps = [
        "//reality/cloud/xrhome/src/shared:special-features",
        "//reality/cloud/xrhome/src/shared:tos",
        "//reality/cloud/xrhome/src/shared:user-editor-settings",
        "//reality/cloud/xrhome/src/shared/genai/types:generate",
        "//reality/shared/module:module-dependency",
        "//reality/shared/nae:nae-types",
    ],
)

js_library(
    name = "db-api",
    srcs = [
        "db-api.ts",
    ],
    deps = [
        "//reality/cloud/xrhome/src/shared:policy-violation-constants",
        "//reality/cloud/xrhome/src/shared:registry",
        "//reality/cloud/xrhome/src/shared/integration/db:models",
    ],
)
