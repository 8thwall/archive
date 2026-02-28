load("//bzl/js:js.bzl", "js_binary", "js_library", "js_test")
load("//bzl/js:ts-declarations.bzl", "ts_declarations")

package(default_visibility = ["//c8/dom:__subpackages__"])

ASAN_INCOMPATIBLE = select({
    "//bzl/asan:with-asan": ["@platforms//:incompatible"],
    "//conditions:default": [],
})

js_library(
    name = "dom",
    srcs = [
        "dom.ts",
    ],
    data = [
        ":dom-core",
        "//c8/dom/worker:worker-core",
        "//c8/dom/worker:worker-fetch-execution",
        "//c8/dom/worker:worker-runner",
    ],
    esnext = 1,
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    target_compatible_with = ASAN_INCOMPATIBLE,
    visibility = [
        "//visibility:public",
    ],
    deps = [
        ":dom-core-types",
        ":xml-http-request",
        "//bzl/js:fetch",
        "//bzl/js:vm-modules",
        "//c8/dom:context-helpers",
        "//c8/dom:html-fetch",
        "//third_party/headless-gl",
        "@miniaudio-addon//:miniaudio",
    ],
)

js_library(
    name = "xml-http-request",
    srcs = [
        "xml-http-request.ts",
    ],
    esnext = 1,
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    deps = [
        ":dom-core-types",
    ],
)

js_library(
    name = "dom-core-lib",
    srcs = [
        "animation-frame-provider.ts",
        "attr.ts",
        "attribute-change-steps.ts",
        "audio.ts",
        "audio-constants.ts",
        "canvas-draw-image.ts",
        "canvas-rendering-context-2d.ts",
        "character-data.ts",
        "child-node.ts",
        "comment.ts",
        "completion-record.ts",
        "cors.ts",
        "create-classic-script.ts",
        "create-module-script.ts",
        "css-style-declaration.ts",
        "cssom-element.ts",
        "decode-audio-buffer.ts",
        "dedicated-worker-global-scope.ts",
        "device-orientation-and-motion-events.ts",
        "document.ts",
        "document-fragment.ts",
        "document-methods.ts",
        "document-symbols.ts",
        "document-type.ts",
        "dom-events.ts",
        "dom-exception.ts",
        "dom-implementation.ts",
        "dom-rect.ts",
        "dom-string-map.ts",
        "dom-token-list.ts",
        "dom-token-list-internal.ts",
        "element.ts",
        "element-content-editable.ts",
        "element-internal.ts",
        "element-methods.ts",
        "element-parsing.ts",
        "element-symbols.ts",
        "encoding.ts",
        "environment.ts",
        "error.ts",
        "events-internal.ts",
        "events-methods.ts",
        "exception.ts",
        "execute-script.ts",
        "exposed-on-all.ts",
        "exposed-on-window.ts",
        "exposed-on-worker.ts",
        "fetch-api.ts",
        "fetch-classic-script.ts",
        "fetch-classic-worker-imported-script.ts",
        "fetch-classic-worker-script.ts",
        "fetch-methods.ts",
        "fetch-module-script.ts",
        "focus-options.ts",
        "font-face.ts",
        "font-face-set.ts",
        "global-event-handlers.ts",
        "history.ts",
        "hosts.ts",
        "html-audio-element.ts",
        "html-canvas-element.ts",
        "html-collection.ts",
        "html-element.ts",
        "html-elements.ts",
        "html-image-element.ts",
        "html-media-element.ts",
        "html-meta-element.ts",
        "html-or-svg-element.ts",
        "html-script-element.ts",
        "html-script-element-symbols.ts",
        "html-video-element.ts",
        "image.ts",
        "image-bitmap.ts",
        "image-data.ts",
        "image-defines.ts",
        "import-map.ts",
        "infra.ts",
        "location.ts",
        "mime-type.ts",
        "module-methods.ts",
        "mouse-events.ts",
        "named-node-map.ts",
        "namespaces.ts",
        "navigator.ts",
        "nia-window.ts",
        "nia-worker-global-scope.ts",
        "node.ts",
        "node-internal.ts",
        "node-list.ts",
        "node-methods.ts",
        "non-document-type-child-node.ts",
        "offscreen-canvas.ts",
        "offscreen-canvas-rendering-context-2d.ts",
        "ordered-set.ts",
        "parent-node.ts",
        "permission-status.ts",
        "prepare-script.ts",
        "referrer-policy.ts",
        "rendering-context-2d.ts",
        "resize-observer.ts",
        "screen.ts",
        "script.ts",
        "storage.ts",
        "strings.ts",
        "text.ts",
        "touch.ts",
        "video.ts",
        "vm-record.ts",
        "webgl-rendering-context.d.ts",
        "webgl-rendering-context.js",
        "webgl-rendering-context-base.ts",
        "webgl-rendering-context-overloads.ts",
        "webgl2-rendering-context.d.ts",
        "webgl2-rendering-context.js",
        "webgl2-rendering-context-base.ts",
        "webgl2-rendering-context-overloads.ts",
        "window.ts",
        "window-event-handler-names.ts",
        "window-event-handlers.ts",
        "window-methods.ts",
        "window-or-worker-global-scope.ts",
        "window-symbols.ts",
        "worker.ts",
        "worker-event-handlers.ts",
        "worker-global-scope.ts",
        "xml-http-request.d.ts",
        "xml-names.ts",
    ],
    esnext = 1,
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    visibility = ["//visibility:public"],
    deps = [
        ":fetch-overload",
        "//c8/dom:mime-type-image",
        "//c8/dom:raw-image",
        "//c8/dom:web-assembly",
        "//c8/dom/audio:audio-lib",
        "//c8/dom/audio-decode-cache",
        "//c8/dom/sync-fetch",
    ],
)

