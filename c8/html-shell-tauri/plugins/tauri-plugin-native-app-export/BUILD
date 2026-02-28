load("@rules_rust//cargo:defs.bzl", "cargo_build_script")
load("@rules_rust//rust:defs.bzl", "rust_library")
load("//bzl/js:js.bzl", "js_binary")

PLUGIN_COMPILE_DATA = glob(
    include = ["**"],
    allow_empty = True,
    exclude = [
        "**/* *",
        "**/*.ts",
        ".tmp_git_root/**/*",
        "BUILD",
    ],
) + [
    "//c8/html-shell-tauri/plugins/tauri-plugin-native-app-export:api-iife",
]

js_binary(
    name = "api-iife",
    main = [
        "api-iife.ts",
    ],
)

rust_library(
    name = "tauri-plugin-native-app-export",
    srcs = glob(
        include = ["src/**/*.rs"],
        allow_empty = True,
    ),
    compile_data = PLUGIN_COMPILE_DATA,
    crate_features = [
        "dep:specta",
        "tauri/specta",
    ],
    crate_name = "tauri_plugin_native_app_export",
    crate_root = "src/lib.rs",
    edition = "2021",
    version = "2.3.0",
    visibility = ["//c8/html-shell-tauri:__pkg__"],
    deps = [
        "//c8/html-shell-tauri/plugins/tauri-plugin-native-app-export:build-script",
        "@tauri-deps//:log",
        "@tauri-deps//:serde",
        "@tauri-deps//:serde_json",
        "@tauri-deps//:tauri",
        "@tauri-deps//:thiserror",
    ] + select({
        "//bzl/conditions:apple": [
            "//c8/html-shell-tauri:try-catch",
        ],
        "//conditions:default": [],
    }),
)

cargo_build_script(
    name = "build-script",
    srcs = ["build.rs"],
    compile_data = PLUGIN_COMPILE_DATA,
    crate_name = "build_script_build",
    crate_root = "build.rs",
    data = PLUGIN_COMPILE_DATA,
    edition = "2021",
    link_deps = [
        "@tauri-deps//:tauri",
    ],
    links = "tauri-plugin-native-app-export",
    pkg_name = "tauri-plugin-native-app-export",
    version = "2.3.0",
    deps = [
        "@tauri-deps__tauri-plugin-2.4.0//:tauri_plugin",
    ],
)
