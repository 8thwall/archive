load("//bzl/httpfileserver:http-file-server.bzl", "http_file_server")
load("//bzl/js:js.bzl", "js_binary")
load("//bzl/npmpackage:typecheck.bzl", "npm_typecheck")

npm_typecheck(name = "npm-responsive-immersive")

http_file_server(
    name = "serve",
    data = [
        ":responsive-immersive",
        "//reality/app/xr/js:xr-js",
    ],
)

js_binary(
    name = "responsive-immersive",
    main = [
        "index.js",
    ],
    npm_rule = "@npm-responsive-immersive//:npm-responsive-immersive",
    deps = [
        "//apps/client/public/web/responsive-immersive/aframe:responsive-immersive-component",
        "//apps/client/public/web/responsive-immersive/threejs:responsive-immersive",
    ],
)
