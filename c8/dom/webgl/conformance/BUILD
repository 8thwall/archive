load("//c8/dom:webgl-conformance.bzl", "webgl_conformance_test")

TARGET_COMPATIBLE_WITH = select({
    "//c8/pixels/opengl:with-angle": [],
    "//conditions:default": ["@platforms//:incompatible"],
})

webgl_conformance_test(
    name = "attribs",
    expected_failures = [
        "gl-bindAttribLocation-aliasing",
        "gl-bindAttribLocation-matrix",
        "gl-enable-vertex-attrib",
        "gl-vertex-attrib",
        "gl-vertexattribpointer",
        "gl-vertexattribpointer-offsets",
        "gl-vertex-attrib-unconsumed-out-of-bounds",
        "gl-vertex-attrib-context-switch",
    ],
    tags = ["manual"],  # Flaky on jenkins
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/attribs/",
)

webgl_conformance_test(
    name = "buffers",
    expected_failures = [
        "buffer-data-and-buffer-sub-data",
        "index-validation",
    ],
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/buffers/",
    timeout_ms = 5000,
)

webgl_conformance_test(
    name = "canvas",
    tags = ["manual"],  # Abort trap immediately
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/canvas/",
)

webgl_conformance_test(
    name = "context",
    expected_failures = [
        "constants-and-properties",
        "context-attribute-preserve-drawing-buffer",
        "context-attributes-alpha-depth-stencil-antialias",
        "context-size-change",
        "context-no-alpha-fbo-with-alpha",
        "context-hidden-alpha",
        "context-type-test",
        "deleted-object-behavior",
        "incorrect-context-object-behaviour",
        "methods",
        "premultiplyalpha-test",
        "zero-sized-canvas",
    ],
    skips = [
        "context-release-upon-reload",
        "context-release-with-workers",
    ],
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/context/",
    timeout_ms = 10000,
)

webgl_conformance_test(
    name = "extensions",
    expected_failures = [
        "ext-blend-minmax",
        "ext-color-buffer-half-float",
        "ext-float-blend",
        "ext-texture-compression-bptc",
        "ext-texture-compression-rgtc",
        "ext-frag-depth",
        "ext-shader-texture-lod",
        "ext-sRGB",
        "ext-texture-filter-anisotropic",
        "ext-texture-mirror-clamp-to-edge",
        "oes-standard-derivatives",
        "oes-texture-float-with-canvas",
        "oes-texture-float-with-image-data",
        "oes-texture-float-with-image",
        "oes-texture-float-with-video",
        "oes-texture-float",
        "oes-vertex-array-object",
        "oes-texture-float-linear",
        "oes-texture-half-float-linear",
        "webgl-blend-func-extended",
        "webgl-compressed-texture-astc",
        "webgl-compressed-texture-etc",
        "webgl-compressed-texture-etc1",
        "s3tc-and-rgtc",
        "webgl-compressed-texture-s3tc-srgb",
        "webgl-compressed-texture-size-limit",
        "webgl-draw-buffers",
        "webgl-draw-buffers-framebuffer-unsupported",
        "webgl-multi-draw",
    ],
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/extensions/",
)

webgl_conformance_test(
    name = "limits",
    expected_failures = [
        "gl-line-width",
    ],
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/limits/",
)

webgl_conformance_test(
    name = "manual",
    tags = ["manual"],  # No tests in this prefix
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/manual/",
)

webgl_conformance_test(
    name = "misc",
    expected_failures = [
        "bad-arguments-test",
        "error-reporting",
        "expando-loss",
        "instanceof-test",
        "invalid-passed-params",
        "null-object-behaviour",
        "object-deletion-behaviour",
        "shader-precision-format",
        "webgl-specific",
        "webgl-specific-stencil-settings",
    ],
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/misc/",
)

webgl_conformance_test(
    name = "offscreencanvas",
    # Figure out why this suite never yields the event loop.
    tags = ["manual"],
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/offscreencanvas/",
)

webgl_conformance_test(
    name = "ogles",
    tags = ["manual"],
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/ogles/",
)

webgl_conformance_test(
    name = "programs",
    expected_failures = [
        "get-active-test",
        "gl-bind-attrib-location-test",
        "gl-get-active-uniform",
        "program-handling",
        "program-test",
    ],
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/programs/",
)

webgl_conformance_test(
    name = "reading",
    expected_failures = [
        "read-pixels-test",
    ],
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/reading/",
)

webgl_conformance_test(
    name = "renderbuffers",
    expected_failures = [
        "feedback-loop",
        "framebuffer-object-attachment",
        "framebuffer-test",
        "depth-renderbuffer-initialization",
        "stencil-renderbuffer-initialization",
    ],
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/renderbuffers/",
)

webgl_conformance_test(
    name = "rendering",
    expected_failures = [
        "blending",
        "clear-default-framebuffer-with-scissor-test",
        "color-mask-preserved-during-implicit-clears",
        "draw-elements-out-of-bounds",
        "draw-webgl-to-canvas-2d-repeatedly",
        "gl-drawelements",
        "line-rendering-quality",
        "negative-one-index",
        "out-of-bounds-index-buffers",
        "rendering-sampling-feedback-loop",
        "scissor-rect-repeated-rendering",
    ],
    skips = [
        "clipping-wide-points",  # Flaky on jenkins
        "multisample-corruption",  # Causes abort trap
    ],
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/rendering/",
    timeout_ms = 10000,
)

webgl_conformance_test(
    name = "state",
    expected_failures = [
        "fb-attach-implicit-target-assignment",
        "gl-enum-tests",
        "gl-get-calls",
        "gl-geterror",
        "gl-getstring",
        "gl-object-get-calls",
    ],
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/state/",
)

webgl_conformance_test(
    name = "typedarrays",
    expected_failures = [
        "array-buffer-crash",
        "array-buffer-view-crash",
        "array-unit-tests",
        "data-view-crash",
        "data-view-test",
        "array-large-array-tests",
    ],
    skips = [
        "typed-arrays-in-workers",  # Timeout
    ],
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/typedarrays/",
)

webgl_conformance_test(
    name = "uniforms",
    expected_failures = [
        "gl-uniform-arrays",
        "gl-uniformmatrix4fv",
        "gl-unknown-uniform",
        "null-uniform-location",
    ],
    skips = [
        # Timeouts
        "out-of-bounds-uniform-array-access",
        "uniform-default-values",
        "uniform-values-per-program",
        "uniform-location",
        "uniform-samplers-test",
    ],
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/uniforms/",
)
