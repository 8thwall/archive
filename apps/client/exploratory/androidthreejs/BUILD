load("//bzl/android:android-node-binary.bzl", "android_node_binary")
load("//bzl/js:js.bzl", "js_binary")

package(default_visibility = ["//visibility:public"])

android_node_binary(
    name = "android-threejs",
    srcs = glob([
        "*.java",
    ]),
    assets = [
        ":app",
    ],
    custom_package = "com.nianticlabs.apps.client.exploratory.androidthreejs",
    java_deps = [
        "@androidsdk//com.android.support:appcompat-v7-25.0.1",
    ],
    manifest = "AndroidManifest.xml",
    resource_files = glob(["res/**"]),
    target_compatible_with = [
        "@platforms//os:android",
    ],
    deps = [
        ":native-window-jni",
        ":node-binding-jni",
        "@node//:node-shared",
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
    target_compatible_with = select({
        "//bzl/node:source-built-true": ["@platforms//os:android"],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    deps = [
        "//bzl/node:node-addons-extra",
        "//c8:c8-log",
        "//c8:string",
        "//c8:vector",
    ],
)

cc_library(
    name = "node-binding-jni",
    srcs = [
        "node-binding-jni.cc",
    ],
    target_compatible_with = [
        "@platforms//os:android",
    ],
    deps = [
        ":node-binding",
    ],
    # Add alwayslink to ensure that the Android .so dynamic library includes
    # all of the symbols in this cc_library.
    alwayslink = 1,
)

cc_library(
    name = "native-window-jni",
    srcs = [
        "native-window-jni.cc",
    ],
    linkopts = [
        "-ljnigraphics",
        "-landroid",
        "-llog",
    ],
    target_compatible_with = [
        "@platforms//os:android",
    ],
    # Add alwayslink to ensure that the Android .so dynamic library includes
    # all of the symbols in this cc_library.
    alwayslink = 1,
)

js_binary(
    name = "app",
    data = [
        "mona-lisa-da-vinci.jpg",
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
    ],
)
