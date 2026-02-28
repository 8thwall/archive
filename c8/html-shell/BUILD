load("//bzl/js:js.bzl", "js_binary", "js_library", "js_test")

config_setting(
    name = "nae-inspector-enabled",
    define_values = {"NAE_INSPECTOR": "true"},
)

js_binary(
    name = "app",
    esnext = 1,
    main = [
        "app.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    visibility = [
        "//c8/html-shell:__subpackages__",
    ],
    deps = [
        "//c8/dom",
        "//c8/dom:dev-access",
        "//c8/dom:staging-access",
        "//c8/html-shell:verify-cookie-domain",
    ],
)

cc_library(
    name = "dom-events",
    hdrs = [
        "dom-events.h",
    ],
    visibility = ["//c8/html-shell:__subpackages__"],
    deps = [
        "//c8:c8-log",
    ],
)

cc_library(
    name = "input-event-data",
    hdrs = [
        "input-event-data.h",
    ],
    visibility = ["//c8/html-shell:__subpackages__"],
)

cc_library(
    name = "sensor-event-data",
    hdrs = [
        "sensor-event-data.h",
    ],
    visibility = ["//c8/html-shell:__subpackages__"],
)

cc_test(
    name = "sensor-event-data-test",
    size = "small",
    srcs = [
        "sensor-event-data-test.cc",
    ],
    deps = [
        ":sensor-event-data",
        "@com_google_googletest//:gtest_main",
    ],
)

cc_library(
    name = "node-binding-state",
    hdrs = [
        "node-binding-state.h",
    ],
    target_compatible_with = select({
        "//bzl/node:source-built-true": [],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    visibility = ["//c8/html-shell:__subpackages__"],
    deps = [
        "//bzl/node:node-addons-extra",
        "//c8:string",
        "//c8:vector",
        "//c8/string:format",
    ],
)

cc_library(
    name = "shell-app-state-base",
    srcs = [
        "shell-app-state-base.cc",
    ],
    hdrs = [
        "shell-app-state-base.h",
    ],
    visibility = ["//c8/html-shell:__subpackages__"],
    deps = [
        "//c8:string",
    ],
)

cc_library(
    name = "input-event-factory",
    srcs = [
        "input-event-factory.cc",
    ],
    hdrs = [
        "input-event-factory.h",
    ],
    visibility = ["//c8/html-shell:__subpackages__"],
    deps = [
        "//bzl/node:node-addons-extra",
        "//c8/html-shell:dom-events",
        "//c8/html-shell:input-event-data",
    ],
)

cc_library(
    name = "sensor-event-factory",
    srcs = [
        "sensor-event-factory.cc",
    ],
    hdrs = [
        "sensor-event-factory.h",
    ],
    visibility = ["//c8/html-shell:__subpackages__"],
    deps = [
        "//bzl/node:node-addons-extra",
        "//c8/html-shell:dom-events",
        "//c8/html-shell:sensor-event-data",
    ],
)

js_library(
    name = "verify-cookie-domain",
    srcs = [
        "verify-cookie-domain.ts",
    ],
    visibility = [
        "//visibility:public",
    ],
)

js_test(
    name = "verify-cookie-domain-test",
    size = "small",
    esnext = 1,
    main = [
        "verify-cookie-domain-test.ts",
    ],
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//c8/html-shell:verify-cookie-domain",
    ],
)

cc_library(
    name = "event-dispatcher",
    srcs = ["event-dispatcher.cc"],
    hdrs = ["event-dispatcher.h"],
    visibility = ["//c8/html-shell:__subpackages__"],
    deps = [
        "//bzl/node:node-addons-extra",
        "//c8:c8-log",
        "//c8:string",
        "//c8:vector",
        "//c8/html-shell:dom-events",
        "//c8/html-shell:input-event-data",
        "//c8/html-shell:input-event-factory",
        "//c8/html-shell:node-binding-state",
        "//c8/html-shell:sensor-event-data",
        "//c8/html-shell:sensor-event-factory",
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
    visibility = [
        "//c8/html-shell:__subpackages__",
    ],
    deps = [
        "//bzl/node:node-addons-extra",
        "//c8:c8-log",
        "//c8:map",
        "//c8:string",
        "//c8:vector",
        "//c8/html-shell:dom-events",
        "//c8/html-shell:event-dispatcher",
        "//c8/html-shell:node-binding-state",
        "//c8/html-shell:sensor-event-data",
        "//third_party/headless-gl:headless-gl-bindings",
        "@miniaudio-addon//:miniaudio-addon-bindings",
    ],
)

cc_library(
    name = "html-shell-helpers",
    srcs = [
        "html-shell-helpers.cc",
    ],
    hdrs = [
        "html-shell-helpers.h",
    ],
    visibility = [
        "//c8/html-shell:__subpackages__",
    ],
    deps = [
        "//c8:string",
        "//c8/io:file-io",
        "@json",
    ],
)

cc_test(
    name = "html-shell-helpers-test",
    size = "small",
    srcs = [
        "html-shell-helpers-test.cc",
    ],
    deps = [
        "//c8/html-shell:html-shell-helpers",
        "//c8/io:file-io",
        "@com_google_googletest//:gtest_main",
        "@json",
    ],
)

cc_library(
    name = "sensor-event-data-conversion",
    srcs = [
        "sensor-event-data-conversion.cc",
    ],
    hdrs = [
        "sensor-event-data-conversion.h",
    ],
    visibility = [
        "//c8/html-shell:__subpackages__",
    ],
    deps = [
        "//c8:quaternion",
    ],
)

cc_test(
    name = "sensor-event-data-conversion-test",
    size = "small",
    srcs = [
        "sensor-event-data-conversion-test.cc",
    ],
    deps = [
        "//c8:quaternion",
        "//c8/html-shell:sensor-event-data-conversion",
        "@com_google_googletest//:gtest_main",
    ],
)
