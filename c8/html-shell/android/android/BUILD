load("//bzl/android:android-node-binary.bzl", "android_node_aar")

# NOTE(lreyna): This should generally be false, but can optionally be set to true to help debug
# issues with iOS which need to be jitless. Currently, it's easier to profile on Android, so this
# also helps get a comparable performance profile for iOS.
config_setting(
    name = "jit-disabled",
    define_values = {"JIT_DISABLED": "true"},
)

android_node_aar(
    name = "html-shell-android",
    assets = [
        "//c8/html-shell:app",
    ] + select({
        ":jit-disabled": [
            "//c8/dom:web-assembly-override",
        ],
        "//conditions:default": [],
    }),
    java_deps = [
        "//c8/html-shell/android/android:vibration",
    ],
    manifest = "AndroidManifest.xml",
    proguard_includes = ":android-html-shell-proguard-specs",
    visibility = ["//visibility:public"],
    deps = [
        ":android-shell-main-cc",
        "//bzl/android:native-app-glue",
        "@node//:node-shared",
    ],
)

filegroup(
    name = "android-html-shell-proguard-specs",
    srcs = [
        "android-html-shell.pro",
    ],
)

cc_library(
    name = "redirect",
    srcs = [
        "redirect.cc",
    ],
    hdrs = [
        "redirect.h",
    ],
    target_compatible_with = select({
        "//bzl/node:source-built-true": ["@platforms//os:android"],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    deps = [
        "//c8:c8-log",
    ],
)

cc_library(
    name = "android-shell-main-cc",
    srcs = [
        "android-shell-main.cc",
    ],
    defines = select({
        ":jit-disabled": ["JIT_DISABLED"],
        "//conditions:default": [],
    }) + select({
        "//c8/html-shell:nae-inspector-enabled": ["NAE_INSPECTOR_ENABLED"],
        "//conditions:default": [],
    }),
    target_compatible_with = [
        "@platforms//os:android",
    ],
    deps = [
        ":shell-app-state",
        "//bzl/android:native-app-glue",
        "//c8:c8-log",
        "//c8:string",
        "//c8:vector",
        "//c8/html-shell:html-shell-helpers",
        "//c8/html-shell:node-binding",
        "//c8/html-shell/android:android-helpers",
        "//c8/html-shell/android:display-info",
        "//c8/html-shell/android:input-event-data-converter",
        "//c8/html-shell/android:sensor-manager",
        "//c8/html-shell/android:shell-activity-intent",
        "//c8/html-shell/android:shell-app-manifest",
        "//c8/html-shell/android/android:redirect",
        "//c8/io:file-io",
        "//c8/string:join",
    ],
)

cc_library(
    name = "shell-app-state",
    srcs = [
        "shell-app-state.cc",
    ],
    hdrs = [
        "shell-app-state.h",
    ],
    target_compatible_with = [
        "@platforms//os:android",
    ],
    deps = [
        "//c8/html-shell:shell-app-state-base",
        "//c8/html-shell/android:sensor-manager",
        "//c8/html-shell/android/android:haptics-manager",
    ],
)

cc_library(
    name = "video-decoder",
    srcs = [
        "video-decoder.cc",
    ],
    hdrs = [
        "video-decoder.h",
    ],
    target_compatible_with = [
        "@platforms//os:android",
    ],
    deps = [
        "//bzl/android:landroid",
        "//c8:c8-log",
        "//c8:string",
    ],
)

cc_library(
    name = "haptics-manager",
    srcs = [
        "haptics-manager.cc",
    ],
    hdrs = [
        "haptics-manager.h",
    ],
    target_compatible_with = [
        "@platforms//os:android",
    ],
    deps = [
        "//bzl/android:native-app-glue",
        "//c8:c8-log",
        "//c8:vector",
    ],
)

android_library(
    name = "vibration",
    srcs = [
        "VibrationHelper.java",
    ],
)
