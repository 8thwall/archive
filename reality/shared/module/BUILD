load("//bzl/js:js.bzl", "js_library", "js_test")

package(default_visibility = ["//reality/cloud:shared"])

js_library(
    name = "compare-module-config-value",
    srcs = [
        "compare-module-config-value.ts",
    ],
    deps = [
        "//reality/shared/module:module-dependency",
    ],
)

js_library(
    name = "compare-module-target",
    srcs = [
        "compare-module-target.ts",
    ],
    deps = [
        "//reality/shared/module:module-target",
        "//reality/shared/module:module-target-api",
    ],
)

js_library(
    name = "dependency-html-data",
    srcs = [
        "dependency-html-data.ts",
    ],
)

js_library(
    name = "dependency-scripts",
    srcs = [
        "dependency-scripts.ts",
    ],
    deps = [
        "//reality/shared:html",
        "//reality/shared/module:load-module-target-slugs",
        "//reality/shared/module:module-target",
        "//reality/shared/module:validate-app-dependencies",
    ],
)

js_library(
    name = "dependency-token-payload",
    srcs = [
        "dependency-token-payload.ts",
    ],
)

js_library(
    name = "is-valid-alias",
    srcs = [
        "is-valid-alias.ts",
    ],
    deps = [
        "//reality/shared/module:module-constants",
    ],
)

js_library(
    name = "load-module-target-slugs",
    srcs = [
        "load-module-target-slugs.ts",
    ],
    deps = [
        "//reality/shared:dynamodb",
        "//reality/shared:typed-attributes",
        "//reality/shared/module:module-build",
        "//reality/shared/module:module-dependency",
        "//reality/shared/module:module-slug",
        "//reality/shared/module:validate-app-dependencies",
    ],
)

js_library(
    name = "merge-dependency-sets",
    srcs = [
        "merge-dependency-sets.ts",
    ],
    deps = [
        "//reality/shared/module:compare-module-config-value",
        "//reality/shared/module:compare-module-target",
        "//reality/shared/module:module-dependency",
        "//reality/shared/module:validate-app-dependencies",
    ],
)

js_library(
    name = "module-build-data",
    srcs = [
        "module-build-data.ts",
    ],
)

js_library(
    name = "module-build",
    srcs = [
        "module-build.ts",
    ],
    deps = [
        "//reality/shared:typed-attributes",
        "//reality/shared/module:module-target",
    ],
)

js_library(
    name = "module-config",
    srcs = [
        "module-config.ts",
    ],
)

js_library(
    name = "module-constants",
    srcs = [
        "module-constants.ts",
    ],
)

js_library(
    name = "module-dependency-data",
    srcs = [
        "module-dependency-data.ts",
    ],
    deps = [
        "//reality/shared:typed-attributes",
        "//reality/shared/module:dependency-token-payload",
    ],
)

js_library(
    name = "module-dependency",
    srcs = [
        "module-dependency.ts",
    ],
    deps = [
        "//reality/shared/gateway:gateway-types",
        "//reality/shared/module:module-config",
        "//reality/shared/module:module-target",
    ],
)

js_library(
    name = "module-display-name",
    srcs = [
        "module-display-name.ts",
    ],
)

js_library(
    name = "module-export-request",
    srcs = [
        "module-export-request.ts",
    ],
    deps = [
        "//reality/shared/module:module-dependency",
    ],
)

js_library(
    name = "module-featured-description",
    srcs = [
        "module-featured-description.ts",
    ],
)

js_library(
    name = "module-file-request",
    srcs = [
        "module-file-request.ts",
    ],
    deps = [
        "//reality/shared/module:module-target",
    ],
)

js_library(
    name = "module-manifest",
    srcs = [
        "module-manifest.ts",
    ],
    deps = [
        "//reality/shared/gateway:gateway-types",
        "//reality/shared/module:module-config",
    ],
)

js_library(
    name = "module-override-settings",
    srcs = [
        "module-override-settings.ts",
    ],
    deps = [
        "//reality/shared/module:module-target",
    ],
)

