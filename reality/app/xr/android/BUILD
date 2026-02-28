load("//bzl/android:android.bzl", "android_cc_deploy_zip", "android_deploy_aar")

package(default_visibility = ["//visibility:public"])

filegroup(
    name = "xr-android-manifest",
    srcs = [
        "AndroidManifest.xml",
    ],
)

filegroup(
    name = "xr-android-proguard-specs",
    srcs = [
        "proguard-android.pro",
    ],
)

filegroup(
    name = "xr-android-aar-proguard-specs",
    srcs = [
        "proguard-android-aar.pro",
    ],
)

cc_library(
    name = "xr-android-cc",
    srcs = [],
    linkopts = [
        "-ldl",
    ],
    deps = [
        ":xr-android-dll",
        ":xr-gl-android",
        ":xr-gl-android-jni",
    ],
)

android_library(
    name = "xr-android-java",
    srcs = [
        "XREngine.java",
        "XRGLAndroid.java",
        "XRGLAndroidARCore.java",
        "XRGLAndroidC8.java",
        "XRGLAndroidDriver.java",
        "XRGLAndroidJni.java",
        "XRGLAndroidRemoteOnly.java",
    ],
    visibility = [
        "//visibility:public",
    ],
    deps = [
        ":xr-gl-android-jni",
        "//c8/annotations",
        "//c8/io",
        "//c8/io:capnp-messages",
        "//c8/protolog/api:log-request.capnp-java",
        "//c8/protolog/api:remote-request.capnp-java",
        "//reality/app/analytics/android:xr-android-analytics",
        "//reality/app/app:android-app",
        "//reality/app/device:android-device-info",
        "//reality/app/sensors/arcore:arcore-sensor",
        "//reality/app/sensors/camera:android-native-camera-data",
        "//reality/app/sensors/camera:gl-android-camera-sensor",
        "//reality/app/sensors/gps:android-gps-sensor",
        "//reality/app/sensors/pose:android-pose-sensor",
        "//reality/app/validation/android:app-key-validator",
        "//reality/app/xr/common:api-limits-java",
        "//reality/app/xr/common:xr-extern-java",
        "//reality/app/xr/common:xr-requests-java",
        "//reality/engine/api:reality.capnp-java",
        "//reality/engine/api/base:debug.capnp-java",
        "//reality/engine/api/base:feature-types.capnp-java",
        "//reality/engine/api/base:geo-types.capnp-java",
        "//reality/engine/api/base:image-types.capnp-java",
        "//reality/engine/api/request:app.capnp-java",
        "//reality/engine/api/request:hit-test.capnp-java",
        "//reality/engine/api/request:sensor.capnp-java",
        "//reality/engine/api/response:features.capnp-java",
        "//third_party/arcore-1-39",
        "@capnproto_java//:capnp-runtime-java",
    ],
)

cc_library(
    name = "xr-gl-android",
    srcs = [
        "xr-gl-android.cc",
    ],
    hdrs = [
        "xr-gl-android.h",
    ],
    linkopts = select({
        "@niantic//bzl/conditions:android": [
            "-landroid",
            "-llog",
            "-lGLESv3",
            "-ldl",
        ],
        "//conditions:default": [],
    }),
    visibility = [
        "//visibility:public",
    ],
    deps = [
        ":xr-gl-android-frame",
        ":xr-gl-android-processor",
        "//bzl/inliner:rules",
        "//c8:c8-log",
        "//c8:c8-log-proto",
        "//c8:exceptions",
        "//c8:staged-ring-buffer",
        "//c8/geometry:pixel-pinhole-camera-model",
        "//c8/pixels",
        "//c8/pixels:pixel-buffer",
        "//c8/pixels:pixel-transforms",
        "//c8/protolog:xr-requests",
        "//c8/stats:scope-timer",
        "//c8/stats:self-timing-scope-lock",
        "//reality/app/xr/common:camera-framework",
        "//reality/engine/api:reality.capnp-cc",
        "//reality/engine/executor:xr-engine",
        "//reality/engine/logging:remote-streamer",
        "//reality/engine/logging:xr-log-preparer",
    ],
)

filegroup(
    name = "xr-controller-public-hdrs",
    srcs = [
        "xr-controller.h",
        "xr-data-types.h",
    ],
)

