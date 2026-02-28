load("//bzl/xcode:xcode.bzl", "xcode_app", "xcode_project")

xcode_project(
    name = "omniscope-ios",
    project = "Omniscope",
    target_compatible_with = select({
        "@niantic//bzl/conditions:ios": [],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    deps = [
        "//apps/client/internalqa/omniscope/ios/bridge:omniscope-ios",
        "//c8/ios:egl-display-layer-ios",
        "//reality/app/xr/ios:xr-ios",
    ],
)

xcode_app(
    name = "omniscope",
    project = ":omniscope-ios",
)
