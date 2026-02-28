load("//bzl/js:js.bzl", "js_binary", "js_cli", "js_library", "js_test")
load("//bzl/node:node-package.bzl", "node_package")
load("//bzl/tar:untar.bzl", "untar")

filegroup(
    name = "android-resource-files",
    srcs = glob(["android-default-resources/**"]),
)

filegroup(
    name = "ios-resource-files",
    srcs = glob(["ios-default-resources/**"]),
)

node_package(
    name = "nae-builder-archive",
    # TODO(lreyna): Fix node_package, so transitive deps are included in the archive, and data deps
    # can be used in this target directly (same change needed for docker_image).
    data = [
        ":android-resource-files",
        ":ios-resource-files",
        "//reality/app/nae/packager",
    ],
    main = [
        "//reality/app/nae:build",
    ],
)

js_binary(
    name = "build",
    esnext = 1,
    main = [
        "build.ts",
    ],
    npm_rule = "@npm-ecr//:npm-ecr",
    target = "node",
    deps = [
        "//c8/cli:args",
        "//c8/cli:proc",
        "//c8/dom:mime-type-image",
        "//reality/app/nae:app-signing",
        "//reality/app/nae:apple-app-signing",
        "//reality/app/nae:dev-cookie",
        "//reality/app/nae/packager:html-app-config",
        "//reality/cloud/aws/lambda/studio-deploy:messaging",
        "//reality/shared:dynamodb",
        "//reality/shared:dynamodb-impl",
        "//reality/shared:s3",
        "//reality/shared:s3-impl",
        "//reality/shared/nae:historical-builds",
        "//reality/shared/nae:nae-constants",
        "//reality/shared/nae:nae-types",
        "//reality/shared/nae:nae-utils",
        "//reality/shared/studio:fetch-studio-global-entry",
    ],
)

js_library(
    name = "dev-cookie",
    srcs = [
        "dev-cookie.ts",
    ],
    deps = [
        "//reality/cloud/aws/lambda/shared:secret-scopes",
        "//reality/shared/nae:nae-types",
    ],
)

js_library(
    name = "app-signing",
    srcs = [
        "app-signing.ts",
    ],
    deps = [
        "//c8/android:keytool",
        "//reality/shared:dynamodb",
        "//reality/shared:typed-attributes",
        "//reality/shared/nae:nae-types",
    ],
)

js_test(
    name = "nae-utils-test",
    size = "small",
    esnext = 1,
    main = [
        "nae-utils-test.ts",
    ],
    npm_rule = "@npm-ecr//:npm-ecr",
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//reality/shared/nae:nae-types",
        "//reality/shared/nae:nae-utils",
    ],
)

js_test(
    name = "historical-builds-test",
    size = "small",
    esnext = 1,
    main = [
        "historical-builds-test.ts",
    ],
    npm_rule = "@npm-ecr//:npm-ecr",
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//reality/shared/nae:nae-utils",
    ],
)

js_library(
    name = "apple-app-signing",
    srcs = [
        "apple-app-signing.ts",
    ],
    deps = [
        "//reality/cloud/aws/lambda/shared:secret-scopes",
        "//reality/shared:dynamodb",
        "//reality/shared:s3",
        "//reality/shared:typed-attributes",
        "//reality/shared/nae:nae-types",
    ],
)

untar(
    name = "nae-builder-archive-untar",
    src = ":nae-builder-archive",
)

js_cli(
    name = "run-build-locally",
    data = [
        "//reality/app/nae:nae-builder-archive-untar",
        "//reality/app/nae/nae-build-request-data",
    ],
    esnext = 1,
    main = [
        "run-build-locally.ts",
    ],
    npm_rule = "@npm-ecr//:npm-ecr",
    target = "node",
    deps = [
        "//c8/cli:args",
        "//c8/cli:proc",
    ],
)
