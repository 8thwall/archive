load("//bzl/js:js.bzl", "js_binary", "js_library", "js_test")
load("//reality/cloud/aws/lambda:lambda.bzl", "lambda_config", "lambda_deploy")
load("@rules_pkg//:pkg.bzl", "pkg_zip")
load("//bzl/zip:merge.bzl", "merge_zip")
load("//bzl/node:prune.bzl", "npm_prune")
load("//bzl/npmpackage:typecheck.bzl", "npm_typecheck")

package(default_visibility = ["//reality/cloud/aws/lambda/public-api:__subpackages__"])

npm_typecheck(name = "npm-public-api")

js_binary(
    name = "index",
    commonjs = True,
    esnext = True,
    export_library = True,
    externals = "*",
    main = [
        "index.ts",
    ],
    npm_rule = "@npm-public-api//:npm-public-api",
    target = "node",
    deps = [
        "//reality/cloud/aws/lambda/public-api:ad-submissions",
        "//reality/cloud/aws/lambda/public-api:api-types",
        "//reality/cloud/aws/lambda/public-api:app-targets",
        "//reality/cloud/aws/lambda/public-api:models",
        "//reality/cloud/aws/lambda/public-api:responses",
        "//reality/cloud/aws/lambda/public-api:route",
        "//reality/cloud/aws/lambda/public-api:s3",
        "//reality/cloud/aws/lambda/public-api:target",
        "//reality/cloud/aws/lambda/public-api:target-test",
        "//reality/cloud/aws/lambda/public-api/models:init",
        "//reality/cloud/aws/lambda/shared:set-secrets",
        "//reality/cloud/xrhome/certs:rds",
    ],
)

pkg_zip(
    name = "src-bundle",
    srcs = [
        ":index",
    ],
)

npm_prune(
    name = "pruned-dependencies",
    modules = "@npm-public-api//:node_modules.zip",
)

merge_zip(
    name = "bundle",
    srcs = [
        ":pruned-dependencies",
        ":src-bundle",
        "@sharp-linux-install//file",
    ],
)

lambda_deploy(
    name = "deploy-latest",
    bundle = ":bundle",
    config = "config.json",
    region = "us-west-2",
    skip_prompt = 1,
)

lambda_deploy(
    name = "deploy-qa",
    alias = "masterDev",
    bundle = ":bundle",
    config = "config.json",
    region = "us-west-2",
    skip_prompt = 1,
)

lambda_config(
    name = "prod-config",
    base = "config.json",
    overrides = [
        "prod-config.json",
    ],
)

lambda_deploy(
    name = "deploy-rc",
    alias = "master",
    bundle = ":bundle",
    config = ":prod-config",
    region = "us-west-2",
)

js_library(
    name = "s3",
    srcs = [
        "s3.ts",
    ],
)

js_library(
    name = "headers",
    srcs = [
        "headers.ts",
    ],
)

js_library(
    name = "target",
    srcs = [
        "target.ts",
    ],
    deps = [
        "//reality/cloud/aws/lambda/public-api:api-key",
        "//reality/cloud/aws/lambda/public-api:api-types",
        "//reality/cloud/aws/lambda/public-api:headers",
        "//reality/cloud/aws/lambda/public-api:models",
        "//reality/cloud/aws/lambda/public-api:responses",
        "//reality/cloud/aws/lambda/public-api/image-target:constants",
        "//reality/cloud/aws/lambda/public-api/image-target:curved-geometry",
        "//reality/cloud/aws/lambda/public-api/image-target:format",
        "//reality/cloud/aws/lambda/public-api/image-target:target-metadata",
        "//reality/cloud/aws/lambda/public-api/image-target:validate",
    ],
)

js_library(
    name = "form-data",
    srcs = [
        "form-data.ts",
    ],
    deps = [
        "//reality/cloud/aws/lambda/public-api:api-types",
        "//reality/cloud/aws/lambda/public-api:headers",
    ],
)

js_library(
    name = "app-targets",
    srcs = [
        "app-targets.ts",
    ],
    deps = [
        "//reality/cloud/aws/lambda/public-api:api-key",
        "//reality/cloud/aws/lambda/public-api:api-types",
        "//reality/cloud/aws/lambda/public-api:form-data",
        "//reality/cloud/aws/lambda/public-api:models",
        "//reality/cloud/aws/lambda/public-api:responses",
        "//reality/cloud/aws/lambda/public-api:strict-parse",
        "//reality/cloud/aws/lambda/public-api/image-target:constants",
        "//reality/cloud/aws/lambda/public-api/image-target:curved-geometry",
        "//reality/cloud/aws/lambda/public-api/image-target:format",
        "//reality/cloud/aws/lambda/public-api/image-target:image",
        "//reality/cloud/aws/lambda/public-api/image-target:image-target-types",
        "//reality/cloud/aws/lambda/public-api/image-target:upload",
        "//reality/cloud/aws/lambda/public-api/image-target:validate",
    ],
)

js_library(
    name = "route",
    srcs = [
        "route.ts",
    ],
)

