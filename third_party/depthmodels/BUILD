licenses(["permissive"])

load("//bzl/utils:embedded.bzl", "embedded_data")

package(default_visibility = ["//visibility:public"])

filegroup(
    name = "pydnet",
    srcs = [
        "pydnet.tflite",
    ],
)

embedded_data(
    name = "embedded-pydnet",
    srcs = [
        "pydnet.tflite",
    ],
)
