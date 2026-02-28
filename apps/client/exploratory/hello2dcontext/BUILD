load("//bzl/js:js.bzl", "js_cli")

js_cli(
    name = "hello2dcontext",
    data = [
        "mona-lisa-da-vinci.jpg",
    ],
    esnext = 1,
    main = [
        "hello2dcontext.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    deps = [
        "//c8/dom",
        "//third_party/glfw-raub",
    ],
)
