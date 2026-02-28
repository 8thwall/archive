load("//bzl/docker:docker.bzl", "docker_image")

docker_image(
    name = "hello-cc-docker",
    main = [
        ":hello-docker",
    ],
)

cc_binary(
    name = "hello-docker",
    srcs = [
        "hello-docker.cc",
    ],
    target_compatible_with = select({
        "//bzl/conditions:ios": ["@platforms//:incompatible"],
        "//conditions:default": [],
    }),
    deps = [
        "//bzl/inliner:rules2",
        "//c8:c8-log",
        "//c8/pixels/opengl:offscreen-gl-context",
    ],
)
