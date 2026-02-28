load("//bzl/apple:objc.bzl", "nia_objc_library")

nia_objc_library(
    name = "omniscope-ios",
    srcs = [
        "omniscope-ios.mm",
    ],
    hdrs = [
        "omniscope-ios.h",
    ],
    copts = [
        "-DOS_OBJECT_HAVE_OBJC_SUPPORT=1",
    ],
    sdk_frameworks = [
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
        "//apps/client/internalqa/omniscope/native/pipeline:omniscope-pipeline",
        "//c8:c8-log",
        "//c8:exceptions",
        "//c8:symbol-visibility",
        "//c8/io:capnp-messages",
        "//c8/pixels:pixel-transforms",
        "//c8/pixels/opengl:gl-error",
        "//c8/pixels/opengl:gl-headers",
        "//c8/protolog:api-limits",
        "//c8/protolog:xr-extern",
        "//c8/protolog:xr-requests",
        "//c8/stats:scope-timer",
        "//reality/app/xr/ios:xr-ios-interface",
    ],
)
