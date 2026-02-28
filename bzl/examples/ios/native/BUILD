load("//bzl/apple:nia-apple-native-binary.bzl", "nia_apple_native_binary")
load("//bzl/apple:objc.bzl", "nia_objc_library")

# Build and run with:
# - bazel build //bzl/examples/ios/native:hello-ios --platforms=//bzl:ios_arm64 && ios-deploy --verbose --bundle bazel-bin/bzl/examples/ios/native/HelloIOS.app
nia_apple_native_binary(
    name = "hello-ios",
    srcs = [
        "hello-ios.m",
    ],
    display_name = "HelloIOS",
    entitlements = "Entitlements.plist",
    info_plist = "Info.plist",
    platform = "ios",
    provisioning_profile = "@apple-developer-team//:wildcard-development",
    sdk_frameworks = [
        "UIKit",
    ],
    target_compatible_with = select({
        "@apple-developer-team//:wildcard-development-and-personal-certificate": [
            "@platforms//os:ios",
        ],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    visibility = ["//visibility:public"],
    deps = [
        ":app-delegate",
        "//c8:c8-log",
        "//c8:string",
        "//c8:vector",
        "//c8/string:join",
    ],
)

nia_objc_library(
    name = "view-controller",
    srcs = [
        "ViewController.m",
    ],
    hdrs = [
        "ViewController.h",
    ],
    sdk_frameworks = [
        "UIKit",
    ],
    target_compatible_with = select({
        "@niantic//bzl/conditions:ios": [],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
)

nia_objc_library(
    name = "app-delegate",
    srcs = [
        "AppDelegate.m",
    ],
    hdrs = [
        "AppDelegate.h",
    ],
    sdk_frameworks = [
        "UIKit",
    ],
    target_compatible_with = select({
        "@niantic//bzl/conditions:ios": [],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    deps = [
        ":view-controller",
    ],
)
