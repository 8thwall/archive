load("//bzl/js:js.bzl", "js_library")

package(
    default_visibility = ["//bzl/presubmit:__subpackages__"],
)

js_library(
    name = "build-task",
    srcs = [
        "build-task.ts",
    ],
    deps = [
        "//bzl/presubmit/tasks:report",
        "//bzl/presubmit/tasks:shell",
        "//bzl/presubmit/tasks:task",
    ],
)

js_library(
    name = "buildifier-task",
    srcs = [
        "buildifier-task.ts",
    ],
    deps = [
        "//bzl/presubmit/tasks:file",
        "//bzl/presubmit/tasks:report",
        "//bzl/presubmit/tasks:shell",
        "//bzl/presubmit/tasks:task",
    ],
)

js_library(
    name = "task",
    srcs = [
        "task.d.ts",
    ],
)

js_library(
    name = "test-task",
    srcs = [
        "test-task.ts",
    ],
    deps = [
        "//bzl/presubmit/tasks:report",
        "//bzl/presubmit/tasks:shell",
        "//bzl/presubmit/tasks:task",
    ],
)

js_library(
    name = "clang-format-task",
    srcs = [
        "clang-format-task.ts",
    ],
    deps = [
        "//bzl/presubmit/tasks:file",
        "//bzl/presubmit/tasks:report",
        "//bzl/presubmit/tasks:shell",
        "//bzl/presubmit/tasks:task",
    ],
)

CLIPPY_COMPATIBLE = select({
    "//bzl/conditions:linux": [],
    "//bzl/conditions:osx": [],
    "//conditions:default": ["@platforms//:incompatible"],
})

js_library(
    name = "cargo-clippy-task",
    srcs = [
        "cargo-clippy-task.ts",
    ],
    data = [
        "@rules_rust//rust/toolchain:current_cargo_clippy_files",
        "@rules_rust//rust/toolchain:current_cargo_files",
        "@rules_rust//rust/toolchain:current_clippy_files",
        "@rules_rust//rust/toolchain:current_rustc_files",
    ],
    target_compatible_with = CLIPPY_COMPATIBLE,
    deps = [
        "//bzl/presubmit/tasks:file",
        "//bzl/presubmit/tasks:report",
        "//bzl/presubmit/tasks:shell",
        "//bzl/presubmit/tasks:task",
    ],
)

js_library(
    name = "task-validate",
    srcs = [
        "task-validate.ts",
    ],
    deps = [
        "//bzl/presubmit/tasks:task",
    ],
)

js_library(
    name = "report",
    srcs = [
        "report.ts",
    ],
)

js_library(
    name = "shell",
    srcs = [
        "shell.ts",
    ],
    deps = [
        "//bzl/presubmit/tasks:report",
    ],
)

js_library(
    name = "eslint-task",
    srcs = [
        "eslint-task.ts",
    ],
    deps = [
        "//bzl/presubmit/tasks:file",
        "//bzl/presubmit/tasks:report",
        "//bzl/presubmit/tasks:shell",
        "//bzl/presubmit/tasks:task",
    ],
)

js_library(
    name = "file",
    srcs = [
        "file.ts",
    ],
)
