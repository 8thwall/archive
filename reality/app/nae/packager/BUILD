load("//bzl/html-shell/android:android-shell-runfiles.bzl", "android_shell_runfiles")
load("//bzl/html-shell/android:quest-shell-runfiles.bzl", "quest_shell_runfiles")
load("//bzl/html-shell/apple:ios-shell-runfiles.bzl", "ios_shell_runfiles")
load("//bzl/html-shell/apple:osx-shell-runfiles.bzl", "osx_shell_runfiles")
load("//bzl/js:js.bzl", "js_cli", "js_library", "js_test")

android_shell_runfiles(
    name = "android-shell-runfiles",
)

quest_shell_runfiles(
    name = "quest-shell-runfiles",
)

ios_shell_runfiles(
    name = "ios-shell-runfiles",
)

osx_shell_runfiles(
    name = "osx-shell-runfiles",
)

JAVA_TOOLCHAIN_COMPATIBLE = select({
    "//bzl/conditions:linux": [],
    "//bzl/conditions:osx": [],
    "//conditions:default": ["@platforms//:incompatible"],
})

js_cli(
    name = "packager",
    data = [
        ":android-shell-runfiles",
        ":ios-shell-runfiles",
        ":osx-shell-runfiles",
        ":quest-shell-runfiles",
        "//reality/app/nae/packager/android:android-html-packager-tools",
        "//reality/app/nae/packager/android:build-android-html-app",
        "//reality/app/nae/packager/apple:apple-html-packager-tools",
        "//reality/app/nae/packager/apple:build-apple-html-app",
        "@bazel_tools//tools/jdk:current_java_runtime",
    ],
    esnext = 1,
    main = [
        "html-app-packager.ts",
    ],
    npm_rule = "@npm-html-app-packager//:npm-html-app-packager",
    target = "node",
    target_compatible_with = JAVA_TOOLCHAIN_COMPATIBLE,
    visibility = ["//visibility:public"],
    deps = [
        "//c8/cli:args",
        "//c8/dom:dev-access",
        "//c8/dom/http-cache",
        "//reality/app/nae/packager:cookie-utils",
        "//reality/app/nae/packager:html-app-asset-handler",
        "//reality/app/nae/packager:html-app-asset-provider",
        "//reality/app/nae/packager:html-app-config",
        "//reality/app/nae/packager:html-app-packager-web-export",
        "//reality/shared:dynamodb",
        "//reality/shared:dynamodb-impl",
        "//reality/shared:s3",
        "//reality/shared:s3-impl",
        "//reality/shared/nae:nae-types",
        "//reality/shared/studio:fetch-studio-global-entry",
    ],
)

js_library(
    name = "html-app-config",
    srcs = [
        "html-app-config.ts",
    ],
    visibility = ["//visibility:public"],
    deps = [
        "//reality/shared/nae:nae-constants",
        "//reality/shared/nae:nae-types",
    ],
)

js_test(
    name = "html-app-config-test",
    size = "small",
    main = [
        "html-app-config-test.ts",
    ],
    deps = [
        "//bzl/js:chai-js",
        "//reality/app/nae/packager:html-app-config",
        "//reality/shared/nae:nae-types",
    ],
)

js_library(
    name = "html-app-asset-provider",
    srcs = [
        "html-app-asset-provider.ts",
    ],
    deps = [
        "//apps/client/public/web/app8/src/shared:resource-constants",
        "//c8/dom:dev-access",
        "//c8/dom:staging-access",
        "//c8/ecs/src/shared:asset-manifest",
        "//c8/ecs/src/shared:draco-constants",
        "//c8/ecs/src/shared:environment-maps",
        "//c8/ecs/src/shared:fonts",
        "//c8/ecs/src/shared:map-constants",
        "//c8/ecs/src/shared:splat-constants",
        "//c8/ecs/src/shared:sprite-constants",
        "//c8/html-shell:verify-cookie-domain",
        "//reality/app/nae/packager:cookie-utils",
        "//reality/app/nae/packager:html-app-asset-utils",
        "//reality/app/nae/packager:html-app-xrweb",
        "//reality/shared:dynamodb",
        "//reality/shared:dynamodb-impl",
        "//reality/shared:run-queue",
        "//reality/shared:s3",
        "//reality/shared:s3-impl",
        "//reality/shared/nae:nae-types",
        "//reality/shared/studio:fetch-asset-manifest",
        "//reality/shared/studio:fetch-studio-global-entry",
        "//reality/shared/studio:parse-script-srcs",
    ],
)

js_library(
    name = "cookie-utils",
    srcs = [
        "cookie-utils.ts",
    ],
    deps = [
        "//reality/shared/nae:nae-types",
    ],
)

js_test(
    name = "cookie-utils-test",
    size = "small",
    esnext = 1,
    main = [
        "cookie-utils-test.ts",
    ],
    target = "node",
    deps = [
        "//bzl/js:chai-js",
        "//reality/app/nae/packager:cookie-utils",
        "//reality/shared/nae:nae-types",
    ],
)

js_library(
    name = "html-app-xrweb",
    srcs = [
        "html-app-xrweb.ts",
    ],
)

js_test(
    name = "html-app-xrweb-test",
    size = "small",
    esnext = 1,
    main = [
        "html-app-xrweb-test.ts",
    ],
    target = "node",
    deps = [
        "//bzl/js:chai-js",
        "//reality/app/nae/packager:html-app-xrweb",
    ],
)

js_library(
    name = "html-app-asset-handler",
    srcs = [
        "html-app-asset-handler.ts",
    ],
    deps = [
        "//c8/ecs/src/shared:asset-manifest",
        "//reality/app/nae/packager:html-app-asset-provider",
        "//reality/app/nae/packager:html-app-asset-utils",
        "//reality/shared/nae:nae-types",
    ],
)

js_test(
    name = "html-app-asset-handler-test",
    size = "small",
    esnext = 1,
    main = [
        "html-app-asset-handler-test.ts",
    ],
    npm_rule = "@npm-html-app-packager//:npm-html-app-packager",
    target = "node",
    deps = [
        "//bzl/js:chai-js",
        "//reality/app/nae/packager:html-app-asset-handler",
        "//reality/shared/nae:nae-types",
    ],
)

js_library(
    name = "html-app-packager-web-export",
    srcs = [
        "html-app-packager-web-export.ts",
    ],
    deps = [
        "//c8/cli:proc",
    ],
)

js_library(
    name = "html-app-asset-utils",
    srcs = [
        "html-app-asset-utils.ts",
    ],
    deps = [
        "//c8/ecs/src/shared:msdf-font-type",
        "//reality/shared/nae:nae-types",
    ],
)

js_test(
    name = "html-app-asset-utils-test",
    size = "small",
    esnext = 1,
    main = [
        "html-app-asset-utils-test.ts",
    ],
    npm_rule = "@npm-html-app-packager//:npm-html-app-packager",
    target = "node",
    deps = [
        "//bzl/js:chai-js",
        "//c8/ecs/src/shared:msdf-font-type",
        "//reality/app/nae/packager:html-app-asset-utils",
        "//reality/shared/nae:nae-types",
    ],
)
