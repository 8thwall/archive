load("//bzl/zip:unzip.bzl", "unzip")

package(default_visibility = ["//visibility:public"])


filegroup(
    name = "arcore-aar-1-39",
    srcs = [
        "core-1.39.0.aar",
    ],
)

# Use this if you need to include Java symbols, for example for a android_library().
aar_import(
    name = "arcore-1-39",
    aar = ":arcore-aar-1-39",
    target_compatible_with = [
        "@platforms//os:android",
    ],
)

unzip(
    name = "arcore-jni-so-1-39",
    srcs = [
        "arcore-aar-1-39",
    ],
    outs =
        select({
            "//bzl/conditions:android-arm64": [
                "jni/arm64-v8a/libarcore_sdk_jni.so",
            ],
            "//bzl/conditions:android-arm": [
                "jni/armeabi-v7a/libarcore_sdk_jni.so",
            ],
            "//bzl/conditions:android-x86_32": [
                "jni/x86/libarcore_sdk_jni.so",
            ],
            "//bzl/conditions:android-x86_64": [
                "jni/x86_64/libarcore_sdk_jni.so",
            ],
            "//conditions:default": [],
        }),
    target_compatible_with = [
        "@platforms//os:android",
    ],
)

unzip(
    name = "arcore-c-so-1-39",
    srcs = [
        "arcore-aar-1-39",
    ],
    outs =
        select({
            "//bzl/conditions:android-arm64": [
                "jni/arm64-v8a/libarcore_sdk_c.so",
            ],
            "//bzl/conditions:android-arm": [
                "jni/armeabi-v7a/libarcore_sdk_c.so",
            ],
            "//bzl/conditions:android-x86_32": [
                "jni/x86/libarcore_sdk_c.so",
            ],
            "//bzl/conditions:android-x86_64": [
                "jni/x86_64/libarcore_sdk_c.so",
            ],
            "//conditions:default": [],
        }),
    target_compatible_with = [
        "@platforms//os:android",
    ],
)

cc_import(
    name = "arcore-c-1-39",
    hdrs = ["1.39.0/arcore_c_api.h"],
    shared_library = ":arcore-c-so-1-39",
    target_compatible_with = [
        "@platforms//os:android",
    ],
    visibility = ["//visibility:public"],
)

cc_import(
    name = "arcore-jni-1-39",
    shared_library = ":arcore-jni-so-1-39",
    target_compatible_with = [
        "@platforms//os:android",
    ],
    visibility = ["//visibility:public"],
)

cc_library(
    name = "arcore-libs-1-39",
    target_compatible_with = [
        "@platforms//os:android",
    ],
    visibility = ["//visibility:public"],
    deps = [
        ":arcore-c-1-39",
        ":arcore-jni-1-39",
    ],
)
