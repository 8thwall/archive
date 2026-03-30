load("//bzl/js:js.bzl", "js_library", "js_test")

package(default_visibility = ["//reality/cloud/aws/lambda/public-api:__subpackages__"])

js_library(
    name = "image",
    srcs = [
        "image.ts",
    ],
)

js_library(
    name = "validate",
    srcs = [
        "validate.ts",
    ],
    deps = [
        "//reality/cloud/aws/lambda/public-api/image-target:constants",
    ],
)

js_library(
    name = "image-data",
    srcs = [
        "image-data.ts",
    ],
)

js_library(
    name = "format",
    srcs = [
        "format.ts",
    ],
    deps = [
        "//reality/cloud/xrhome/src/shared/integration/db:models",
    ],
)

js_library(
    name = "curved-geometry",
    srcs = [
        "curved-geometry.ts",
    ],
    deps = [
        "//reality/cloud/aws/lambda/public-api/image-target:constants",
    ],
)

js_library(
    name = "upload",
    srcs = [
        "upload.ts",
    ],
    deps = [
        "//reality/cloud/aws/lambda/public-api:s3",
        "//reality/cloud/aws/lambda/public-api/image-target:constants",
        "//reality/cloud/aws/lambda/public-api/image-target:curved-geometry",
        "//reality/cloud/aws/lambda/public-api/image-target:image-data",
        "//reality/cloud/aws/lambda/public-api/image-target:image-target-types",
        "//reality/cloud/aws/lambda/public-api/image-target:unconify",
        "//reality/cloud/aws/lambda/public-api/image-target:validate",
    ],
)

js_library(
    name = "unconify",
    srcs = [
        "unconify.ts",
    ],
    deps = [
        "//reality/cloud/aws/lambda/public-api/image-target:image-data",
    ],
)

js_library(
    name = "constants",
    srcs = [
        "constants.ts",
    ],
)

js_test(
    name = "unconify-test",
    size = "small",
    externalize_npm = True,
    main = [
        "unconify-test.ts",
    ],
    npm_rule = "@npm-public-api//:npm-public-api",
    deps = [
        "//bzl/js:chai-js",
        "//reality/cloud/aws/lambda/public-api/image-target:image-data",
        "//reality/cloud/aws/lambda/public-api/image-target:unconify",
        "//reality/cloud/aws/lambda/public-api/test:images",
    ],
)

js_library(
    name = "image-target-types",
    srcs = [
        "image-target-types.ts",
    ],
)

js_library(
    name = "target-metadata",
    srcs = [
        "target-metadata.ts",
    ],
    deps = [
        "//reality/cloud/aws/lambda/public-api:s3",
        "//reality/cloud/aws/lambda/public-api/image-target:curved-geometry",
        "//reality/cloud/aws/lambda/public-api/image-target:image-target-types",
        "//reality/cloud/aws/lambda/public-api/image-target:upload",
        "//reality/cloud/aws/lambda/public-api/image-target:validate",
        "//reality/cloud/xrhome/src/shared/integration/db:models",
    ],
)
