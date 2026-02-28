load("//bzl/capnproto:capnproto.bzl", "capnp_library", "cc_capnp_library")

capnp_library(
    name = "xrom",
    srcs = [
        "xrom.capnp",
    ],
    visibility = ["//visibility:public"],
    deps = [
    ],
)

capnp_library(
    name = "xrom-components",
    srcs = [
        "xrom-components.capnp",
    ],
    visibility = ["//visibility:public"],
    deps = [
        ":xrom",
    ],
)

# Currently java capnproto doesn't support interfaces (RPCs); here we only provide a cc library for
# the service itself.
cc_capnp_library(
    # Mimic the naming of normal generated cc_capnp targets so that we can add java support easily
    # later.
    name = "xrom-service.capnp-cc",
    srcs = [
        "xrom-service.capnp",
    ],
    visibility = ["//visibility:public"],
    deps = [
        ":xrom.capnp-cc",
    ],
)
