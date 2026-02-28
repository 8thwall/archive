load("@aspect_bazel_lib//lib:copy_to_directory.bzl", "copy_to_directory")

copy_to_directory(
    name = "itms-transporter",
    srcs = select({
        "@niantic//bzl/conditions:linux-x86_64": [
            "@itms-transporter-linux-x86_64//:itms-transporter",
        ],
        "@niantic//bzl/conditions:osx": [
            "@itms-transporter-macosx-universal//:itms-transporter",
        ],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    exclude_srcs_patterns = [
        "WORKSPACE",
        "BUILD.bazel",
    ],
    include_external_repositories = ["itms-transporter-*"],
    visibility = ["//visibility:public"],
)
