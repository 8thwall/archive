load("//bzl/unity:unity.bzl", "unity_plugin")
load("@niantic//bzl/windows:select.bzl", "onWindows")
load("//bzl/apple:objc.bzl", "nia_objc_library")

cc_library(
    name = "streaming-record-callback",
    hdrs = [
        "streaming-record-callback.h",
    ],
    deps = [
        "//c8/protolog/api:remote-request.capnp-cc",
    ],
)

nia_objc_library(
    name = "osx-native-metal-texture",
    srcs = [
        "inmemory-texture-buffers.h",
        "osx-native-metal-texture.mm",
        "texture-copier.h",
    ],
    hdrs = [
        "osx-native-metal-texture.h",
    ],
)

# Don't forget to use "//bzl/unity:plugin-api" for your dep
filegroup(
    name = "xr-streaming-unity-render",
    srcs = [
        "xr-streaming-unity-render.cc",
    ],
)

# The client runs on phones and stream IMUs to the server
# We don't need to worry about Windows build for xr-streaming-client
cc_library(
    name = "xr-streaming-client",
    srcs = [
        ":xr-streaming-unity-render",
    ],
    deps = [
        "//c8/io:capnp-messages",
        "//c8/pixels",
        "//c8/protolog:remote-service-connection",
        "//c8/protolog:xr-extern",
        "//c8/protolog:xr-requests",
        "//c8/stats:scope-timer",
        "//c8/stats:self-timing-scope-lock",
        "//reality/engine/api:reality.capnp-cc",
        "//reality/engine/executor:xr-engine",
    ],
)

unity_plugin(
    name = "xr-streaming-client-plugin",
    build_all_target_platforms = select({
        # Build one platform with: --//reality:unity-target=one --platforms=//bzl:android_arm64
        "//reality:unity-target-one": False,
        # Build all platforms with: --//reality:unity-target=all
        "//reality:unity-target-all": True,
    }),
    project = "XRStreamingClient",
    target_platforms = [
        "//bzl:osx_x86_64",
        "//bzl:osx_arm64",
        "//bzl:android_arm64",
        "//bzl:android_armv7a",
        "//bzl:ios_arm64",
        "//bzl:windows_x86_64",
    ],
    visibility = [
        "//visibility:public",
    ],
    deps = [
        ":xr-streaming-client",
    ],
)