js_library(
    name = "module-runtime-config",
    srcs = [
        "module-runtime-config.ts",
    ],
)

js_library(
    name = "module-runtime",
    srcs = [
        "module-runtime.ts",
    ],
    deps = [
        "//reality/shared/module:module-runtime-config",
    ],
)

js_library(
    name = "module-slug",
    srcs = [
        "module-slug.ts",
    ],
    deps = [
        "//reality/shared:typed-attributes",
        "//reality/shared/module:module-build",
        "//reality/shared/module:module-target",
    ],
)

js_library(
    name = "module-static-paths",
    srcs = [
        "module-static-paths.ts",
    ],
)

js_library(
    name = "module-target-api",
    srcs = [
        "module-target-api.ts",
    ],
    deps = [
        "//reality/shared/module:module-target",
    ],
)

js_library(
    name = "module-target-caching",
    srcs = [
        "module-target-caching.ts",
    ],
    deps = [
        "//reality/shared/module:module-target",
    ],
)

js_library(
    name = "module-target-override",
    srcs = [
        "module-target-override.ts",
    ],
    deps = [
        "//reality/shared/module:module-target",
    ],
)

js_library(
    name = "module-target-visibility",
    srcs = [
        "module-target-visibility.ts",
    ],
    deps = [
        "//reality/shared/module:module-target",
        "//reality/shared/module:validate-access-token",
    ],
)

js_library(
    name = "module-target",
    srcs = [
        "module-target.ts",
    ],
)

js_library(
    name = "module-version-patches",
    srcs = [
        "module-version-patches.ts",
    ],
    deps = [
        "//reality/shared/module:compare-module-target",
        "//reality/shared/module:module-target",
        "//reality/shared/module:module-target-api",
    ],
)

js_library(
    name = "resolve-module-build",
    srcs = [
        "resolve-module-build.ts",
    ],
    deps = [
        "//reality/shared:typed-attributes",
        "//reality/shared/module:compare-module-target",
        "//reality/shared/module:module-build",
        "//reality/shared/module:module-build-data",
        "//reality/shared/module:module-target",
    ],
)

js_library(
    name = "resolve-module-config-value",
    srcs = [
        "resolve-module-config-value.ts",
    ],
    deps = [
        "//reality/shared:asset-pointer",
        "//reality/shared/module:module-dependency",
        "//reality/shared/module:module-runtime-config",
        "//reality/shared/studio:escape-asset-path",
    ],
)

js_library(
    name = "runtime-dependencies",
    srcs = [
        "runtime-dependencies.ts",
    ],
    deps = [
        "//reality/shared:html",
        "//reality/shared:run-queue",
        "//reality/shared/module:module-runtime",
        "//reality/shared/module:resolve-module-config-value",
        "//reality/shared/module:validate-app-dependencies",
    ],
)

js_library(
    name = "unsafe-module-target",
    srcs = [
        "unsafe-module-target.ts",
    ],
    deps = [
        "//reality/shared/module:module-target",
    ],
)

js_library(
    name = "update-version-target",
    srcs = [
        "update-version-target.ts",
    ],
    deps = [
        "//reality/shared/module:module-target",
    ],
)

js_library(
    name = "validate-access-token",
    srcs = [
        "validate-access-token.ts",
    ],
    deps = [
        "//reality/shared/module:dependency-token-payload",
        "//reality/shared/module:module-dependency-data",
    ],
)

js_library(
    name = "validate-app-dependencies",
    srcs = [
        "load-module-dependency-access.ts",
        "validate-app-dependencies.ts",
    ],
    deps = [
        "//reality/shared:dynamodb",
        "//reality/shared/module:module-constants",
        "//reality/shared/module:module-dependency",
        "//reality/shared/module:module-dependency-data",
        "//reality/shared/module:module-target-visibility",
        "//reality/shared/module:validate-access-token",
    ],
)

js_library(
    name = "validate-module-config",
    srcs = [
        "validate-module-config.ts",
    ],
    deps = [
        "//reality/shared/module:module-config",
    ],
)

