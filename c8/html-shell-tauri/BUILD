load("@rules_rust//cargo:defs.bzl", "cargo_build_script")
load("@rules_rust//rust:defs.bzl", "rust_binary", "rust_library", "rust_test")
load("//bzl/apple:objc.bzl", "nia_objc_library")
load("//bzl/rust:rust.bzl", "rust_supported_platforms")

filegroup(
    name = "html-shell-tauri-build-sources",
    srcs = [
        "Cargo.toml",
        "capabilities/default.json",
        "icons/icon.png",
        "tauri.conf.json",
    ],
)

# This file comes from:
# - https://github.com/8thwall/objc2
# We build it manually instead of in the objc2-exception-wrapper's build.rs file b/c that file tries
# to use cc::Build, which is incompatible our build system. See more info here:
# - https://github.com/8thwall/objc2/pull/1
# - https://github.com/8thwall/objc2/commit/724f8c74e472089890619ed03dd2e099d53c212d
nia_objc_library(
    name = "try-catch",
    srcs = [
        "try_catch.m",
    ],
    target_compatible_with = select({
        "//bzl/conditions:apple": [],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    visibility = [
        "//c8/html-shell-tauri:__subpackages__",
    ],
)

cargo_build_script(
    name = "build",
    srcs = ["build.rs"],
    build_script_env = {
        "DEP_TAURI_DEV": "false",
    },
    compile_data = [
        ":html-shell-tauri-build-sources",
    ],
    crate_root = "build.rs",
    data = [
        ":html-shell-tauri-build-sources",
    ],
    edition = "2021",
    link_deps = [
        # Add dependencies to link_deps if their .depenv output needs to be used
        "@tauri-deps//:tauri",
        "@tauri-deps//:tauri-plugin-cors-fetch",
        "//c8/html-shell-tauri/plugins/tauri-plugin-native-app-export",
    ],
    rustc_env = {
        "DEP_TAURI_DEV": "false",
    },
    target_compatible_with = rust_supported_platforms,
    deps = [
        "@tauri-deps//:tauri",
        "@tauri-deps__tauri-build-2.4.0//:tauri_build",
    ],
)

rust_library(
    name = "lib",
    srcs = glob([
        "src/**/*.rs",
    ]),
    crate_name = "html_shell_tauri_lib",
    crate_root = "src/lib.rs",
    edition = "2021",
    target_compatible_with = rust_supported_platforms,
    deps = [
        ":build",
        "@tauri-deps//:aes-gcm",
        "@tauri-deps//:hex",
        "@tauri-deps//:mime_guess",
        "@tauri-deps//:once_cell",
        "@tauri-deps//:regex",
        "@tauri-deps//:reqwest",
        "@tauri-deps//:sha2",
        "@tauri-deps//:serde",
        "@tauri-deps//:serde_json",
        "@tauri-deps//:tauri",
        "@tauri-deps//:tauri-plugin-cors-fetch",
        "@tauri-deps//:url",
        "//c8/html-shell-tauri/plugins/tauri-plugin-native-app-export",
    ] + select({
        "//bzl/conditions:apple": [
            "@tauri-deps//:objc",
            ":try-catch",
        ],
        "//conditions:default": [],
    }),
)

rust_binary(
    name = "main",
    srcs = ["src/main.rs"],
    crate_root = "src/main.rs",
    edition = "2021",
    target_compatible_with = select({
        "//bzl/conditions:ios": [],
        "//bzl/conditions:osx": [],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    visibility = [
        "//visibility:public",
    ],
    deps = [
        ":lib",
    ],
)

genrule(
    name = "html-shell-ios",
    srcs = [":main"],
    outs = ["html-shell-ios.zip"],
    cmd = "cp $(location :main) html-shell-ios && zip -j $(OUTS) html-shell-ios",
    target_compatible_with = select({
        "//bzl/conditions:ios": [],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    visibility = ["//visibility:public"],
)

genrule(
    name = "html-shell-osx",
    srcs = [":main"],
    outs = ["html-shell-osx.zip"],
    cmd = (
        "mkdir -p Contents/MacOS && " +
        "cp $(location :main) Contents/MacOS/html-shell-osx && " +
        "zip $(OUTS) Contents/MacOS/html-shell-osx"
    ),
    target_compatible_with = select({
        "//bzl/conditions:osx": [],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    visibility = ["//visibility:public"],
)

rust_test(
    name = "dev_cookie_test",
    srcs = [
        "src/c8/dev_cookie.rs",
        "src/c8/dev_cookie_test.rs",
    ],
    crate_root = "src/c8/dev_cookie_test.rs",
    edition = "2021",
    target_compatible_with = rust_supported_platforms,
    deps = [
        "@tauri-deps//:aes-gcm",
        "@tauri-deps//:hex",
        "@tauri-deps//:mockito",
        "@tauri-deps//:reqwest",
        "@tauri-deps//:serde",
        "@tauri-deps//:serde_json",
        "@tauri-deps//:sha2",
        "@tauri-deps//:tokio",
        "@tauri-deps//:tokio-test",
    ],
)

rust_test(
    name = "nae_protocol_test",
    srcs = [
        "src/c8/dev_cookie.rs",
        "src/c8/info_plist.rs",
        "src/c8/nae_protocol.rs",
        "src/c8/nae_protocol_test.rs",
        "src/c8/path_helpers.rs",
        "src/c8/shell_app_state.rs",
        "src/c8/verify_xrweb_code.rs",
    ],
    crate_root = "src/c8/nae_protocol_test.rs",
    edition = "2021",
    target_compatible_with = rust_supported_platforms,
    deps = [
        "@tauri-deps//:aes-gcm",
        "@tauri-deps//:hex",
        "@tauri-deps//:mockito",
        "@tauri-deps//:mime_guess",
        "@tauri-deps//:once_cell",
        "@tauri-deps//:regex",
        "@tauri-deps//:reqwest",
        "@tauri-deps//:serde",
        "@tauri-deps//:serde_json",
        "@tauri-deps//:sha2",
        "@tauri-deps//:tauri",
        "@tauri-deps//:tokio",
        "@tauri-deps//:tokio-test",
        "@tauri-deps//:url",
    ] + select({
        "@niantic//bzl/conditions:ios": [
            "@tauri-deps//:objc",
        ],
        "@niantic//bzl/conditions:osx": [
            "@tauri-deps//:objc",
        ],
        "//conditions:default": [],
    }),
)
