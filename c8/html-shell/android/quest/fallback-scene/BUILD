load("//bzl/httpfileserver:http-file-server.bzl", "http_file_server")
load("//bzl/js:js.bzl", "js_binary", "js_library")

filegroup(
    name = "dist",
    srcs = [
        "no-internet.png",
        ":app",
        ":index.html",
    ],
    visibility = ["//c8/html-shell/android/quest:__subpackages__"],
)

js_binary(
    name = "app",
    esnext = 1,
    main = [
        "app.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    deps = [
        "//c8/html-shell/android/quest/fallback-scene:xr-button",
    ],
)

js_library(
    name = "xr-button",
    srcs = [
        "xr-button.ts",
    ],
    deps = [
        "//c8/xrapi:xrapi-native",
        "//c8/xrapi:xrapi-types",
    ],
)

http_file_server(
    name = "serve",
    data = [
        ":dist",
    ],
    root_redirect = "c8/html-shell/android/quest/fallback-scene/index.html",
)
