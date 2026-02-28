load("//bzl/apple:objc.bzl", "nia_objc_library")

nia_objc_library(
    name = "apple-helpers",
    srcs = [
        "apple-helpers.mm",
    ],
    hdrs = [
        "apple-helpers.h",
    ],
    sdk_frameworks = [
        "Foundation",
    ] + select({
        "@niantic//bzl/conditions:ios": ["UIKit"],
        "@niantic//bzl/conditions:osx": ["AppKit"],
        "//conditions:default": [],
    }),
    target_compatible_with = select({
        "@niantic//bzl/conditions:apple": [],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    visibility = ["//c8/html-shell:__subpackages__"],
    deps = [
        "//c8:c8-log",
        "//c8:string",
    ],
)

cc_test(
    name = "apple-helpers-test",
    size = "small",
    srcs = [
        "apple-helpers-test.cc",
    ],
    target_compatible_with = select({
        "@niantic//bzl/conditions:apple": [],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    deps = [
        ":apple-helpers",
        "//c8:c8-log",
        "@com_google_googletest//:gtest_main",
    ],
)
