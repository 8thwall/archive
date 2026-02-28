load("//bzl/js:js.bzl", "js_cli", "js_library")

js_library(
    name = "crowdin",
    srcs = [
        "crowdin.ts",
    ],
)

js_cli(
    name = "upload",
    data = [
        "//third_party/crowdin:crowdin-cli",
    ],
    main = [
        "upload.ts",
    ],
    npm_rule = "@npm-ci-support//:npm-ci-support",
    deps = [
        ":crowdin",
        "//c8/cli:args",
        "//ci-support:helpers",
    ],
)

js_cli(
    name = "download",
    data = [
        "//third_party/crowdin:crowdin-cli",
    ],
    main = [
        "download.ts",
    ],
    npm_rule = "@npm-ci-support//:npm-ci-support",
    deps = [
        ":crowdin",
        "//c8/cli:args",
        "//ci-support:github",
        "//ci-support:helpers",
    ],
)
