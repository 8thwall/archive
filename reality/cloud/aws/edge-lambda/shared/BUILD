load("//bzl/js:js.bzl", "js_library", "js_test")

package(
    default_visibility = ["//visibility:public"],
)

js_library(
    name = "parse-hosting-domain",
    srcs = [
        "parse-hosting-domain.js",
    ],
)

js_test(
    name = "parse-hosting-domain-test",
    size = "small",
    main = [
        "parse-hosting-domain-test.ts",
    ],
    npm_rule = "@npm-lambda//:npm-lambda",
    deps = [
        "//bzl/js:chai-js",
        "//reality/cloud/aws/edge-lambda/shared:parse-hosting-domain",
    ],
)
