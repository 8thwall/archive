load("//bzl/android:android.bzl", "android_java_library")
load("//bzl/apple:objc.bzl", "nia_objc_library")

package(
    default_visibility = [
        # TODO(nbutko): remove visibility public; this requires unity_project
        # rules to pull in android_srs transitively based on their deps.
        "//visibility:public",
    ],
)

android_java_library(
    name = "android-native-camera-data",
    srcs = [
        "AndroidNativeCameraData.java",
    ],
    deps = [
        "//reality/app/xr/common:api-limits-java",
    ],
)

android_java_library(
    name = "gl-android-camera-sensor",
    srcs = [
        "GlAndroidCameraSensor.java",
        "GlAndroidCameraSensorApi19.java",
        "GlAndroidCameraSensorApi22.java",
        "GlAndroidCameraSensorFactory.java",
    ],
    deps = [
        ":android-native-camera-data",
        "//reality/app/xr/common:api-limits-java",
    ],
)

nia_objc_library(
    name = "ios-camera-sensor",
    srcs = ["ios-camera-sensor.mm"],
    hdrs = [
        "ios-camera-image-callback.h",
        "ios-camera-sensor.h",
    ],
    sdk_frameworks = [
        "AVFoundation",
        "CoreMedia",
        "CoreVideo",
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
    ],
)
