load("//bzl/apple:objc.bzl", "nia_objc_library")

android_library(
    name = "android-gps-sensor",
    srcs = ["AndroidGpsSensor.java"],
    visibility = [
        "//visibility:public",
    ],
    deps = [
        "@androidsdk//com.android.support:percent-25.0.1",
    ],
)

nia_objc_library(
    name = "core-location-controller",
    srcs = ["core-location-controller.mm"],
    hdrs = [
        "core-location-controller.h",
    ],
    copts = [
        "-Wno-unguarded-availability-new",
    ],
    sdk_frameworks = [
        "CoreLocation",
    ],
    target_compatible_with = select({
        "@niantic//bzl/conditions:ios": [],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    visibility = [
        "//reality/app:__subpackages__",
    ],
    deps = [
        "//c8:c8-log",
    ],
)
