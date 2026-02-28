load("//bzl/js:js.bzl", "js_binary")

js_binary(
    name = "omniscope-container-app-min",
    srcs = [
        "recording/omni-recorder.tsx",
        "recording/recording-actions.ts",
        "recording/recording-reducer.ts",
        "reducer.ts",
        "theme.ts",
        "view/omni-viewer.tsx",
        "view/view-actions.ts",
        "view/view-reducer.ts",
        "widgets/fullscreen-container.tsx",
        "widgets/tray-menu.tsx",
    ],
    main = [
        "app.tsx",
    ],
    npm_rule = "@npm-omni-js//:npm-omni-js",
    polyfill = "none",
    visibility = [
        "//visibility:public",
    ],
    deps = [
        "//apps/client/internalqa/omniscope/js:omni-image-targets",
        "//apps/client/internalqa/omniscope/js/core:omni-types",
        "//apps/client/internalqa/omniscope/js/recorder",
        "//apps/client/internalqa/omniscope/js/recorder:yuv-canvas",
        "//c8/protolog/api:log-request.capnp-js",
        "//c8/webapp:dispatchify",
        "//c8/webapp:dispatchify-types",
        "//c8/webapp:fetch",
        "//reality/app/xr/js/src/types:recorder",
    ],
)

js_binary(
    name = "recorder-worker-min",
    srcs = [
    ],
    main = [
        "recording/worker.ts",
    ],
    polyfill = "buffer",
    visibility = [
        "//visibility:public",
    ],
    deps = [
    ],
)
