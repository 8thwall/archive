load("@rules_python//python:defs.bzl", "py_binary")
load("@nae_publish_deps//:requirements.bzl", "requirement")
load("//bzl/js:js.bzl", "js_cli")

package(default_visibility = ["//apps/client/nae:__subpackages__"])

py_binary(
    name = "slack-post-build",
    srcs = ["slack-post-build.py"],
    deps = [
        requirement("python-gitlab"),
        requirement("requests"),
        requirement("slack_sdk"),
    ],
)

js_cli(
    name = "run-packager",
    esnext = 1,
    main = [
        "run-packager.ts",
    ],
    npm_rule = "@npm-html-app-packager//:npm-html-app-packager",
    target = "node",
    visibility = ["//visibility:public"],
    deps = [
        "//c8/cli:args",
        "//c8/cli:proc",
        "//reality/shared/nae:nae-types",
    ],
)
