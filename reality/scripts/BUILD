load("//bzl/js:js.bzl", "js_cli")

js_cli(
    name = "eslint-diff",
    data = [
        "@npm-eslint//:modules",
    ],
    externals = "*",
    main = [
        "eslint-diff.js",
    ],
    npm_rule = "@npm-eslint//:npm-eslint",
)

js_cli(
    name = "audit-cloudwatch-logs",
    main = [
        "audit-cloudwatch-logs.ts",
    ],
    deps = [
        "//reality/scripts/lib:aws-cli",
    ],
)

js_cli(
    name = "fix-cloudwatch-retention",
    main = [
        "fix-cloudwatch-retention.ts",
    ],
    deps = [
        "//reality/scripts/lib:aws-cli",
    ],
)
