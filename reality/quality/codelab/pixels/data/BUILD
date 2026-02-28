load("//bzl/utils:embedded.bzl", "embedded_data")
load("//bzl/shader:shader.bzl", "shader_binary")

package(
    default_visibility = [
        "//reality/quality/codelab/pixels:__subpackages__",
    ],
)

filegroup(
    name = "img",
    srcs = [
        "test480x640.jpg",
    ],
)

embedded_data(
    name = "pixels-codelab-shaders",
    srcs = [
        ":image-frag",
        ":image-vert",
    ],
)

shader_binary(
    name = "image-frag",
    srcs = [
        "image.frag",
    ],
)

shader_binary(
    name = "image-vert",
    srcs = [
        "image.vert",
    ],
)
