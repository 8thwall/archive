load("//bzl/js:js.bzl", "js_cli", "js_library")

package(default_visibility = ["//visibility:public"])

js_library(
    name = "helpers",
    srcs = [
        "helpers.ts",
    ],
)

js_library(
    name = "gitlab-service",
    srcs = [
        "gitlab-service.ts",
    ],
    visibility = ["//visibility:public"],
    deps = [
        ":helpers",
    ],
)

js_library(
    name = "github",
    srcs = [
        "github.ts",
    ],
)

js_cli(
    name = "post-mr-comment",
    main = [
        "post-mr-comment.ts",
    ],
    npm_rule = "@npm-ci-support//:npm-ci-support",
    deps = [
        ":gitlab-service",
    ],
)

js_cli(
    name = "clear-automated-mr-comments",
    main = [
        "clear-automated-mr-comments.ts",
    ],
    npm_rule = "@npm-ci-support//:npm-ci-support",
    deps = [
        ":gitlab-service",
    ],
)

js_cli(
    name = "upload-bazel-deps-to-hf",
    main = [
        "upload-bazel-deps-to-hf.ts",
    ],
    npm_rule = "@npm-ci-support//:npm-ci-support",
    deps = [
        "//c8/cli:hugging-face",
        "//c8/cli:s3",
    ],
)
