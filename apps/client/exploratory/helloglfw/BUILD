load("//bzl/shader:shader.bzl", "shader_binary")
load("//bzl/utils:embedded.bzl", "embedded_data")
load("//bzl/js:js.bzl", "js_cli")

cc_binary(
    name = "hello-glfw",
    srcs = [
        "hello-glfw.cc",
    ],
    deps = [
        ":embedded-shaders",
        "//c8:exceptions",
        "//c8:scope-exit",
        "//c8/pixels/opengl:client-gl",
        "//c8/pixels/opengl:gl-headers",
        "//c8/pixels/opengl:gl-program",
        "//c8/pixels/opengl:gl-vertex-array",
        "@glfw",
    ],
)

shader_binary(
    name = "hello-glfw-frag",
    srcs = [
        "hello-glfw.frag",
    ],
)

shader_binary(
    name = "hello-glfw-vert",
    srcs = [
        "hello-glfw.vert",
    ],
)

embedded_data(
    name = "embedded-shaders",
    srcs = [
        ":hello-glfw-frag",
        ":hello-glfw-vert",
    ],
)

js_cli(
    name = "hello-glfw-node",
    main = [
        "hello-glfw-node.js",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    deps = [
        "//third_party/glfw-raub",
        "//third_party/headless-gl",
    ],
)
