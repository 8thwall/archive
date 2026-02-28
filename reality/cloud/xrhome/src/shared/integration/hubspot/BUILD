load("//bzl/js:js.bzl", "js_library")

package(default_visibility = ["//reality/cloud:shared"])

js_library(
    name = "hubspot-api",
    srcs = [
        "hubspot-api.ts",
    ],
    deps = [
        "//reality/cloud/xrhome/src/shared:registry",
    ],
)

js_library(
    name = "hubspot-blog-api-impl",
    srcs = [
        "hubspot-blog-api-impl.ts",
    ],
    deps = [
        "//reality/cloud/xrhome/src/shared:cms-constants",
        "//reality/cloud/xrhome/src/shared:time-utils",
        "//reality/cloud/xrhome/src/shared/integration/hubspot:hubspot-api",
        "//reality/cloud/xrhome/src/shared/integration/hubspot:hubspot-blog-api",
    ],
)

js_library(
    name = "hubspot-blog-api",
    srcs = [
        "hubspot-blog-api.ts",
    ],
    deps = [
        "//reality/cloud/xrhome/src/shared:registry",
    ],
)

js_library(
    name = "hubspot-mock-impl",
    srcs = [
        "hubspot-mock-impl.ts",
    ],
)

js_library(
    name = "prop-list",
    srcs = [
        "prop-list.ts",
    ],
)