js_binary(
    name = "dom-core",
    esnext = 1,
    export_library = 1,
    externals = "third_party/headless-gl/*, external/miniaudio-addon/*",
    externalsType = "module",
    main = [
        "dom-core.ts",
    ],
    mangle = 0,
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    deps = [
        "//c8/dom:attr",
        "//c8/dom:canvas-rendering-context-2d",
        "//c8/dom:character-data",
        "//c8/dom:comment",
        "//c8/dom:css-style-declaration",
        "//c8/dom:document",
        "//c8/dom:document-type",
        "//c8/dom:dom-events",
        "//c8/dom:dom-exception",
        "//c8/dom:dom-implementation",
        "//c8/dom:dom-string-map",
        "//c8/dom:dom-token-list",
        "//c8/dom:element",
        "//c8/dom:focus-options",
        "//c8/dom:history",
        "//c8/dom:html-collection",
        "//c8/dom:html-element",
        "//c8/dom:html-elements",
        "//c8/dom:image",
        "//c8/dom:location",
        "//c8/dom:mouse-events",
        "//c8/dom:named-node-map",
        "//c8/dom:node",
        "//c8/dom:node-list",
        "//c8/dom:offscreen-canvas",
        "//c8/dom:offscreen-canvas-rendering-context-2d",
        "//c8/dom:resize-observer",
        "//c8/dom:strings",
        "//c8/dom:text",
        "//c8/dom:webgl-rendering-context",
        "//c8/dom:webgl-rendering-context-base",
        "//c8/dom:webgl-rendering-context-overloads",
        "//c8/dom:webgl2-rendering-context",
        "//c8/dom:webgl2-rendering-context-base",
        "//c8/dom:webgl2-rendering-context-overloads",
        "//c8/dom:window",
        "//c8/dom:worker",
        "//c8/dom:worker-global-scope",
        "//c8/dom/audio:audio-context",
    ],
)

ts_declarations(
    name = "dom-core-types",
    binary = ":dom-core",
)

