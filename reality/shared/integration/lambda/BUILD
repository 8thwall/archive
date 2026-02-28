load("//bzl/js:js.bzl", "js_library")

package(default_visibility = ["//reality/cloud:shared"])

js_library(
    name = "lambda-impl",
    srcs = [
        "lambda-impl.ts",
    ],
    deps = [
        "//reality/shared/integration/lambda",
    ],
)

js_library(
    name = "lambda",
    srcs = [
        "lambda.ts",
    ],
    deps = [
        "//reality/cloud/xrhome/src/shared:registry",
    ],
)
