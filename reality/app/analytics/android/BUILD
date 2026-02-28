load("//bzl/android:android.bzl", "android_java_library")

package(default_visibility = ["//visibility:public"])

android_java_library(
    name = "xr-android-analytics",
    srcs = [
        "XRAnalyticsHttpRequest.java",
        "XRAnalyticsIntentService.java",
        "XRAnalyticsLogHeaderFactory.java",
        "XRAnalyticsLogger.java",
    ],
    deps = [
        "//c8/annotations",
        "//c8/network:android-network-util",
        "//c8/protolog/api:log-request.capnp-java",
        "//c8/string",
        "//reality/app/device:android-device",
        "//reality/app/device:android-device-impl",
        "//reality/app/device:android-device-info",
        "//reality/app/validation/android:app-key-status-shared-prefs",
        "//reality/app/validation/android:app-key-status-storage",
        "//reality/app/xr/common:xr-extern-java",
        "@capnproto_java//:capnp-runtime-java",
    ],
)

'''
android_test(
    name = "xr-android-analytics-logger-test",
    srcs = [
        "XRAnalyticsLoggerTest.java",
    ],
    test_class = "com.the8thwall.reality.app.analytics.android.XRAnalyticsLoggerTest",
    deps = [
        ":xr-android-analytics-java",
        "//c8/network:android-network-util-java",
        "@mockito//jar",
    ],
)

android_test(
    name = "xr-android-analytics-log-header-factory-test",
    srcs = [
        "XRAnalyticsLogHeaderFactoryTest.java",
    ],
    test_class = "com.the8thwall.reality.app.analytics.android.XRAnalyticsLogHeaderFactoryTest",
    deps = [
        ":xr-android-analytics-java",
        "//c8/protolog/api:log-request.capnp-java",
        "//c8/string",
        "//reality/app/device:android-device-impl-java",
        "//reality/app/device:android-device-info-java",
        "//reality/app/device:android-device-java",
        "//reality/app/validation/android:app-key-status-shared-prefs-java",
        "//reality/app/validation/android:app-key-status-storage",
        "//reality/app/xr/common:xr-extern-java",
        "//reality/engine/api/device:info.capnp-java",
        "@capnproto_java//:capnp-runtime-java",
        "@mockito//jar",
    ],
)
'''
