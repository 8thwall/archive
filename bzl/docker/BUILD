load("@rules_oci//oci:defs.bzl", "oci_image")
load("@aspect_bazel_lib//lib:tar.bzl", "tar")
load("@aspect_bazel_lib//lib:transitions.bzl", "platform_transition_filegroup")

package(
    default_visibility = ["//visibility:public"],
)

exports_files(["oci_set_ssh_key.sh"])

# Base images used for CI/CD
# Adds the necessary ssh credentials
oci_image(
    name = "golang_base",
    base = "@distroless_base",
    cmd = ["bzl/docker/oci_set_ssh_key.sh"],
    tars = [":credentials_script"],
    visibility = ["//visibility:public"],
)

# This is the base that should be used so that the image can be pushed to the registry
# using cross platform builds
platform_transition_filegroup(
    name = "golang_base_amd64",
    srcs = [":golang_base"],
    target_platform = select({
        "@platforms//cpu:arm64": "@io_bazel_rules_go//go/toolchain:linux_amd64",
        "@platforms//cpu:x86_64": "@io_bazel_rules_go//go/toolchain:linux_amd64",
    }),
    visibility = ["//visibility:public"],
)

tar(
    name = "credentials_script",
    srcs = [":oci_set_ssh_key.sh"],
)
