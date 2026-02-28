load("//bzl/js:js.bzl", "js_library", "js_test")

package(
    default_visibility = [
        "//ci-support/i18n:__subpackages__",
    ],
)

js_library(
    name = "max-concurrent",
    srcs = [
        "max-concurrent.ts",
    ],
    deps = [
    ],
)

js_test(
    name = "max-concurrent-test",
    size = "small",
    main = [
        "max-concurrent-test.ts",
    ],
    deps = [
        ":max-concurrent",
        "//bzl/js:chai-js",
    ],
)

js_library(
    name = "translate-json",
    srcs = [
        "translate-json.ts",
    ],
    deps = [
        ":translate-string",
        ":translation-engine",
    ],
)

js_test(
    name = "translate-json-test",
    size = "small",
    main = [
        "translate-json-test.ts",
    ],
    deps = [
        ":translate-json",
        ":translation-config",
        ":translation-engine",
        ":translation-engine-mock",
        "//bzl/js:chai-js",
    ],
)

js_library(
    name = "translate-md",
    srcs = [
        "translate-md.ts",
    ],
    deps = [
        ":translate-string",
        ":translation-engine",
    ],
)

js_test(
    name = "translate-md-test",
    size = "small",
    main = [
        "translate-md-test.ts",
    ],
    deps = [
        ":translate-md",
        ":translation-config",
        ":translation-engine",
        ":translation-engine-mock",
        "//bzl/js:chai-js",
    ],
)

js_library(
    name = "translate-string",
    srcs = [
        "translate-string.ts",
    ],
    deps = [
        ":translation-config",
        ":translation-engine",
    ],
)

js_test(
    name = "translate-string-test",
    size = "small",
    main = [
        "translate-string-test.ts",
    ],
    deps = [
        ":translate-string",
        ":translation-config",
        ":translation-engine",
        ":translation-engine-mock",
        "//bzl/js:chai-js",
    ],
)

js_library(
    name = "translation-config",
    srcs = [
        "translation-config.ts",
    ],
    deps = [
        ":translation-engine",
    ],
)

js_library(
    name = "translation-engine",
    srcs = [
        "translation-engine.ts",
    ],
)

js_library(
    name = "translation-engine-chatgpt",
    srcs = [
        "translation-engine-chatgpt.ts",
    ],
    deps = [
        ":max-concurrent",
        ":translation-engine",
    ],
)

js_library(
    name = "translation-engine-mock",
    srcs = [
        "translation-engine-mock.ts",
    ],
    deps = [
        ":translation-engine",
    ],
)

js_library(
    name = "translation-paths",
    srcs = [
        "translation-paths.ts",
    ],
    deps = [
        ":translation-config",
        ":translation-engine",
    ],
)

js_test(
    name = "translation-paths-test",
    size = "small",
    main = [
        "translation-paths-test.ts",
    ],
    deps = [
        ":translation-config",
        ":translation-engine",
        ":translation-paths",
        "//bzl/js:chai-js",
    ],
)

js_library(
    name = "translation-task",
    srcs = [
        "translation-task.ts",
    ],
    deps = [
        ":translate-json",
        ":translate-md",
        ":translation-config",
        ":translation-engine",
        ":translation-paths",
    ],
)

js_test(
    name = "translation-task-test",
    size = "small",
    main = [
        "translation-task-test.ts",
    ],
    deps = [
        ":translation-config",
        ":translation-engine",
        ":translation-engine-mock",
        ":translation-task",
        "//bzl/js:chai-js",
    ],
)
