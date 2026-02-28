load("//bzl/apple:objc.bzl", "nia_objc_library")

package(
    default_visibility = [
        # TODO(nbutko): remove visibility public; this requires unity_project
        # rules to pull in android_srs transitively based on their deps.
        "//visibility:public",
    ],
)

android_library(
    name = "android-pose-sensor",
    srcs = ["AndroidPoseSensor.java"],
    deps = [],
)

nia_objc_library(
    name = "ios-pose-sensor",
    srcs = ["ios-pose-sensor.mm"],
    hdrs = ["ios-pose-sensor.h"],
    sdk_frameworks = [
        "AVFoundation",
        "CoreMotion",
    ],
    target_compatible_with = select({
        "@niantic//bzl/conditions:ios": [],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    visibility = [
        "//reality/app/deprecated:__subpackages__",
        "//reality/app/xr:__subpackages__",
    ],
    deps = [
        "//c8:c8-log",
        "//c8:vector",
    ],
)
