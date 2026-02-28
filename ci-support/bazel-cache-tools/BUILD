load("//bzl/js:js.bzl", "js_cli")

js_cli(
    name = "cache-test-ci",
    main = [
        "cache-test-ci.ts",
    ],
    npm_rule = "@npm-ci-support//:npm-ci-support",
    deps = [
        "//ci-support:gitlab-service",
        "//ci-support:helpers",
    ],
)

js_cli(
    name = "inspect-remote-cache-data",
    main = [
        "inspect-remote-cache-data.ts",
    ],
    npm_rule = "@npm-ci-support//:npm-ci-support",
    deps = [
        "//ci-support:helpers",
    ],
)
