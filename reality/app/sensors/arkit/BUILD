load("//bzl/apple:objc.bzl", "nia_objc_library")

nia_objc_library(
    name = "ios-arkit-sensor",
    srcs = ["ios-arkit-sensor.mm"],
    hdrs = [
        "ios-arkit-image-callback.h",
        "ios-arkit-sensor.h",
    ],
    copts = [
        "-Wno-unguarded-availability-new",
        "-DOS_OBJECT_HAVE_OBJC_SUPPORT=1",
    ],
    sdk_frameworks = [
        "ARKit",
        "CoreVideo",
    ],
    visibility = [
        "//reality/app/xr:__subpackages__",
    ],
    deps = [
        "//c8:c8-log",
        "//c8:release-config",
        "//c8/geometry:pixel-pinhole-camera-model",
        "//c8/io:capnp-messages",
        "//c8/pixels:pixel-transforms",
        "//c8/protolog:api-limits",
        "//c8/protolog:xr-extern",
        "//c8/protolog:xr-requests",
        "//reality/app/sensors/gps:core-location-controller",
        "//reality/app/xr/ios:c8-helpers",
        "//reality/engine/api:reality.capnp-cc",
        "//reality/engine/api/base:camera-intrinsics.capnp-cc",
        "//reality/engine/api/request:hit-test.capnp-cc",
        "//reality/engine/api/request:sensor.capnp-cc",
    ],
)
