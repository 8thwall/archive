load("//bzl/apple:objc.bzl", "nia_objc_library")

nia_objc_library(
    name = "xr-analytics-ios",
    srcs = [
        "xr-analytics-log-header-factory.mm",
        "xr-analytics-upload-controller.mm",
    ],
    hdrs = [
        "xr-analytics-log-header-factory.h",
        "xr-analytics-upload-controller.h",
    ],
    sdk_frameworks = [
        "AVFoundation",
        "UIKit",
    ],
    visibility = [
        "//visibility:public",
    ],
    deps = [
        ":xr-analytics-upload-session",
        "//c8:c8-log",
        "//c8:vector",
        "//c8/io:base-x-encoding",
        "//c8/protolog:xr-extern",
        "//c8/protolog/api:log-request.capnp-cc",
        "//reality/app/device:ios-device-info",
        "//reality/app/validation/ios:app-key-status-user-defaults",
        "//reality/engine/api:reality.capnp-cc",
        "//reality/engine/api/device:info.capnp-cc",
    ],
)

nia_objc_library(
    name = "xr-analytics-upload-session",
    srcs = [
        "xr-analytics-upload-session.mm",
    ],
    hdrs = [
        "xr-analytics-upload-session.h",
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
        "//c8:c8-log",
    ],
)
