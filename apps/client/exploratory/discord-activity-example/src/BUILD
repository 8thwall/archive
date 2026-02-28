load("//bzl/js:js.bzl", "js_cli", "js_library")

js_cli(
    name = "app",
    main = [
        "app.ts",
    ],
    npm_rule = "@npm-discord-activity//:npm-discord-activity",
    deps = [
        "//apps/client/exploratory/discord-activity-example/src:environment",
    ],
)

js_library(
    name = "environment",
    srcs = [
        "environment.ts",
    ],
)
