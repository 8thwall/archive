load("@rules_rust//rust:defs.bzl", "rust_binary")
load("//bzl/rust:rust.bzl", "rust_supported_platforms")

rust_binary(
    name = "pre-receive",
    srcs = ["pre-receive.rs"],
    target_compatible_with = rust_supported_platforms,
)
