load("//bzl/android:android-node-binary.bzl", "android_node_aar")
load("//bzl/js:js.bzl", "js_binary")
load("//bzl/js:reset-target.bzl", "reset_js_target")

android_node_aar(
    name = "html-shell-quest",
    assets = [
        ":app",
    ],
    manifest = "AndroidManifest.xml",
    proguard_includes = ":quest-html-shell-proguard-specs",
    visibility = ["//visibility:public"],
    deps = [
        ":quest-shell-main-cc",
        "//bzl/android:native-app-glue",
        "@node//:node-shared",
    ],
)

filegroup(
    name = "quest-html-shell-proguard-specs",
    srcs = [
        "quest-html-shell.pro",
    ],
)

reset_js_target(
    name = "fallback-scene",
    deps = ["//c8/html-shell/android/quest/fallback-scene:dist"],
)

js_binary(
    name = "app",
    data = [
        ":fallback-scene",
    ],
    esnext = 1,
    main = [
        "app.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    target_compatible_with = [
        "@platforms//os:android",
    ],
    deps = [
        "//c8/dom",
        "//c8/dom:dev-access",
        "//c8/dom:staging-access",
        "//c8/xrapi:xrapi-bindings",
    ],
)

cc_library(
    name = "node-binding",
    srcs = [
        "node-binding.cc",
    ],
    hdrs = [
        "node-binding.h",
    ],
    defines = select({
        "//bzl/conditions:config_setting_opt": ["NAE_OPT"],
        "//conditions:default": [],
    }),
    target_compatible_with = select({
        "//bzl/node:source-built-true": ["@platforms//os:android"],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    deps = [
        "//bzl/android:native-app-glue",
        "//bzl/node:node-addons-extra",
        "//c8:c8-log",
        "//c8:string",
        "//c8:vector",
        "//c8/html-shell:event-dispatcher",
        "//c8/html-shell:input-event-data",
        "//c8/html-shell:node-binding-state",
        "//c8/html-shell/android:input-event-data-converter",
        "//c8/html-shell/android/quest/webtask:quest-webtask",
        "//c8/xrapi:xrapi-addon",
        "//third_party/headless-gl:headless-gl-bindings",
        "@miniaudio-addon//:miniaudio-addon-bindings",
    ],
)

cc_library(
    name = "quest-shell-main-cc",
    srcs = [
        "quest-shell-main.cc",
    ],
    defines = select({
        "//c8/html-shell:nae-inspector-enabled": ["NAE_INSPECTOR_ENABLED"],
        "//conditions:default": [],
    }) + select({
        "//bzl/conditions:config_setting_opt": ["NAE_OPT"],
        "//conditions:default": [],
    }),
    target_compatible_with = [
        "@platforms//os:android",
    ],
    deps = [
        ":node-binding",
        ":shell-app-state",
        "//bzl/android:native-app-glue",
        "//c8:c8-log",
        "//c8:string",
        "//c8:vector",
        "//c8/html-shell/android:shell-activity-intent",
        "//c8/html-shell/android:shell-app-manifest",
        "//c8/string:join",
        "@oculus-platform-sdk//:ovr_platform_sdk_android",
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
    target_compatible_with = [
        "@platforms//os:android",
    ],
    deps = [
        "//c8/html-shell:shell-app-state-base",
    ],
)
