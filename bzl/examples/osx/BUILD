load("//bzl/apple:nia-apple-native-binary.bzl", "nia_apple_native_binary")

# Build and run with:
# - bazel build //bzl/examples/osx:hello-osx && open bazel-out/darwin_arm64-fastbuild/bin/bzl/examples/osx/HelloOSX.app
nia_apple_native_binary(
    name = "hello-osx",
    display_name = "HelloOSX",
    platform = "osx",
    srcs = ["hello-osx.mm"],
    deps = [],
    sdk_frameworks = [
        "Cocoa",
    ],
    info_plist = "Info.plist",
    entitlements = "HelloOSX.xcent",
    target_compatible_with = select({
        "@apple-developer-team//:niantic-and-personal-certificate": [
            "@platforms//os:macos",
        ],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    visibility = ["//visibility:public"],
)
