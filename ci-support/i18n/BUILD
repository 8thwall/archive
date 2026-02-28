load("//bzl/js:js.bzl", "js_cli")

js_cli(
    name = "translate",
    main = [
        "translate.ts",
    ],
    npm_rule = "@npm-ci-support//:npm-ci-support",
    deps = [
        "//c8/cli:args",
        "//ci-support/i18n/translation:translation-config",
        "//ci-support/i18n/translation:translation-engine-mock",
        "//ci-support/i18n/translation:translation-engine-chatgpt",
        "//ci-support/i18n/translation:translation-task",
    ],
)

js_cli(
    name = "translate-ci",
    main = [
        "translate-ci.ts",
    ],
    npm_rule = "@npm-ci-support//:npm-ci-support",
    deps = [
        "//ci-support:gitlab-service",
    ],
)
