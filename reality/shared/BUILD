load("//bzl/js:js.bzl", "js_library", "js_test")

package(default_visibility = ["//reality/cloud:shared"])

js_library(
    name = "typed-attributes",
    srcs = [
        "typed-attributes.ts",
    ],
    visibility = [
        "//visibility:public",
    ],
)

js_library(
    name = "dynamodb-impl",
    srcs = [
        "dynamodb-impl.ts",
    ],
    visibility = ["//visibility:public"],
    deps = [
        "//reality/shared:dynamodb",
    ],
)

js_library(
    name = "dynamodb",
    srcs = [
        "dynamodb.ts",
    ],
    visibility = ["//visibility:public"],
)

js_library(
    name = "s3-impl",
    srcs = [
        "s3-impl.ts",
    ],
    visibility = ["//visibility:public"],
    deps = [
        "//reality/shared:s3",
    ],
)

js_library(
    name = "s3",
    srcs = [
        "s3.ts",
    ],
    visibility = ["//visibility:public"],
    deps = [
        "//reality/cloud/xrhome/src/shared:registry",
    ],
)

js_library(
    name = "html",
    srcs = [
        "html.ts",
    ],
)

js_library(
    name = "asset-pointer",
    srcs = [
        "asset-pointer.ts",
    ],
)

js_library(
    name = "run-queue",
    srcs = [
        "run-queue.ts",
    ],
    visibility = ["//visibility:public"],
)

js_test(
    name = "typed-attributes-test",
    size = "small",
    main = [
        "typed-attributes-test.ts",
    ],
    deps = [
        "//bzl/js:chai-js",
        "//reality/shared:typed-attributes",
    ],
)

js_library(
    name = "partition-info",
    srcs = [
        "partition-info.ts",
    ],
)

js_test(
    name = "convert-case-test",
    size = "small",
    main = [
        "convert-case-test.ts",
    ],
    deps = [
        "//bzl/js:chai-js",
        "//reality/shared:convert-case",
    ],
)

js_library(
    name = "convert-case",
    srcs = [
        "convert-case.ts",
    ],
    visibility = ["//visibility:public"],
)
