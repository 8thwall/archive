load("//bzl/js:js.bzl", "js_cli")

js_cli(
    name = "upload",
    data = ["//bzl/itms-transporter"],
    esnext = 1,
    main = [
        "upload.ts",
    ],
    npm_rule = "@npm-html-app-packager//:npm-html-app-packager",
    target = "node",
    visibility = ["//visibility:public"],
    deps = [
        "//c8/cli:args",
        "//c8/cli:proc",
    ],
)
