load("//bzl/zip:unzip.bzl", "unzip")

package(default_visibility = ["//visibility:public"])

# ARDK is using 1.22.0 for ARDK2.2 or above.
filegroup(
    name = "arcore-aar",
    srcs = [
        "core-1.22.0.aar",
    ],
)

# Use this if you need to include Java symbols, for example for a android_library().
aar_import(
    name = "arcore",
    aar = ":arcore-aar",
    target_compatible_with = [
        "@platforms//os:android",
    ],
)

unzip(
    name = "arcore-jni-so",
    srcs = [
        "arcore-aar",
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
    name = "arcore-c-so",
    srcs = [
        "arcore-aar",
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
    name = "arcore-c",
    hdrs = ["1.22.0/arcore_c_api.h"],
    shared_library = ":arcore-c-so",
    target_compatible_with = [
        "@platforms//os:android",
    ],
    visibility = ["//visibility:public"],
)

cc_import(
    name = "arcore-jni",
    shared_library = ":arcore-jni-so",
    target_compatible_with = [
        "@platforms//os:android",
    ],
    visibility = ["//visibility:public"],
)

cc_library(
    name = "arcore-libs",
    target_compatible_with = [
        "@platforms//os:android",
    ],
    visibility = ["//visibility:public"],
    deps = [
        ":arcore-c",
        ":arcore-jni",
    ],
)
