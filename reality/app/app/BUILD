load("//bzl/apple:objc.bzl", "nia_objc_library")

package(
    default_visibility = [
        # TODO(nbutko): remove visibility public; this requires unity_project
        # rules to pull in android_srs transitively based on their deps.
        "//visibility:public",
    ],
)

android_library(
    name = "android-app",
    srcs = ["AndroidApp.java"],
    deps = [
        "//reality/engine/api/request:app.capnp-java",
    ],
)

nia_objc_library(
    name = "ios-app",
    srcs = ["ios-app.mm"],
    hdrs = [
        "ios-app.h",
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
        "//reality/engine/api/request:app.capnp-cc",
    ],
)