cc_library(
    name = "xr-controller-cc",
    srcs = [
        "xr-controller.cc",
        "xr-native-bridge.cc",
        "xr-native-bridge.h",
    ],
    hdrs = [
        ":xr-controller-public-hdrs",
    ],
    linkopts = select({
        "@niantic//bzl/conditions:android": [
            "-landroid",
            "-ldl",
            "-llog",
            "-lGLESv3",
            "-lz",
        ],
        "//conditions:default": [],
    }),
    deps = [
        "//c8:c8-log",
        "//c8:map",
        "//c8:set",
        "//c8:string",
        "//c8/io:capnp-messages",
        "//c8/protolog:xr-extern",
        "//c8/protolog:xr-requests",
        "//reality/engine/api:reality.capnp-cc",
    ],
)

# This is the rule to build 8th Wall XR for Android-Java.
android_deploy_aar(
    name = "xr8",
    manifest = ":xr-android-manifest",
    merge_aars = [
        "//third_party/arcore-1-39:arcore-aar-1-39",
    ],
    proguard_includes = ":xr-android-aar-proguard-specs",
    proguard_specs = [
        ":xr-android-proguard-specs",
    ],
    deps = [
        ":xr-android-cc",
        ":xr-android-java",
    ],
)

# Rule to import xr8 from other bazel android_binary rules.
aar_import(
    name = "xr8-bzl",
    aar = ":xr8-aar.aar",
)

# This is the rule to build 8th Wall XR for Android-C++.
android_cc_deploy_zip(
    name = "xr8-cc",
    srcs = [
        ":xr-controller-public-hdrs",
        ":xr8",
    ],
    deps = [
        ":xr-controller-cc",
    ],
)

# START_AUTOGENERATED_RULES
# Do not edit these rules manually, use inliner.
cc_library(
    name = "xr-android-dll",
    srcs = [
        "xr-android-dll.cc",
    ],
    hdrs = [
        "xr-android-dll.h",
    ],
    visibility = [
        "//visibility:public",
    ],
    deps = [
        "//bzl/inliner:rules",
    ],
)

# file: xr-android-unity-render.cc
cc_library(
    name = "xr-android-unity-render",
    srcs = [
        "xr-android-unity-render.cc",
    ],
    tags = [
        "manual",
    ],
    visibility = [
        "//visibility:public",
    ],
    deps = [
        ":xr-gl-android",
        "//bzl/inliner:rules2",
        "//bzl/unity:plugin-api",
    ],
)
# cc_end(0x6b0f9da2)

# file: xr-gl-android-frame.cc
cc_library(
    name = "xr-gl-android-frame",
    srcs = [
        "xr-gl-android-frame.cc",
    ],
    hdrs = [
        "xr-gl-android-frame.h",
    ],
    deps = [
        "//bzl/inliner:rules2",
        "//c8:c8-log",
        "//c8/io:capnp-messages",
        "//c8/pixels:pixel-buffer",
        "//c8/pixels/opengl:gl-framebuffer",
        "//reality/engine/api:reality.capnp-cc",
        "//reality/engine/features:gl-reality-frame",
    ],
)
# cc_end(0x130fe0d7)

# file: xr-gl-android-jni.cc
cc_library(
    name = "xr-gl-android-jni",
    srcs = [
        "xr-gl-android-jni.cc",
    ],
    visibility = [
        "//visibility:public",
    ],
    deps = [
        ":xr-gl-android",
        ":xr-gl-android-processor",
        "//bzl/inliner:rules2",
        "//c8:release-config",
        "//c8:string",
        "//c8:vector",
        "//c8/io:capnp-messages",
    ],
    alwayslink = 1,
)
# cc_end(0x5ae830eb)

# file: xr-gl-android-processor.cc
cc_library(
    name = "xr-gl-android-processor",
    srcs = [
        "xr-gl-android-processor.cc",
    ],
    hdrs = [
        "xr-gl-android-processor.h",
    ],
    visibility = [
        "//visibility:__pkg__",
    ],
    deps = [
        ":xr-gl-android-frame",
        "//bzl/inliner:rules2",
        "//c8:c8-log",
        "//c8/pixels:pixel-buffer",
        "//c8/pixels:pixel-transforms",
        "//c8/pixels/opengl:gl-framebuffer",
        "//c8/pixels/opengl:gl-headers",
        "//c8/pixels/opengl:gl-pixel-buffer",
        "//c8/pixels/opengl:gl-texture",
        "//c8/pixels/opengl:offscreen-gl-context",
        "//c8/pixels/opengl:texture-transforms",
        "//c8/stats:scope-timer",
        "//reality/engine/features:gl-reality-frame",
    ],
)
# cc_end(0x5a1d78d0)
# END_AUTOGENERATED_RULES
