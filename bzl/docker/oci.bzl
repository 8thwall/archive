"""
This module defines rules for building, pushing, and loading OCI-compliant tools.
"""

load("@rules_oci//oci:defs.bzl", "oci_image", "oci_load", "oci_push")
load("@rules_pkg//:pkg.bzl", "pkg_tar")

# oci_rules_go creates a set of rules to build a docker image from a go binary
# The following rules are created:
# - A tar file containing the binary and all its dependencies
# - An oci_image rule to build the docker image. Named image_amd64
# - An oci_push rule to push the image to a registry. Named push
# - An oci_load rule to load the image locally. Named load
def oci_rules_go(srcs, image_name = None, registry = "us.gcr.io/mcmc-193822"):
    """
    Creates rules to build, push, and load a Docker image from a Go binary.

    Args:
        srcs: List of source files for the Go binary.
        image_name: Optional name for the Docker image. Defaults to the first source file's name.
        registry: Registry URL where the image will be pushed. Defaults to "us.gcr.io/mcmc-193822".
    """

    # Check that srcs is not empty
    if not srcs:
        fail("srcs cannot be empty")

    # If no image_name is provided, use the first src as the image_name
    if not image_name:
        image_name = srcs[0].split(":")[1]

    # Put given binary into a tar layer for image building
    pkg_tar(
        name = image_name + "-layer",
        srcs = srcs,
    )

    # This builds a docker image with the tar layer in it
    oci_image(
        name = "image_amd64",
        base = "//bzl/docker:golang_base_amd64",
        entrypoint = ["./" + image_name],
        tars = [":" + image_name + "-layer"],
        visibility = ["//visibility:public"],
    )

    # Used to push the server image built with oci_image to the registry
    oci_push(
        name = "push",
        image = ":image_amd64",
        repository = registry + "/" + image_name,
    )

    # Used to locally test an image built with oci_image
    oci_load(
        name = "load",
        image = ":image_amd64",
        repo_tags = [registry + "/" + image_name + ":test"],
    )