cc_library(
    name = "xr-streaming",
    srcs = [
        "xr-streaming.cc",
        "inmemory-texture-buffers.cc",
        "inmemory-texture-buffers.h",
    ] + select({
        "//bzl/conditions:windows": [
            "win-native-directx-texture.h",
            "win-native-directx-texture.cc",
        ],
        "//bzl/conditions:osx": [
            "osx-native-opengl-texture.h",
            "osx-native-opengl-texture.cc",
        ],
        "//conditions:default": [],
    }),
    hdrs = [
        "xr-streaming.h",
        "xr-streaming-decl.h",
    ],
    copts = [
        "-Wno-deprecated-declarations",
    ],
    target_compatible_with = select({
        "@niantic//bzl/conditions:osx": [],
        "@niantic//bzl/conditions:windows": [],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    visibility = [
        "//visibility:public",
    ],
    deps = [
        ":remote-service-thread",
        "//c8:release-config",
        "//c8:vector",
        "//c8/io:capnp-messages",
        "//c8/io:kj-event-loop",
        "//c8/pixels",
        "//c8/protolog:xr-extern",
        "//c8/protolog:xr-requests",
        "//c8/protolog/api:remote-service.capnp-cc",
        "//c8/stats:scope-timer",
        "//c8/stats:self-timing-scope-lock",
        "//reality/engine/api:reality.capnp-cc",
        "//reality/engine/executor:xr-engine",
    ] + select({
        "//bzl/conditions:windows": [
            "//bzl/unity:plugin-api",
        ],
        "//bzl/conditions:osx": [
            ":osx-native-metal-texture",
        ],
        "//conditions:default": [],
    }),
)

cc_binary(
    name = "libxr-streaming-plugin-for-host.so",
    linkshared = 1,
    linkstatic = 1,
    deps = ["//reality/app/xr/streaming:xr-streaming"],
)

genrule(
    name = "xr-streaming-plugin-for-host",
    srcs = [],
    outs = ["XRStreamingPlugin.bundle"],
    cmd = "cp $(location :libxr-streaming-plugin-for-host.so) $(@)",
    tools = [":libxr-streaming-plugin-for-host.so"],
)

unity_plugin(
    name = "xr-streaming-plugin",
    build_all_target_platforms = select({
        # Build one platform with: -//reality:unity-target=one --platforms=//bzl:android_arm64
        "//reality:unity-target-one": False,
        # Build all platforms with: -//reality:unity-target=all
        "//reality:unity-target-all": True,
    }),
    # Build a host (Mac) version too, when building for windows.
    plugin_srcs = onWindows([":xr-streaming-plugin-for-host"]),
    project = "XRStreaming",
    target_platforms = [
        "//bzl:osx_x86_64",
        "//bzl:osx_arm64",
        "//bzl:windows_x86_64",
    ],
    visibility = [
        "//visibility:public",
    ],
    deps = [
        # NOTE(dat): Only the first library that has DllMain entry point will have their symbols available
        # TODO(dat): Figure out how to tell clang Windows-crosstool to always export all symbols
        #            There are two ways to do this: Upgrade Bazel to get win_def_file option in cc_binary
        #                                           Generate a def file from our code
        #                                       Or: Find the clang short-cut
        # Manual invoking of clang produces the correct exported symbols
        # external/msvctoolchain/llvm/bin/clang -fuse-ld=lld -target x86_64-pc-win32 -shared -o /tmp/foo2.dll bazel-out/win_x86_64-opt/bin/c8/windows/_objs/hello.dll/c8/windows/dll-lib2.o bazel-out/win_x86_64-opt/bin/c8/windows/_objs/hello.dll/c8/windows/dll-main.o -Lexternal/code8-cc/cc/msvctoolchain/x86_64/lib/msvc -Lexternal/code8-cc/cc/msvctoolchain/x86_64/lib/ucrt -Lexternal/code8-cc/cc/msvctoolchain/x86_64/lib/um
        #
        "//reality/app/xr/streaming:xr-streaming",
    ],
)

cc_binary(
    name = "example-main",
    srcs = [
        "example-main.cc",
    ],
    target_compatible_with = select({
        "//bzl/conditions:osx": [],
        "//bzl/conditions:windows": [],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    visibility = [
        "//visibility:private",
    ],
    deps = [
        ":xr-streaming",
        "//c8:c8-log",
        "//c8:c8-log-proto",
        "//c8/io:capnp-messages",
    ],
)

# START_AUTOGENERATED_RULES
# Do not edit these rules manually, use inliner.
cc_library(
    name = "remote-service-impl",
    srcs = [
        "remote-service-impl.cc",
    ],
    hdrs = [
        "remote-service-impl.h",
    ],
    visibility = [
        "//visibility:private",
    ],
    deps = [
        ":streaming-record-callback",
        "//bzl/inliner:rules",
        "//c8:c8-log",
        "//c8:c8-log-proto",
        "//c8/io:capnp-messages",
        "//c8/protolog/api:remote-service.capnp-cc",
    ],
)

cc_library(
    name = "remote-service-thread",
    srcs = [
        "remote-service-thread.cc",
    ],
    hdrs = [
        "remote-service-thread.h",
    ],
    visibility = [
        "//visibility:public",
    ],
    deps = [
        ":remote-service-impl",
        ":single-client-server",
        ":streaming-record-callback",
        "//bzl/inliner:rules",
        "//c8:c8-log",
        "//c8:exceptions",
        "//c8/events:lev-event-listener",
        "//c8/network:dns-service-discovery",
        "@capnproto//:capnp-lib",
        "@capnproto//:kj",
    ],
)

# file: remote-service-thread-test.cc
cc_test(
    name = "remote-service-thread-test",
    size = "small",
    srcs = [
        "remote-service-thread-test.cc",
    ],
    visibility = [
        "//visibility:private",
    ],
    deps = [
        ":remote-service-thread",
        "//bzl/inliner:rules2",
        "//c8/protolog/api:remote-service.capnp-cc",
        "@com_google_googletest//:gtest_main",
    ],
)
# cc_end(0xc5531d4c)

cc_library(
    name = "single-client-server",
    srcs = [
        "single-client-server.cc",
    ],
    hdrs = [
        "single-client-server.h",
    ],
    visibility = [
        "//visibility:public",
    ],
    deps = [
        "//bzl/inliner:rules",
        "//c8:c8-log",
        "@capnproto//:capnp-lib",
        "@capnproto//:kj",
    ],
)
# END_AUTOGENERATED_RULES
