load("//bzl/apple:nia-apple-native-binary.bzl", "nia_apple_native_binary")
load("//bzl/apple:nia-apple-native-shell.bzl", "nia_apple_native_shell")
load("//bzl/apple:objc.bzl", "nia_objc_library")

config_setting(
    name = "osx14.0-wildcard-and-personal-certificate",
    flag_values = {
        "//bzl/xcode:osx-min-version": "14.0",
        "@apple-developer-team//:wildcard-development-flag": "True",
        "@apple-developer-team//:personal-certificate-flag": "True",
    },
)

nia_apple_native_shell(
    name = "html-shell-osx",
    srcs = ["osx-shell-main.mm"],
    assets = [
        "//c8/html-shell:app",
    ],
    display_name = "html-shell-osx",
    platform = "osx",
    sdk_frameworks = [
        "Cocoa",
    ],
    target_compatible_with = select({
        "@niantic//bzl/conditions:osx": [],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    visibility = ["//visibility:public"],
    deps = [
        ":app-delegate",
        "//c8/html-shell/apple:apple-helpers",
        "//c8/html-shell:html-shell-helpers",
        ":shell-app-state",
        ":shell-view",
        "//c8:c8-log",
        "//c8:string",
        # NOTE(paris): We use the static node library because the dynamic library ("@node//:node-shared") does not yet work.
        "@node//:node-lib",
    ],
)

# NOTE(paris): This is just a test app. We may want to remove eventually, but leave for now, as it's
# useful for testing.
nia_apple_native_binary(
    name = "html-shell-osx-binary",
    srcs = ["osx-shell-main.mm"],
    assets = [
        "//c8/html-shell:app",
    ],
    display_name = "HTMLShellOSX",
    entitlements = "Entitlements.plist",
    info_plist = "Info.plist",
    platform = "osx",
    sdk_frameworks = [
        "Cocoa",
    ],
    target_compatible_with = select({
        ":osx14.0-wildcard-and-personal-certificate": [
            "@platforms//os:macos",
        ],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    visibility = ["//visibility:public"],
    deps = [
        ":app-delegate",
        "//c8/html-shell/apple:apple-helpers",
        ":shell-app-state",
        ":shell-view",
        "//c8:c8-log",
        "//c8:string",
        # NOTE(paris): We use the static node library because the dynamic library ("@node//:node-shared") does not yet work.
        "@node//:node-lib",
    ],
)

nia_objc_library(
    name = "app-delegate",
    srcs = [
        "app-delegate.mm",
    ],
    hdrs = [
        "app-delegate.h",
    ],
    defines = select({
        "//c8/html-shell:nae-inspector-enabled": ["NAE_INSPECTOR_ENABLED"],
        "//conditions:default": [],
    }),
    sdk_frameworks = [
        "AppKit",
    ],
    target_compatible_with = select({
        "@niantic//bzl/conditions:osx": [],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    deps = [
        ":shell-app-state",
        "//c8:c8-log",
        "//c8:string",
        "//c8:vector",
        "//c8/html-shell:node-binding",
        "//c8/io:file-io",
    ],
)

nia_objc_library(
    name = "input-event-data-converter",
    srcs = [
        "input-event-data-converter.mm",
    ],
    hdrs = [
        "input-event-data-converter.h",
    ],
    sdk_frameworks = [
        "AppKit",
    ],
    target_compatible_with = select({
        "@niantic//bzl/conditions:osx": [],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    deps = [
        "//c8:c8-log",
        "//c8/html-shell:input-event-data",
    ],
)

cc_test(
    name = "input-event-data-converter-test",
    size = "small",
    srcs = [
        "input-event-data-converter-test.cc",
    ],
    copts = ["-x objective-c++"],
    target_compatible_with = select({
        "@niantic//bzl/conditions:osx": [],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    deps = [
        ":input-event-data-converter",
        "//c8/html-shell:input-event-data",
        "@com_google_googletest//:gtest_main",
    ],
)

cc_library(
    name = "shell-app-state",
    srcs = [
        "shell-app-state.cc",
    ],
    hdrs = [
        "shell-app-state.h",
    ],
    copts = ["-x objective-c++"],
    target_compatible_with = select({
        "@niantic//bzl/conditions:osx": [],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    deps = [
        "//c8/html-shell:shell-app-state-base",
    ],
)

nia_objc_library(
    name = "shell-view",
    srcs = [
        "shell-view.mm",
    ],
    hdrs = [
        "shell-view.h",
    ],
    sdk_frameworks = [
        "AppKit",
    ],
    target_compatible_with = select({
        "@niantic//bzl/conditions:osx": [],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    deps = [
        ":input-event-data-converter",
        ":shell-app-state",
        "//c8/html-shell:input-event-data",
    ],
)
