load("//bzl/js:js.bzl", "js_cli", "js_library")

js_cli(
    name = "presubmit",
    main = [
        "presubmit.ts",
    ],
    npm_rule = "@npm-bzl-presubmit//:npm-bzl-presubmit",
    deps = [
        "//bzl/presubmit:run-presubmit",
        "//c8/cli:args",
    ],
)

js_library(
    name = "presubmit-jobs",
    srcs = [
        "presubmit-jobs.ts",
    ],
    deps = [
        "//bzl/presubmit/tasks:task",
        "//bzl/presubmit/tasks:task-validate",
    ],
)

js_library(
    name = "run-presubmit",
    srcs = [
        "run-presubmit.ts",
    ],
    npm_rule = "@npm-bzl-presubmit//:npm-bzl-presubmit",
    deps = [
        "//bzl/presubmit:presubmit-jobs",
        "//bzl/presubmit/tasks:build-task",
        "//bzl/presubmit/tasks:buildifier-task",
        "//bzl/presubmit/tasks:cargo-clippy-task",
        "//bzl/presubmit/tasks:clang-format-task",
        "//bzl/presubmit/tasks:eslint-task",
        "//bzl/presubmit/tasks:report",
        "//bzl/presubmit/tasks:task",
        "//bzl/presubmit/tasks:test-task",
    ],
)
