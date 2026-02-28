load("//bzl/android:android.bzl", "android_java_library")
load("//bzl/apple:objc.bzl", "nia_objc_library")

package(default_visibility = ["//visibility:public"])

android_java_library(
    name = "android-device",
    srcs = ["AndroidDevice.java"],
    deps = [],
)

android_java_library(
    name = "android-device-impl",
    srcs = ["AndroidDeviceImpl.java"],
    deps = [
        ":android-device",
        "//c8/annotations",
    ],
)

android_java_library(
    name = "android-device-info",
    srcs = ["AndroidDeviceInfo.java"],
    deps = [
        ":android-device",
        ":android-device-impl",
        "//c8/annotations",
        "//c8/io",
        "//reality/engine/api/device:info.capnp-java",
        "@capnproto_java//:capnp-runtime-java",
    ],
)

'''
android_test(
    name = "android-device-info-test",
    srcs = ["AndroidDeviceInfoTest.java"],
    test_class = "com.the8thwall.reality.app.device.AndroidDeviceInfoTest",
    deps = [
        ":android-device-impl-java",
        ":android-device-info-java",
        ":android-device-java",
        "//c8/io",
        "//reality/engine/api/device:info.capnp-java",
        "@capnproto_java//:capnp-runtime-java",
    ],
)
'''

nia_objc_library(
    name = "ios-device-info",
    srcs = ["ios-device-info.mm"],
    hdrs = [
        "ios-device-info.h",
    ],
    copts = [
        "-Wno-unguarded-availability-new",
    ],
    sdk_frameworks = [
        "AVFoundation",
        "UIKit",
    ],
    target_compatible_with = select({
        "@niantic//bzl/conditions:ios": [],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    visibility = [
        "//visibility:public",
    ],
    deps = [
        "//reality/engine/api/device:info.capnp-cc",
    ],
)
