load("//bzl/apple:objc.bzl", "nia_objc_library")

nia_objc_library(
    name = "egl-display-layer-ios",
    srcs = [
        "egl-display-layer-ios.mm",
    ],
    hdrs = [
        "egl-display-layer-ios.h",
    ],
    copts = [
        "-DOS_OBJECT_HAVE_OBJC_SUPPORT=1",
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
        "//c8:exceptions",
        "//c8:symbol-visibility",
        "//c8/pixels/opengl:gl-headers",
        "//c8/protolog:xr-extern",
    ],
)
