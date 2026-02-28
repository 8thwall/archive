load("//bzl/httpfileserver:http-file-server.bzl", "http_file_server")
load("//bzl/js:js.bzl", "js_binary")

http_file_server(
    name = "serve",
    data = [
        "index.html",
        ":app",
    ],
    root_redirect = "apps/client/exploratory/rawvr/index.html",
)

js_binary(
    name = "app",
    esnext = 1,
    main = [
        "app.ts",
    ],
    deps = [
        "//c8/xrapi:xrapi-emulated",
        "//c8/xrapi:xrapi-native",
        "//c8/xrapi:xrapi-types",
    ],
)