js_library(
    name = "ad-submissions",
    srcs = [
        "ad-submissions.ts",
    ],
    deps = [
        "//reality/cloud/aws/lambda/public-api:api-key",
        "//reality/cloud/aws/lambda/public-api:api-types",
        "//reality/cloud/aws/lambda/public-api:headers",
        "//reality/cloud/aws/lambda/public-api:models",
        "//reality/cloud/aws/lambda/public-api:responses",
    ],
)

js_library(
    name = "models",
    srcs = [
        "models.ts",
    ],
    deps = [
        "//reality/cloud/xrhome/src/shared/integration/db:db-api",
    ],
)

js_library(
    name = "api-key",
    srcs = [
        "api-key.ts",
    ],
    deps = [
        "//reality/cloud/aws/lambda/public-api:models",
    ],
)

js_library(
    name = "responses",
    srcs = [
        "responses.ts",
    ],
    deps = [
        "//reality/cloud/aws/lambda/public-api:api-types",
    ],
)

js_library(
    name = "strict-parse",
    srcs = [
        "strict-parse.ts",
    ],
)

js_library(
    name = "target-test",
    srcs = [
        "target-test.ts",
    ],
    deps = [
        "//reality/cloud/aws/lambda/public-api:api-key",
        "//reality/cloud/aws/lambda/public-api:api-types",
        "//reality/cloud/aws/lambda/public-api:responses",
    ],
)

js_test(
    name = "ad-submissions-test",
    size = "small",
    externalize_npm = True,
    main = [
        "ad-submissions-test.ts",
    ],
    npm_rule = "@npm-public-api//:npm-public-api",
    deps = [
        "//bzl/js:chai-js",
        "//reality/cloud/aws/lambda/public-api:ad-submissions",
        "//reality/cloud/aws/lambda/public-api:models",
        "//reality/cloud/aws/lambda/public-api/models:init",
        "//reality/cloud/aws/lambda/public-api/test:common",
    ],
)

js_test(
    name = "app-targets-pagination-test",
    size = "small",
    externalize_npm = True,
    main = [
        "app-targets-pagination-test.ts",
    ],
    npm_rule = "@npm-public-api//:npm-public-api",
    deps = [
        "//bzl/js:chai-js",
        "//reality/cloud/aws/lambda/public-api:app-targets",
        "//reality/cloud/aws/lambda/public-api:models",
        "//reality/cloud/aws/lambda/public-api/models:init",
        "//reality/cloud/aws/lambda/public-api/test:common",
    ],
)

js_test(
    name = "headers-test",
    size = "small",
    main = [
        "headers-test.ts",
    ],
    deps = [
        "//bzl/js:chai-js",
        "//reality/cloud/aws/lambda/public-api:headers",
    ],
)

js_test(
    name = "route-test",
    size = "small",
    main = [
        "route-test.ts",
    ],
    deps = [
        "//bzl/js:chai-js",
        "//reality/cloud/aws/lambda/public-api:route",
    ],
)

js_test(
    name = "target-api-test",
    size = "small",
    externalize_npm = True,
    main = [
        "target-api-test.ts",
    ],
    npm_rule = "@npm-public-api//:npm-public-api",
    deps = [
        "//bzl/js:chai-js",
        "//reality/cloud/aws/lambda/public-api:models",
        "//reality/cloud/aws/lambda/public-api:s3",
        "//reality/cloud/aws/lambda/public-api:target",
        "//reality/cloud/aws/lambda/public-api/models:init",
        "//reality/cloud/aws/lambda/public-api/test:common",
        "//reality/cloud/aws/lambda/public-api/test:images",
    ],
)

js_test(
    name = "app-targets-get-test",
    size = "small",
    externalize_npm = True,
    main = [
        "app-targets-get-test.ts",
    ],
    npm_rule = "@npm-public-api//:npm-public-api",
    deps = [
        "//bzl/js:chai-js",
        "//reality/cloud/aws/lambda/public-api:app-targets",
        "//reality/cloud/aws/lambda/public-api:models",
        "//reality/cloud/aws/lambda/public-api/models:init",
        "//reality/cloud/aws/lambda/public-api/test:common",
    ],
)

js_test(
    name = "app-targets-test",
    size = "medium",
    externalize_npm = True,
    main = [
        "app-targets-test.ts",
    ],
    node_opts = [
        "--enable-source-maps",
    ],
    npm_rule = "@npm-public-api//:npm-public-api",
    deps = [
        "//bzl/js:chai-js",
        "//reality/cloud/aws/lambda/public-api:app-targets",
        "//reality/cloud/aws/lambda/public-api:models",
        "//reality/cloud/aws/lambda/public-api:s3",
        "//reality/cloud/aws/lambda/public-api/models:init",
        "//reality/cloud/aws/lambda/public-api/test:common",
        "//reality/cloud/aws/lambda/public-api/test:images",
    ],
)

js_library(
    name = "api-types",
    srcs = [
        "api-types.ts",
    ],
)
