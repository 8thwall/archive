load("//bzl/httpfileserver:http-file-server.bzl", "http_file_server")

http_file_server(
    name = "serve",
    data = [
        "index.html",
        "index.js",
    ] + glob([
      "textures/*.png",
      "textures/*.webm",
      "three/*/*/*.js",
    ]),
    root_redirect = "apps/client/exploratory/webxr-layer/index.html",
)
