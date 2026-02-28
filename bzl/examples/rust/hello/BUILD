load("@rules_rust//cargo:defs.bzl", "cargo_build_script")
load("@rules_rust//rust:defs.bzl", "rust_binary", "rust_library")
load("//bzl/rust:rust.bzl", "rust_supported_platforms")

cargo_build_script(
    name = "build",
    srcs = ["build.rs"],
    crate_root = "build.rs",
    edition = "2021",
    target_compatible_with = rust_supported_platforms,
)

rust_library(
    name = "lib",
    srcs = glob([
        "src/**/*.rs",
    ]),
    crate_name = "hello_lib",
    crate_root = "src/lib.rs",
    edition = "2021",
    target_compatible_with = rust_supported_platforms,
    deps = [
        ":build",
    ],
)

rust_binary(
    name = "main",
    srcs = ["src/main.rs"],
    crate_root = "src/main.rs",
    edition = "2021",
    target_compatible_with = rust_supported_platforms,
    deps = [
        ":lib",
    ],
)
