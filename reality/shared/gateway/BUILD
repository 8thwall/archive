load("//bzl/js:js.bzl", "js_library", "js_test")

package(default_visibility = ["//reality/cloud:shared"])

js_library(
    name = "compare-parameter-value",
    srcs = [
        "compare-parameter-value.ts",
    ],
    deps = [
        "//reality/shared/gateway:gateway-types",
    ],
)

js_library(
    name = "get-secret-display-text",
    srcs = [
        "get-secret-display-text.ts",
    ],
    deps = [
        "//reality/shared/gateway:gateway-types",
    ],
)

js_library(
    name = "validate-gateway-definition",
    srcs = [
        "validate-gateway-definition.ts",
        "validate-gateway-headers.ts",
        "validate-gateway-route.ts",
    ],
    deps = [
        "//reality/shared/gateway:gateway-types",
        "//reality/shared/gateway:limits",
        "//reality/shared/gateway:validate-gateway-entry",
        "//reality/shared/gateway:validate-string",
    ],
)

js_library(
    name = "validate-gateway-entry",
    srcs = [
        "validate-gateway-entry.ts",
    ],
    deps = [
        "//reality/shared/gateway:validate-string",
    ],
)

js_library(
    name = "gateway-types",
    srcs = [
        "gateway-types.ts",
    ],
)

js_library(
    name = "aws-resources",
    srcs = [
        "aws-resources.ts",
    ],
)

js_library(
    name = "limits",
    srcs = [
        "limits.ts",
    ],
)

js_library(
    name = "validate-string",
    srcs = [
        "validate-string.ts",
    ],
)

js_library(
    name = "derive-rpc-name",
    srcs = [
        "derive-rpc-name.ts",
    ],
)

js_test(
    name = "validate-gateway-definition-test",
    size = "small",
    main = [
        "validate-gateway-definition-test.ts",
    ],
    npm_rule = "@npm-lambda//:npm-lambda",
    deps = [
        "//bzl/js:chai-js",
        "//reality/shared/gateway:validate-gateway-definition",
    ],
)

js_test(
    name = "validate-gateway-headers-test",
    size = "small",
    main = [
        "validate-gateway-headers-test.ts",
    ],
    npm_rule = "@npm-lambda//:npm-lambda",
    deps = [
        "//bzl/js:chai-js",
        "//reality/shared/gateway:validate-gateway-definition",
    ],
)

js_test(
    name = "validate-gateway-route-test",
    size = "small",
    main = [
        "validate-gateway-route-test.ts",
    ],
    npm_rule = "@npm-lambda//:npm-lambda",
    deps = [
        "//bzl/js:chai-js",
        "//reality/shared/gateway:validate-gateway-definition",
    ],
)

js_test(
    name = "derive-rpc-name-test",
    size = "small",
    main = [
        "derive-rpc-name-test.ts",
    ],
    npm_rule = "@npm-lambda//:npm-lambda",
    deps = [
        "//bzl/js:chai-js",
        "//reality/shared/gateway:derive-rpc-name",
    ],
)

js_library(
    name = "validate-function-config",
    srcs = [
        "validate-function-config.ts",
    ],
    deps = [
        "//reality/shared/gateway:limits",
    ],
)
