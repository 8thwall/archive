load("//bzl/js:js.bzl", "js_library")

package(default_visibility = ["//reality/cloud/aws/lambda/public-api:__subpackages__"])

js_library(
    name = "common",
    testonly = True,
    srcs = [
        "common.ts",
    ],
    deps = [
        "//reality/cloud/aws/lambda/public-api:api-types",
    ],
)

js_library(
    name = "images",
    testonly = True,
    srcs = [
        "images.ts",
    ],
    data = [
        "targets/large-cone.png",
        "targets/large-rotated.jpg",
        "targets/pixel-cone.png",
        "targets/target.jpg",
        "targets/wide.jpg",
    ],
)
