load("@org_tensorflow//tensorflow:tensorflow.bzl", "py_binary", "pybind_extension")

pybind_extension(
    name = "example_native",
    srcs = ["native.cc"],
    deps = [
        "@pybind11",
    ],
)

py_binary(
    name = "example",
    srcs = ["example.py"],
    legacy_create_init = False,
    python_version = "PY3",
    target_compatible_with = select({
        "@niantic//bzl/conditions:osx": [],
        "@niantic//bzl/conditions:linux": [],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    deps = [":example_native"],
)
