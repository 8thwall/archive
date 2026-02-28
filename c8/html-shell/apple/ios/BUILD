load("//bzl/apple:nia-apple-native-binary.bzl", "nia_apple_native_binary")
load("//bzl/apple:nia-apple-native-shell.bzl", "nia_apple_native_shell")
load("//bzl/apple:objc.bzl", "nia_objc_library")

config_setting(
    name = "ios14.0-wildcard-and-personal-certificate",
    flag_values = {
        "//bzl/xcode:ios-min-version": "14.0",
        "@apple-developer-team//:wildcard-development-flag": "True",
        "@apple-developer-team//:personal-certificate-flag": "True",
    },
)

nia_apple_native_shell(
    name = "html-shell-ios",
    srcs = [
        "ios-shell-main.mm",
    ],
    assets = [
        "//c8/html-shell:app",
        "//c8/dom:web-assembly-override",
    ],
    display_name = "html-shell-ios",
    platform = "ios",
    sdk_frameworks = [
        "Foundation",
        "UIKit",
        "CoreFoundation",
        "CoreAudio",
        "AudioToolbox",
        "AVFAudio",
    ],
    target_compatible_with = select({
        "@niantic//bzl/conditions:ios": [],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    visibility = ["//visibility:public"],
    deps = [
        ":app-delegate",
        "//c8:c8-log",
        "//c8:string",
        "//c8:vector",
        "//c8/string:join",
        "//c8/html-shell:node-binding",
        # NOTE(paris): We use the static node library because the dynamic library ("@node//:node-shared") does not yet work.
        "@node//:node-lib",
    ],
)

# NOTE(paris): This is just a test app. We may want to remove eventually, but leave for now, as it's
# useful for testing.
nia_apple_native_binary(
    name = "html-shell-ios-binary",
    srcs = [
        "ios-shell-main.mm",
    ],
    assets = [
        "//c8/html-shell:app",
        "//c8/dom:web-assembly-override",
    ],
    display_name = "HTMLShellIOS",
    entitlements = "Entitlements.plist",
    info_plist = "Info.plist",
    platform = "ios",
    provisioning_profile = "@apple-developer-team//:wildcard-development",
    sdk_frameworks = [
        "Foundation",
        "UIKit",
        "CoreFoundation",
        "CoreAudio",
        "AudioToolbox",
        "AVFAudio",
    ],
    target_compatible_with = select({
        ":ios14.0-wildcard-and-personal-certificate": [
            "@platforms//os:ios",
        ],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    visibility = ["//visibility:public"],
    deps = [
        ":app-delegate",
        "//c8:c8-log",
        "//c8:string",
        "//c8:vector",
        "//c8/string:join",
        "//c8/html-shell:node-binding",
        # NOTE(paris): We use the static node library because the dynamic library ("@node//:node-shared") does not yet work.
        "@node//:node-lib",
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
        "UIKit",
    ],
    target_compatible_with = select({
        "@niantic//bzl/conditions:ios": [],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    deps = [
        "//c8:c8-log",
        "//c8:map",
        "//c8/html-shell:input-event-data",
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
        "UIKit",
    ],
    target_compatible_with = select({
        "@niantic//bzl/conditions:ios": [],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    deps = [
        ":input-event-data-converter",
        ":shell-app-state",
        "//c8:map",
        "//c8/html-shell:input-event-data",
    ],
)

nia_objc_library(
    name = "view-controller",
    srcs = [
        "view-controller.mm",
    ],
    hdrs = [
        "view-controller.h",
    ],
    sdk_frameworks = [
        "UIKit",
    ],
    target_compatible_with = select({
        "@niantic//bzl/conditions:ios": [],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    deps = [
        ":shell-view",
        "//c8:c8-log",
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
        "UIKit",
    ],
    target_compatible_with = select({
        "@niantic//bzl/conditions:ios": [],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    deps = [
        ":shell-app-state",
        ":view-controller",
        "//c8:c8-log",
        "//c8:string",
        "//c8:vector",
        "//c8/html-shell:html-shell-helpers",
        "//c8/html-shell:node-binding",
        "//c8/html-shell/apple:apple-helpers",
        "//c8/io:file-io",
        "@node//:node-lib",
    ],
)

nia_objc_library(
    name = "haptics-manager",
    srcs = [
        "haptics-manager.mm",
    ],
    hdrs = [
        "haptics-manager.h",
    ],
    sdk_frameworks = [
        "UIKit",
    ],
    target_compatible_with = select({
        "@niantic//bzl/conditions:ios": [],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    deps = [
        "//c8:c8-log",
        "//c8:vector",
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
        "@niantic//bzl/conditions:ios": [],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    deps = [
        "//c8/html-shell:shell-app-state-base",
        "//c8/html-shell/apple/ios:haptics-manager",
        "//c8/html-shell/apple/ios:sensor-manager",
    ],
)

nia_objc_library(
    name = "sensor-manager",
    srcs = [
        "sensor-manager.mm",
    ],
    hdrs = [
        "sensor-manager.h",
    ],
    sdk_frameworks = [
        "UIKit",
    ],
    target_compatible_with = select({
        "@niantic//bzl/conditions:ios": [],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    visibility = ["//c8/html-shell/apple:__subpackages__"],
    deps = [
        ":sensor-event-data-converter",
        "//c8:c8-log",
        "//c8:set",
        "//c8:string",
        "//c8/html-shell:dom-events",
    ],
)

nia_objc_library(
    name = "sensor-event-data-converter",
    srcs = [
        "sensor-event-data-converter.mm",
    ],
    hdrs = [
        "sensor-event-data-converter.h",
    ],
    sdk_frameworks = [
        "UIKit",
    ],
    target_compatible_with = [
        "@platforms//os:ios",
    ],
    visibility = ["//c8/html-shell/apple:__subpackages__"],
    deps = [
        "//c8:quaternion",
        "//c8/html-shell:sensor-event-data",
        "//c8/html-shell:sensor-event-data-conversion",
    ],
)