js_library(
    name = "validate-module-dependency",
    srcs = [
        "validate-module-dependency.ts",
    ],
    deps = [
        "//reality/shared/module:is-valid-alias",
        "//reality/shared/module:module-dependency",
        "//reality/shared/module:validate-module-target",
    ],
)

js_library(
    name = "validate-module-manifest",
    srcs = [
        "validate-module-manifest.ts",
    ],
    deps = [
        "//reality/shared/module:module-manifest",
        "//reality/shared/module:validate-module-config",
    ],
)

js_library(
    name = "validate-module-override",
    srcs = [
        "validate-module-override.ts",
    ],
    deps = [
        "//reality/shared/module:module-override-settings",
        "//reality/shared/module:module-target",
        "//reality/shared/module:validate-module-target",
    ],
)

js_library(
    name = "validate-module-target",
    srcs = [
        "validate-module-target.ts",
    ],
    deps = [
        "//reality/shared/module:module-target",
    ],
)

js_library(
    name = "version-resolution",
    srcs = [
        "version-resolution.ts",
    ],
    deps = [
        "//reality/shared/module:compare-module-target",
        "//reality/shared/module:module-target",
        "//reality/shared/module:module-target-api",
    ],
)

js_test(
    name = "module-target-test",
    size = "small",
    main = [
        "module-target-test.ts",
    ],
    npm_rule = "@npm-lambda//:npm-lambda",
    deps = [
        "//bzl/js:chai-js",
        "//reality/shared/module:module-target",
    ],
)

js_test(
    name = "module-static-paths-test",
    size = "small",
    main = [
        "module-static-paths-test.ts",
    ],
    npm_rule = "@npm-lambda//:npm-lambda",
    deps = [
        "//bzl/js:chai-js",
        "//reality/shared/module:module-static-paths",
    ],
)

js_test(
    name = "validate-module-override-test",
    size = "small",
    main = [
        "validate-module-override-test.ts",
    ],
    npm_rule = "@npm-lambda//:npm-lambda",
    deps = [
        "//bzl/js:chai-js",
        "//reality/shared/module:validate-module-override",
    ],
)

js_test(
    name = "compare-module-target-test",
    size = "small",
    main = [
        "compare-module-target-test.ts",
    ],
    npm_rule = "@npm-lambda//:npm-lambda",
    deps = [
        "//bzl/js:chai-js",
        "//reality/shared/module:compare-module-target",
    ],
)

js_test(
    name = "module-target-visibility-test",
    size = "small",
    main = [
        "module-target-visibility-test.ts",
    ],
    npm_rule = "@npm-lambda//:npm-lambda",
    deps = [
        "//bzl/js:chai-js",
        "//reality/shared/module:module-target-visibility",
    ],
)

js_test(
    name = "validate-module-config-test",
    size = "small",
    main = [
        "validate-module-config-test.ts",
    ],
    npm_rule = "@npm-lambda//:npm-lambda",
    deps = [
        "//bzl/js:chai-js",
        "//reality/shared/module:module-config",
        "//reality/shared/module:validate-module-config",
    ],
)

js_test(
    name = "module-target-caching-test",
    size = "small",
    main = [
        "module-target-caching-test.ts",
    ],
    npm_rule = "@npm-lambda//:npm-lambda",
    deps = [
        "//bzl/js:chai-js",
        "//reality/shared/module:module-target-caching",
    ],
)

js_test(
    name = "version-resolution-test",
    size = "small",
    main = [
        "version-resolution-test.ts",
    ],
    npm_rule = "@npm-lambda//:npm-lambda",
    deps = [
        "//bzl/js:chai-js",
        "//reality/shared/module:module-target",
        "//reality/shared/module:module-target-api",
        "//reality/shared/module:version-resolution",
    ],
)

js_test(
    name = "module-build-test",
    size = "small",
    main = [
        "module-build-test.ts",
    ],
    npm_rule = "@npm-lambda//:npm-lambda",
    deps = [
        "//bzl/js:chai-js",
        "//reality/shared/module:module-build",
    ],
)

