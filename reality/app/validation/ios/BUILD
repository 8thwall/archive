load("//bzl/apple:objc.bzl", "nia_objc_library")

package(default_visibility = ["//visibility:public"])

nia_objc_library(
    name = "app-key-status-user-defaults",
    srcs = [
        "app-key-status-user-defaults.mm",
    ],
    hdrs = [
        "app-key-status-user-defaults.h",
    ],
    sdk_frameworks = [
        "AVFoundation",
    ],
    visibility = [
        "//visibility:public",
    ],
    deps = [
        "//c8:c8-log",
        "//c8/protolog/api:log-request.capnp-cc",
    ],
)

nia_objc_library(
    name = "local-app-key-validator",
    srcs = [
        "local-app-key-validator.mm",
    ],
    hdrs = [
        "local-app-key-validator.h",
    ],
    sdk_frameworks = [
        "AVFoundation",
    ],
    deps = [
        ":app-key-status-user-defaults",
        "//c8:c8-log",
        "//c8:vector",
        "//c8/io:base-x-encoding",
        "//c8/protolog/api:log-request.capnp-cc",
    ],
)

nia_objc_library(
    name = "xr-validation",
    srcs = [
        "xr-validation-controller.mm",
    ],
    hdrs = [
        "xr-validation-controller.h",
    ],
    sdk_frameworks = [
        "AVFoundation",
    ],
    visibility = [
        "//visibility:public",
    ],
    deps = [
        ":app-key-status-user-defaults",
        ":local-app-key-validator",
        "//c8:c8-log",
        "//c8/protolog/api:log-request.capnp-cc",
    ],
)
