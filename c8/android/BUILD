load("//bzl/js:js.bzl", "js_library", "js_test")

package(default_visibility = ["//visibility:public"])

android_library(
    name = "render-loop-view-controller",
    srcs = [
        "RenderLoopViewController.java",
    ],
    visibility = ["//visibility:public"],
    deps = [
        ":egl-display-texture",
    ],
)

android_library(
    name = "egl-display-texture",
    srcs = [
        "EglDisplayTexture.java",
    ],
)

JAVA_TOOLCHAIN_COMPATIBLE = select({
    "//bzl/conditions:linux": [],
    "//bzl/conditions:osx": [],
    "//conditions:default": ["@platforms//:incompatible"],
})

js_library(
    name = "keytool",
    srcs = [
        "keytool.ts",
    ],
    data = [
        "@bazel_tools//tools/jdk:current_java_runtime",
    ],
    target_compatible_with = JAVA_TOOLCHAIN_COMPATIBLE,
    deps = [
        "//c8/cli:proc",
    ],
)

js_test(
    name = "keytool-test",
    size = "small",
    esnext = 1,
    main = [
        "keytool-test.ts",
    ],
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//c8/android:keytool",
    ],
)