js_test(
    name = "module-target-override-test",
    size = "small",
    main = [
        "module-target-override-test.ts",
    ],
    npm_rule = "@npm-lambda//:npm-lambda",
    deps = [
        "//bzl/js:chai-js",
        "//reality/shared/module:module-target-override",
    ],
)

js_test(
    name = "module-version-patches-test",
    size = "small",
    main = [
        "module-version-patches-test.ts",
    ],
    npm_rule = "@npm-lambda//:npm-lambda",
    deps = [
        "//bzl/js:chai-js",
        "//reality/shared/module:module-target",
        "//reality/shared/module:module-target-api",
        "//reality/shared/module:module-version-patches",
    ],
)

js_test(
    name = "validate-module-dependency-test",
    size = "small",
    main = [
        "validate-module-dependency-test.ts",
    ],
    npm_rule = "@npm-lambda//:npm-lambda",
    deps = [
        "//bzl/js:chai-js",
        "//reality/shared/module:validate-module-dependency",
    ],
)

js_test(
    name = "unsafe-module-target-test",
    size = "small",
    main = [
        "unsafe-module-target-test.ts",
    ],
    npm_rule = "@npm-lambda//:npm-lambda",
    deps = [
        "//bzl/js:chai-js",
        "//reality/shared/module:unsafe-module-target",
    ],
)

js_test(
    name = "compare-module-config-value-test",
    size = "small",
    main = [
        "compare-module-config-value-test.ts",
    ],
    npm_rule = "@npm-lambda//:npm-lambda",
    deps = [
        "//bzl/js:chai-js",
        "//reality/shared/module:compare-module-config-value",
    ],
)

js_test(
    name = "merge-dependency-sets-test",
    size = "small",
    main = [
        "merge-dependency-sets-test.ts",
    ],
    npm_rule = "@npm-lambda//:npm-lambda",
    deps = [
        "//bzl/js:chai-js",
        "//reality/shared/module:merge-dependency-sets",
        "//reality/shared/module:module-dependency",
    ],
)

js_test(
    name = "compare-module-target-matrix-test",
    size = "small",
    main = [
        "compare-module-target-matrix-test.ts",
    ],
    npm_rule = "@npm-lambda//:npm-lambda",
    deps = [
        "//bzl/js:chai-js",
        "//reality/shared/module:compare-module-target",
        "//reality/shared/module:module-target",
    ],
)

js_test(
    name = "validate-access-token-test",
    size = "small",
    main = [
        "validate-access-token-test.ts",
    ],
    npm_rule = "@npm-lambda//:npm-lambda",
    deps = [
        "//bzl/js:chai-js",
        "//reality/shared/module:dependency-token-payload",
        "//reality/shared/module:validate-access-token",
    ],
)

js_test(
    name = "validate-module-target-test",
    size = "small",
    main = [
        "validate-module-target-test.ts",
    ],
    npm_rule = "@npm-lambda//:npm-lambda",
    deps = [
        "//bzl/js:chai-js",
        "//reality/shared/module:validate-module-target",
    ],
)

js_test(
    name = "module-file-request-test",
    size = "small",
    main = [
        "module-file-request-test.ts",
    ],
    npm_rule = "@npm-lambda//:npm-lambda",
    deps = [
        "//bzl/js:chai-js",
        "//reality/shared/module:module-file-request",
    ],
)

js_test(
    name = "resolve-module-config-value-test",
    size = "small",
    commonjs = 1,
    main = [
        "resolve-module-config-value-test.ts",
    ],
    npm_rule = "@npm-lambda//:npm-lambda",
    deps = [
        "//bzl/js:chai-js",
        "//reality/shared/module:resolve-module-config-value",
    ],
)

js_test(
    name = "validate-app-dependencies-test",
    size = "small",
    main = [
        "validate-app-dependencies-test.ts",
    ],
    npm_rule = "@npm-lambda//:npm-lambda",
    deps = [
        "//bzl/js:chai-js",
        "//reality/shared/module:module-dependency",
        "//reality/shared/module:validate-app-dependencies",
    ],
)
