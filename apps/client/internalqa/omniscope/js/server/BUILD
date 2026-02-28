load("//bzl/js:js.bzl", "js_cli")
load("//bzl/js:js-filegroup.bzl", "js_filegroup")

js_filegroup(
    name = "server-files",
    srcs = [
        "index.html",
        "//apps/client/internalqa/omniscope/js/container:omniscope-container-app-min",
        "//apps/client/internalqa/omniscope/js/container:recorder-worker-min",
        "//apps/client/internalqa/omniscope/js:img",
        "//apps/client/internalqa/omniscope/js:models",
        # These are the ones that have the -wasm files
        "//apps/client/internalqa/omniscope/js/core:omni-core",
        "//apps/client/internalqa/omniscope/js/core:omniscope-wasm",
        "//apps/client/internalqa/omniscope/js/recorder:recorder-binary",
        "//apps/client/internalqa/omniscope/js/recorder:recorder-wasm",
    ],
    force_target = "web",
)

js_cli(
    name = "server",
    data = [
        ":server-files",
    ],
    main = [
        "main.ts",
    ],
    npm_rule = "@npm-omni-js//:npm-omni-js",
    visibility = [
        "//visibility:public",
    ],
    deps = [
        "//c8/cli:cert",
        "//c8/cli:ip",
    ],
)
