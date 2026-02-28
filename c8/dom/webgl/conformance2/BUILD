load("//c8/dom:webgl-conformance.bzl", "webgl_conformance_test")

TARGET_COMPATIBLE_WITH = select({
    "//c8/pixels/opengl:with-angle": [],
    "//conditions:default": ["@platforms//:incompatible"],
})

webgl_conformance_test(
    name = "attribs",
    expected_failures = [
        "gl-bindAttribLocation-aliasing-inactive",
        "invalid-vertex-attribs",
    ],
    tags = ["manual"],  # Flaky on jenkins
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance2/attribs/",
)

webgl_conformance_test(
    name = "buffers",
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance2/buffers/",
)

webgl_conformance_test(
    name = "canvas",
    expected_failures = [
        "to-data-url-with-pack-params",
    ],
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance2/canvas/",
)

webgl_conformance_test(
    name = "context",
    expected_failures = [
        "constants-and-properties-2",
        "context-attributes-depth-stencil-antialias-obeyed",
        "incorrect-context-object-behaviour",
        "methods-2",
    ],
    tags = ["manual"],  # Flaky on jenkins
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance2/context/",
)

webgl_conformance_test(
    name = "extensions",
    expected_failures = [
        "ext-color-buffer-float",
        "ext-color-buffer-half-float",
        "ext-render-snorm",
        "ext-texture-filter-anisotropic",
        "promoted-extensions-in-shaders",
        "nv-shader-noperspective-interpolation",
        "webgl-blend-func-extended",
        "webgl-multi-draw-instanced-base-vertex-base-instance",
        "webgl-render-shared-exponent",
        "webgl-stencil-texturing",
    ],
    skips = [
        "oes-draw-buffers-indexed",  # Timeout
    ],
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance2/extensions/",
    timeout_ms = 10000,
)

webgl_conformance_test(
    name = "glsl3",
    expected_failures = [
        "array-equality",
        "attrib-location-length-limits",
        "shader-with-1024-character-identifier.frag",
        "uniform-location-length-limits",
        "vector-dynamic-indexing",
    ],
    tags = ["manual"],  # Flaky on jenkins
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance2/glsl3/",
)

webgl_conformance_test(
    name = "misc",
    expected_failures = [
        "blend-integer",
        "expando-loss-2",
        "instanceof-test",
        "null-object-behaviour-2",
        "object-deletion-behaviour-2",
        "views-with-offsets",
    ],
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance2/misc/",
    timeout_ms = 20000,
)

webgl_conformance_test(
    name = "offscreencanvas",
    # Figure out why this suite never yields the event loop.
    tags = ["manual"],
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance2/offscreencanvas/",
)

webgl_conformance_test(
    name = "programs",
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance2/programs/",
)

webgl_conformance_test(
    name = "query",
    expected_failures = [
        "query",
    ],
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance2/query/",
    timeout_ms = 10000,
)

webgl_conformance_test(
    name = "reading",
    expected_failures = [
        "format-r11f-g11f-b10f",
        "read-pixels-from-fbo-test",
        "read-pixels-into-pixel-pack-buffer",
    ],
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance2/reading/",
)

webgl_conformance_test(
    name = "renderbuffers",
    expected_failures = [
        "framebuffer-object-attachment",
        "framebuffer-test",
        "framebuffer-texture-layer",
        "invalidate-framebuffer",
        "multisampled-depth-renderbuffer-initialization",
        "multisampled-stencil-renderbuffer-initialization",
        "readbuffer",
    ],
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance2/renderbuffers/",
)

webgl_conformance_test(
    name = "rendering",
    expected_failures = [
        "attrib-type-match",
        "blitframebuffer-filter-outofbounds",
        "blitframebuffer-multisampled-readbuffer",
        "blitframebuffer-outside-readbuffer",
        "blitframebuffer-resolve-to-back-buffer",
        "blitframebuffer-size-overflow",
        "blitframebuffer-stencil-only",
        "blitframebuffer-test",
        "clearbufferfv-with-alpha-false",
        "clear-func-buffer-type-match",
        "clear-srgb-color-buffer",
        "depth-stencil-feedback-loop",
        "draw-buffers",
        "draw-buffers-dirty-state-bug",
        "draw-buffers-sparse-output-locations",
        "element-index-uint",
        "framebuffer-completeness-draw-framebuffer",
        "framebuffer-mismatched-attachment-targets",
        "framebuffer-render-to-layer",
        "framebuffer-texture-level1",
        "framebuffer-unsupported",
        "fs-color-type-mismatch-color-buffer-type",
        "instanced-arrays",
        "multisampling-depth-resolve",
        "out-of-bounds-index-buffers-after-copying",
        "rasterizer-discard-and-implicit-clear",
        "uniform-block-buffer-size",
        "vertex-id",
    ],
    skips = [
        "clearbuffer-sub-source",  # Abort trap
        "draw-buffers-driver-hang",  # Bus error
        "read-draw-when-missing-image",  # Bus error
    ],
    tags = ["manual"],  # Flaky on jenkins
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance2/rendering/",
    timeout_ms = 10000,
)

webgl_conformance_test(
    name = "samplers",
    expected_failures = [
        "samplers",
        "sampler-drawing-test",
    ],
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance2/samplers/",
)

webgl_conformance_test(
    name = "state",
    expected_failures = [
        "gl-enum-tests",
        "gl-object-get-calls",
    ],
    tags = ["manual"],  # Flaky on jenkins
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance2/state/",
)

webgl_conformance_test(
    name = "sync",
    expected_failures = [
        "sync-webgl-specific",
    ],
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance2/sync/",
)

webgl_conformance_test(
    name = "transform_feedback",
    expected_failures = [
        "transform_feedback",
        "too-small-buffers",
        "same-buffer-two-binding-points",
        "simultaneous_binding",
        "switching-objects",
    ],
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance2/transform_feedback/",
)

webgl_conformance_test(
    name = "uniforms",
    expected_failures = [
        "gl-uniform-arrays-sub-source",
        "incompatible-texture-type-for-sampler",
    ],
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance2/uniforms/",
    timeout_ms = 4000,
)

webgl_conformance_test(
    name = "vertex_arrays",
    expected_failures = [
        "vertex-array-object",
    ],
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance2/vertex_arrays/",
)

webgl_conformance_test(
    name = "wasm",
    expected_failures = [
        "readpixels-16gb-wasm-memory",
        "teximage2d-16gb-wasm-memory",
        "texsubimage2d-16gb-wasm-memory",
        "bufferdata-16gb-wasm-memory",
        "buffersubdata-16gb-wasm-memory",
        "getbuffersubdata-16gb-wasm-memory",
    ],
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance2/wasm/",
)
