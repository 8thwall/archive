load("//bzl/js:js.bzl", "js_cli", "js_library", "js_test")

js_library(
    name = "validate",
    srcs = [
        "validate.ts",
    ],
    deps = [
        "//ci-support/file-validation:valid-file-name",
    ],
)

js_cli(
    name = "validate-mr",
    main = ["validate-mr.ts"],
    npm_rule = "@npm-ci-support//:npm-ci-support",
    deps = [
        "validate",
        "//ci-support:gitlab-service",
    ],
)

js_cli(
    name = "validate-diff",
    main = ["validate-diff.ts"],
    npm_rule = "@npm-ci-support//:npm-ci-support",
    deps = [
        "validate",
    ],
)

js_test(
    name = "valid-file-name-test",
    main = [
        "valid-file-name-test.ts",
    ],
    deps = [
        "//bzl/js:chai-js",
        "//ci-support/file-validation:valid-file-name",
    ],
)

js_library(
    name = "valid-file-name",
    srcs = [
        "valid-file-name.ts",
    ],
)
