load("//bzl/android:android.bzl", "android_java_library")

package(default_visibility = ["//visibility:private"])

java_library(
    name = "app-key-status-storage",
    srcs = [
        "AppKeyStatusStorage.java",
    ],
    visibility = [
        "//visibility:public",
    ],
    deps = [
        "//c8/protolog/api:log-request.capnp-java",
        "@capnproto_java//:capnp-runtime-java",
    ],
)

android_java_library(
    name = "app-key-status-shared-prefs",
    srcs = [
        "AppKeyStatusSharedPrefs.java",
    ],
    visibility = [
        "//visibility:public",
    ],
    deps = [
        ":app-key-status-storage",
        "//c8/annotations",
        "//c8/protolog/api:log-request.capnp-java",
        "//c8/string",
    ],
)

'''
android_test(
    name = "app-key-status-shared-prefs-test",
    srcs = [
        "AppKeyStatusSharedPrefsTest.java",
    ],
    test_class = "com.the8thwall.reality.app.validation.android.AppKeyStatusSharedPrefsTest",
    deps = [
        ":app-key-status-shared-prefs-java",
        ":app-key-status-storage",
        "//c8/protolog/api:log-request.capnp-java",
        "//c8/string",
    ],
)
'''

android_java_library(
    name = "local-app-key-validator",
    srcs = [
        "LocalAppKeyValidator.java",
    ],
    deps = [
        ":app-key-status-shared-prefs",
        ":app-key-status-storage",
        "//c8/annotations",
        "//c8/exceptions:exceptions-java",
        "//c8/io:base-x-encoding-android",
        "//c8/protolog/api:log-request.capnp-java",
        "//c8/string",
    ],
)

'''
android_test(
    name = "local-app-key-validator-test",
    srcs = [
        "LocalAppKeyValidatorTest.java",
    ],
    test_class = "com.the8thwall.reality.app.validation.android.LocalAppKeyValidatorTest",
    deps = [
        ":app-key-status-shared-prefs-java",
        ":app-key-status-storage",
        ":local-app-key-validator-java",
        "//c8/exceptions:exceptions-java",
        "//c8/io:base-x-encoding-android-java",
        "//c8/protolog/api:log-request.capnp-java",
        "//c8/string",
        "@mockito//jar",
    ],
)
'''

android_java_library(
    name = "app-key-validator",
    srcs = [
        "ValidateAppKeyRequest.java",
        "XRAppValidationIntentService.java",
        "XRAppValidationService.java",
        "XRAppValidator.java",
    ],
    visibility = [
        "//visibility:public",
    ],
    deps = [
        ":app-key-status-shared-prefs-java",
        ":app-key-status-storage",
        ":local-app-key-validator",
        "//c8/annotations",
        "//c8/exceptions:exceptions-java",
        "//c8/network:android-network-util",
        "//c8/protolog/api:log-request.capnp-java",
        "//third_party/androidsupport:job-intent-service",
        "@capnproto_java//:capnp-runtime-java",
    ],
)
