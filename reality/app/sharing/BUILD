load("//bzl/unity:unity.bzl", "unity_plugin")
load("//bzl/apple:objc.bzl", "nia_objc_library")

nia_objc_library(
    name = "screenshot-sharing-ios",
    srcs = [
        "iOSNativeShare.m",
    ],
    hdrs = [
        "iOSNativeShare.h",
    ],
    sdk_frameworks = [
        "UIKit",
    ],
    target_compatible_with = select({
        "//bzl/conditions:ios": [],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
)

unity_plugin(
    name = "screenshot-sharing-plugin",
    srcs = [
        "NativeShare.cs",
    ],
    build_all_target_platforms = select({
        # Build one platform with: --//reality:unity-target=one --platforms=//bzl:android_arm64
        "//reality:unity-target-one": False,
        # Build all platforms with: --//reality:unity-target=all
        "//reality:unity-target-all": True,
    }),
    project = "XRScreenshotSharing",
    target_platforms = [
        "//bzl:osx_x86_64",
        "//bzl:osx_arm64",
        "//bzl:android_arm64",
        "//bzl:android_armv7a",
        "//bzl:ios_arm64",
        "//bzl:windows_x86_64",
    ],
    visibility = ["//visibility:public"],
    deps = [
        "//reality/app/xr/streaming:xr-streaming",
    ] + select({
        "//bzl/conditions:ios": [":screenshot-sharing-ios"],
        "//conditions:default": [],
    }),
)
