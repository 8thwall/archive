cc_library(
    name = "display-info",
    srcs = [
        "display-info.cc",
    ],
    hdrs = [
        "display-info.h",
    ],
    target_compatible_with = [
        "@platforms//os:android",
    ],
    visibility = ["//c8/html-shell:__subpackages__"],
    deps = [
        "//bzl/android:landroid",
        "//c8:c8-log",
        "//c8/android/jni:scoped-local-env",
    ],
)

cc_library(
    name = "input-event-data-converter",
    srcs = [
        "input-event-data-converter.cc",
    ],
    hdrs = [
        "input-event-data-converter.h",
    ],
    target_compatible_with = [
        "@platforms//os:android",
    ],
    visibility = ["//c8/html-shell:__subpackages__"],
    deps = [
        "//bzl/android:landroid",
        "//c8/html-shell:input-event-data",
    ],
)

cc_library(
    name = "shell-activity-intent",
    srcs = [
        "shell-activity-intent.cc",
    ],
    hdrs = [
        "shell-activity-intent.h",
    ],
    target_compatible_with = [
        "@platforms//os:android",
    ],
    visibility = [
        "//visibility:public",
    ],
    deps = [
        "//c8:string",
        "//c8/android/jni:scoped-local-env",
    ],
)

cc_library(
    name = "shell-app-manifest",
    srcs = [
        "shell-app-manifest.cc",
    ],
    hdrs = [
        "shell-app-manifest.h",
    ],
    target_compatible_with = [
        "@platforms//os:android",
    ],
    visibility = [
        "//visibility:public",
    ],
    deps = [
        "//c8:c8-log",
        "//c8:string",
        "//c8/android/jni:scoped-local-env",
    ],
)

cc_library(
    name = "sensor-event-data-converter",
    srcs = [
        "sensor-event-data-converter.cc",
    ],
    hdrs = [
        "sensor-event-data-converter.h",
    ],
    target_compatible_with = [
        "@platforms//os:android",
    ],
    visibility = ["//c8/html-shell:__subpackages__"],
    deps = [
        "//bzl/android:landroid",
        "//c8:quaternion",
        "//c8/html-shell:sensor-event-data",
        "//c8/html-shell:sensor-event-data-conversion",
    ],
)

cc_library(
    name = "sensor-manager",
    srcs = [
        "sensor-manager.cc",
    ],
    hdrs = [
        "sensor-manager.h",
    ],
    target_compatible_with = [
        "@platforms//os:android",
    ],
    visibility = ["//c8/html-shell/android:__subpackages__"],
    deps = [
        ":sensor-event-data-converter",
        "//bzl/android:native-app-glue",
        "//c8:c8-log",
        "//c8:map",
        "//c8:string",
        "//c8/html-shell:dom-events",
    ],
)

cc_library(
    name = "android-helpers",
    srcs = [
        "android-helpers.cc",
    ],
    hdrs = [
        "android-helpers.h",
    ],
    target_compatible_with = [
        "@platforms//os:android",
    ],
    visibility = ["//c8/html-shell/android:__subpackages__"],
    deps = [
        "//c8:string",
    ],
)