js_library(
    name = "context-helpers",
    srcs = [
        "context-helpers.ts",
    ],
    esnext = 1,
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    deps = [
        "//c8/dom:fetch-overload",
        "//c8/dom:xml-http-request",
        "//c8/dom/http-cache",
        "//c8/dom/image-decoding",
    ],
)

js_library(
    name = "html-fetch",
    srcs = [
        "html-fetch.ts",
    ],
    esnext = 1,
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    deps = [
        "//bzl/js:fetch",
        "//bzl/js:vm-modules",
        "//c8/dom:dom-core",
    ],
)

js_library(
    name = "mime-type-image",
    srcs = [
        "mime-type-image.ts",
    ],
    visibility = [
        "//visibility:public",
    ],
)

js_library(
    name = "fetch-overload",
    srcs = [
        "fetch-overload.ts",
    ],
    data = [
        ":fetch-worker",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    deps = [
        "//bzl/js:fetch",
        "//c8/dom/http-cache",
        "//c8/dom/sync-fetch:sync-fetch-serialization",
    ],
)

js_library(
    name = "fetch-worker-helper",
    srcs = [
        "fetch-worker-helper.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    deps = [
        "//c8/dom/http-cache",
    ],
)

js_binary(
    name = "fetch-worker",
    main = [
        "fetch-worker.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    deps = [
        "//c8/dom:fetch-worker-helper",
    ],
)

js_binary(
    name = "fetch-test-worker",
    main = [
        "fetch-test-worker.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    deps = [
        "//c8/dom:fetch-worker-helper",
    ],
)

js_binary(
    name = "fetch-test-with-cache-worker",
    main = [
        "fetch-test-with-cache-worker.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    deps = [
        "//c8/dom:fetch-worker-helper",
    ],
)

js_test(
    name = "html-audio-element-test",
    size = "small",
    data = [
        "//c8/dom/audio:audio-element-test-htmls",
        "//c8/dom/audio:audio-test-files",
        "//c8/dom/audio:test-utils.js",
    ],
    esnext = 1,
    main = [
        "html-audio-element-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    tags = ["manual"],
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//c8/dom",
        "//c8/dom:html-audio-element",
        "//c8/dom/audio:audio-context",
    ],
)

js_test(
    name = "dom-window-test",
    size = "small",
    data = [
        "dom-test.html",
        "fetch-test-worker",
    ],
    esnext = 1,
    main = [
        "dom-window-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//c8/dom",
    ],
)

js_test(
    name = "dom-test",
    size = "small",
    data = [
        "dom-test.html",
        "fetch-test-worker",
    ],
    esnext = 1,
    main = [
        "dom-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//c8/dom",
    ],
)

js_test(
    name = "xml-http-request-test",
    size = "small",
    esnext = 1,
    main = [
        "xml-http-request-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//bzl/js:fetch",
        "//c8/dom:assert-throws-with",
        "//c8/dom:xml-http-request",
    ],
)

js_test(
    name = "fetch-overload-with-cache-test",
    size = "small",
    data = [
        "fetch-test-with-cache-worker",
    ],
    esnext = 1,
    main = [
        "fetch-overload-with-cache-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//bzl/js:fetch",
        "//c8/dom:fetch-overload",
        "//c8/dom:fetch-worker-helper",
        "//c8/dom/http-cache",
    ],
)

js_test(
    name = "html-fetch-test",
    size = "small",
    data = [
        "fetch-test-worker",
        "html-fetch-test.html",
        "html-fetch-test-0.js",
        "html-fetch-test-1.js",
        "html-fetch-test-2.js",
        "html-fetch-test-3.js",
        "html-fetch-test-4.js",
        "html-fetch-test-5.js",
        "html-fetch-test-6.js",
        "html-fetch-test-7.js",
        "html-fetch-test-8.js",
        "html-fetch-test-9.js",
        "html-fetch-test-missing-html-tag.html",
    ],
    esnext = 1,
    main = [
        "html-fetch-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//c8/dom",
        "//c8/dom:fetch-worker-helper",
    ],
)

js_test(
    name = "named-node-map-test",
    size = "small",
    esnext = 1,
    main = [
        "named-node-map-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//c8/dom:attr",
        "//c8/dom:document",
        "//c8/dom:element",
        "//c8/dom:named-node-map",
        "//c8/dom:strings",
    ],
)

js_test(
    name = "dom-token-list-test",
    size = "small",
    esnext = 1,
    main = [
        "dom-token-list-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//c8/dom:document",
        "//c8/dom:dom-exception",
        "//c8/dom:dom-token-list",
        "//c8/dom:element",
        "//c8/dom:strings",
    ],
)

js_test(
    name = "element-test",
    size = "small",
    esnext = 1,
    main = [
        "element-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//c8/dom:assert-throws-with",
        "//c8/dom:document",
        "//c8/dom:dom-exception",
        "//c8/dom:dom-token-list",
        "//c8/dom:element",
        "//c8/dom:node",
        "//c8/dom:strings",
        "//c8/dom:text",
        "//third_party/headless-gl",
    ],
)

js_test(
    name = "html-collection-test",
    size = "small",
    esnext = 1,
    main = [
        "html-collection-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//c8/dom:document",
        "//c8/dom:element",
        "//c8/dom:html-collection",
    ],
)

js_test(
    name = "node-test",
    size = "small",
    esnext = 1,
    main = [
        "node-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//c8/dom:document",
        "//c8/dom:node",
        "//c8/dom:strings",
        "//c8/dom:text",
    ],
)

js_test(
    name = "node-list-test",
    size = "small",
    esnext = 1,
    main = [
        "node-list-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//c8/dom:document",
        "//c8/dom:node",
        "//c8/dom:node-list",
        "//c8/dom:strings",
    ],
)

js_test(
    name = "document-test",
    size = "small",
    esnext = 1,
    main = [
        "document-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//c8/dom:document",
        "//c8/dom:document-type",
        "//c8/dom:html-elements",
        "//c8/dom:node",
        "//third_party/headless-gl",
    ],
)

js_test(
    name = "character-data-test",
    size = "small",
    esnext = 1,
    main = [
        "character-data-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//c8/dom:character-data",
        "//c8/dom:document",
        "//c8/dom:node",
        "//c8/dom:strings",
        "//third_party/headless-gl",
    ],
)

js_test(
    name = "child-node-test",
    size = "small",
    esnext = 1,
    main = [
        "child-node-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//c8/dom:character-data",
        "//c8/dom:document",
        "//c8/dom:node",
        "//c8/dom:strings",
        "//third_party/headless-gl",
    ],
)

js_test(
    name = "image-data-test",
    size = "small",
    esnext = 1,
    main = [
        "image-data-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//c8/dom",
    ],
)

js_test(
    name = "text-test",
    size = "small",
    esnext = 1,
    main = [
        "text-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//c8/dom:document",
        "//c8/dom:node",
        "//c8/dom:strings",
        "//c8/dom:text",
    ],
)

js_test(
    name = "parent-node-test",
    size = "small",
    esnext = 1,
    main = [
        "parent-node-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//c8/dom:document",
        "//c8/dom:element",
        "//c8/dom:node",
        "//c8/dom:strings",
        "//third_party/headless-gl",
    ],
)

#TODO(divyabhaskara): increase timeout of this test when it eventually runs all the conformance tests
js_test(
    name = "webgl-conformance-tests",
    size = "small",
    data = [
        "@webgl-conformance//:webgl-conformance-test-files",
    ],
    esnext = 1,
    main = [
        "webgl-conformance-tests.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    tags = ["manual"],
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//c8/dom",
    ],
)

js_library(
    name = "assert-throws-with",
    testonly = 1,
    srcs = [
        "assert-throws-with.ts",
    ],
    deps = [
        "//bzl/js:chai-js",
    ],
)

js_test(
    name = "storage-test",
    size = "small",
    esnext = 1,
    main = [
        "storage-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//c8/dom",
    ],
)

js_test(
    name = "window-navigator-test",
    size = "small",
    esnext = 1,
    main = [
        "window-navigator-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//c8/dom",
    ],
)

js_library(
    name = "staging-access",
    srcs = [
        "staging-access.ts",
    ],
    esnext = 1,
    target = "node",
    visibility = [
        "//visibility:public",
    ],
    deps = [
        "//bzl/js:fetch",
    ],
)

js_library(
    name = "dev-access",
    srcs = [
        "dev-access.ts",
    ],
    esnext = 1,
    target = "node",
    visibility = [
        "//visibility:public",
    ],
    deps = [
        "//bzl/js:fetch",
        "//reality/cloud/aws/edge-lambda/shared:parse-hosting-domain",
    ],
)

js_library(
    name = "raw-image",
    srcs = [
        "raw-image.ts",
    ],
    deps = [
        "//c8/dom/image-decoding",
    ],
)

js_test(
    name = "html-image-element-test",
    size = "small",
    data = [
        "fetch-test-worker",
    ],
    esnext = 1,
    main = [
        "html-image-element-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//c8/dom",
        "//c8/dom:html-image-element",
    ],
)

js_test(
    name = "css-style-declaration-test",
    size = "small",
    esnext = 1,
    main = [
        "css-style-declaration-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//c8/dom:css-style-declaration",
    ],
)

js_test(
    name = "screen-test",
    size = "small",
    esnext = 1,
    main = [
        "screen-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//c8/dom",
    ],
)

js_library(
    name = "animation-frame-provider",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "attr",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "attribute-change-steps",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "audio",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "audio-constants",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "canvas-draw-image",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "canvas-rendering-context-2d",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "character-data",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "child-node",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "comment",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "completion-record",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "cors",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "create-classic-script",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "create-module-script",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "css-style-declaration",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "cssom-element",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "decode-audio-buffer",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "dedicated-worker-global-scope",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "document",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "document-fragment",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "document-methods",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "document-symbols",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "document-type",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "dom-events",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "dom-exception",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "dom-implementation",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "dom-rect",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "dom-string-map",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "dom-token-list",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "dom-token-list-internal",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "element",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "element-content-editable",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "element-internal",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "element-methods",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "element-parsing",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "element-symbols",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "encoding",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "environment",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "error",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "events-internal",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "events-methods",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "exception",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "execute-script",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "exposed-on-all",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "exposed-on-window",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "exposed-on-worker",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "fetch-api",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "fetch-classic-script",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "fetch-classic-worker-imported-script",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "fetch-classic-worker-script",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "fetch-methods",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "fetch-module-script",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "focus-options",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "font-face",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "font-face-set",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "global-event-handlers",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "hosts",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "html-audio-element",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "html-canvas-element",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "history",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_test(
    name = "history-test",
    size = "small",
    esnext = 1,
    main = [
        "history-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//c8/dom",
    ],
)

js_library(
    name = "html-collection",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "html-element",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "html-elements",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "html-image-element",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "html-media-element",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "html-meta-element",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "html-or-svg-element",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "html-script-element",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "html-script-element-symbols",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "image",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "image-data",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "image-defines",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "import-map",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "infra",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "location",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "mime-type",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "module-methods",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "mouse-events",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "named-node-map",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "namespaces",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "navigator",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "screen",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "nia-window",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "nia-worker-global-scope",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "node",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "node-internal",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "node-list",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "node-methods",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "non-document-type-child-node",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "offscreen-canvas",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "offscreen-canvas-rendering-context-2d",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "ordered-set",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "parent-node",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "prepare-script",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "referrer-policy",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "rendering-context-2d",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "script",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "storage",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "touch",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "strings",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "text",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "vm-record",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "webgl-rendering-context",
    srcs = [
        "webgl-rendering-context.js",
    ],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "webgl-rendering-context-base",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "webgl-rendering-context-overloads",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "webgl2-rendering-context",
    srcs = [
        "webgl2-rendering-context.js",
    ],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "webgl2-rendering-context-base",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "webgl2-rendering-context-overloads",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "window",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "window-event-handler-names",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "window-event-handlers",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "window-methods",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "window-or-worker-global-scope",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "window-symbols",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "worker",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "worker-event-handlers",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "worker-global-scope",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "xml-names",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "device-orientation-and-motion-events",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "permission-status",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_test(
    name = "dom-event-test",
    size = "small",
    esnext = 1,
    main = [
        "dom-event-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//c8/dom",
    ],
)

js_test(
    name = "failed-fetch-test",
    size = "small",
    data = [
        "fetch-test-worker",
    ],
    esnext = 1,
    main = [
        "failed-fetch-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//c8/dom:fetch-overload",
        "//c8/dom:fetch-worker-helper",
    ],
)

js_library(
    name = "video",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_library(
    name = "html-video-element",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_test(
    name = "html-video-element-test",
    size = "small",
    data = [
        "fetch-test-worker",
    ],
    esnext = 1,
    main = [
        "html-video-element-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//c8/dom",
        "//c8/dom:html-video-element",
    ],
)

js_test(
    name = "non-document-type-child-node-test",
    size = "small",
    esnext = 1,
    main = [
        "non-document-type-child-node-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//c8/dom:document",
        "//c8/dom:node",
        "//c8/dom:non-document-type-child-node",
        "//c8/dom:strings",
        "//third_party/headless-gl",
    ],
)

js_test(
    name = "navigator-test",
    size = "small",
    esnext = 1,
    main = [
        "navigator-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//c8/dom",
    ],
)

js_library(
    name = "image-bitmap",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_binary(
    name = "web-assembly-override",
    esnext = 1,
    export_library = 1,
    externalsType = "module",
    main = [
        "web-assembly-override.ts",
    ],
    mangle = 0,
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    visibility = ["//visibility:public"],
    deps = [
        "//c8/dom:web-assembly",
    ],
)

js_library(
    name = "web-assembly",
    srcs = [
        "web-assembly.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
)

js_test(
    name = "web-assembly-test",
    size = "small",
    esnext = 1,
    main = [
        "web-assembly-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//c8/dom:web-assembly",
    ],
)

js_test(
    name = "build-mode-fetch-test",
    size = "small",
    data = [
        "//c8/dom/build-mode-fetch-test-data",
    ],
    esnext = 1,
    main = [
        "build-mode-fetch-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//bzl/js:fetch",
        "//c8/dom",
        "//c8/dom:fetch-overload",
        "//c8/dom:fetch-worker-helper",
        "//c8/dom/http-cache",
    ],
)

js_library(
    name = "resize-observer",
    srcs = [],
    deps = [
        ":dom-core-lib",
    ],
)

js_test(
    name = "resize-observer-test",
    size = "small",
    esnext = 1,
    main = [
        "resize-observer-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//c8/dom",
        "//c8/dom:document",
    ],
)

js_test(
    name = "image-bitmap-test",
    size = "small",
    esnext = 1,
    main = [
        "image-bitmap-test.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//c8/dom",
    ],
)

js_test(
    name = "mime-type-image-test",
    size = "small",
    data = [
        "//c8/pixels/testdata:frame0",
        "//c8/pixels/testdata:test-gif-input",
        "//c8/pixels/testdata:test-input-landscape",
    ],
    esnext = 1,
    main = [
        "mime-type-image-test.ts",
    ],
    target = "node",
    webpack_mode = "development",
    deps = [
        "//bzl/js:chai-js",
        "//c8/dom:mime-type-image",
    ],
)
