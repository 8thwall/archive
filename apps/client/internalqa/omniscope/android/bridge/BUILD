package(default_visibility = ["//visibility:public"])

android_library(
    name = "xr-android-java",
    srcs = [
        "Omniscope.java",
        "OmniscopeJni.java",
    ],
    visibility = [
        "//visibility:public",
    ],
    deps = [
        ":omniscope-jni",
        "//c8/android:render-loop-view-controller",
        "//c8/annotations",
        "//c8/io",
        "//c8/io:capnp-messages",
        "//c8/protolog/api:log-request.capnp-java",
        "//c8/protolog/api:remote-request.capnp-java",
        "//c8/time:now",
        "//reality/app/analytics/android:xr-android-analytics",
        "//reality/app/app:android-app",
        "//reality/app/device:android-device-info",
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
        "@capnproto_java//:capnp-runtime-java",
    ],
)

cc_library(
    name = "omniscope-jni",
    srcs = [
        "omniscope-jni.cc",
    ],
    visibility = [
        "//visibility:public",
    ],
    deps = [
        "//apps/client/internalqa/omniscope/native/pipeline:omniscope-pipeline",
        "//c8:release-config",
        "//c8:string",
        "//c8:vector",
        "//c8/io:capnp-messages",
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
    alwayslink = 1,
)
