load("//bzl/apple:objc.bzl", "nia_objc_library")

filegroup(
    name = "imgs",
    srcs = [
        "eight-logo.png",
    ],
)

nia_objc_library(
    name = "imgui-app",
    srcs = [
        "imgui-app.mm",
    ],
    hdrs = [
        "imgui-app.h",
    ],
    data = [
        ":imgs",
    ],
    sdk_frameworks = [
        "Cocoa",
        "OpenGL",
    ],
    target_compatible_with = select({
        "@niantic//bzl/conditions:osx": [],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    visibility = [
        "//visibility:public",
    ],
    deps = [
        "//c8/string:format",
        "//third_party/imgui/icons:imgui-fontawesome",
        "@imgui",
        "@imnodes",
        "@implot",
    ],
)
