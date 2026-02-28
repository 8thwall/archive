load("//c8/dom:webgl-conformance.bzl", "webgl_conformance_test")

TARGET_COMPATIBLE_WITH = select({
    "//c8/pixels/opengl:with-angle": [],
    "//conditions:default": ["@platforms//:incompatible"],
})

webgl_conformance_test(
    name = "misc",
    expected_failures = [
        "compressed-tex-image",
        "copy-tex-image-2d-formats",
        "cube-incomplete-fbo",
        "exif-orientation",
        "format-filterable-renderable",
        "gl-teximage",
        "origin-clean-conformance",
        "origin-clean-conformance-offscreencanvas",
        "tex-image-webgl",
        "tex-image-with-format-and-type",
        "tex-image-with-invalid-data",
        "tex-input-validation",
        "tex-sub-image-2d-bad-args",
        "tex-video-using-tex-unit-non-zero",
        "texparameter-test",
        "texture-attachment-formats",
        "texture-copying-feedback-loops",
        "texture-corner-case-videos",
        "texture-fakeblack",
        "texture-formats-test",
        "texture-mips",
        "texture-npot-video",
        "texture-npot",
        "texture-size-limit",
        "texture-srgb-upload",
        "texture-upload-size",
        "texture-video-transparent",
        "upload-from-srcset-with-empty-data",
        "video-rotation",
        "png-image-types",
    ],
    skips = [
        "gl-get-tex-parameter",  # Flaky
    ],
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/textures/misc/",
    timeout_ms = 10000,
)

webgl_conformance_test(
    name = "canvas",
    expected_failures = [
        "tex-2d-rgb-rgb-unsigned_byte",
        "tex-2d-rgb-rgb-unsigned_short_5_6_5",
        "tex-2d-rgba-rgba-unsigned_short_4_4_4_4",
        "tex-2d-rgba-rgba-unsigned_short_5_5_5_1",
        "tex-2d-luminance-luminance-unsigned_byte",
        "tex-2d-alpha-alpha-unsigned_byte",
        "tex-2d-luminance_alpha-luminance_alpha-unsigned_byte",
    ],
    skips = [
        "tex-2d-rgba-rgba-unsigned_byte",  # Flaky
    ],
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/textures/canvas/",
)

webgl_conformance_test(
    name = "canvas_sub_rectangle",
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/textures/canvas_sub_rectangle/",
)

webgl_conformance_test(
    name = "image",
    expected_failures = [
        "tex-2d-rgb-rgb-unsigned_byte",
        "tex-2d-rgb-rgb-unsigned_short_5_6_5",
        "tex-2d-rgba-rgba-unsigned_byte",
        "tex-2d-rgba-rgba-unsigned_short_4_4_4_4",
        "tex-2d-rgba-rgba-unsigned_short_5_5_5_1",
        "tex-2d-luminance-luminance-unsigned_byte",
        "tex-2d-alpha-alpha-unsigned_byte",
        "tex-2d-luminance_alpha-luminance_alpha-unsigned_byte",
    ],
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/textures/image/",
)

webgl_conformance_test(
    name = "image_data",
    expected_failures = [
        "tex-2d-rgb-rgb-unsigned_byte",
        "tex-2d-rgb-rgb-unsigned_short_5_6_5",
        "tex-2d-rgba-rgba-unsigned_short_4_4_4_4",
        "tex-2d-rgba-rgba-unsigned_short_5_5_5_1",
        "tex-2d-luminance-luminance-unsigned_byte",
        "tex-2d-luminance_alpha-luminance_alpha-unsigned_byte",
    ],
    skips = [
        "tex-2d-alpha-alpha-unsigned_byte",  # Flaky
        "tex-2d-rgba-rgba-unsigned_byte",  # Flaky
    ],
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/textures/image_data/",
)

webgl_conformance_test(
    name = "svg_image",
    skips = [
        "tex-2d-rgb-rgb-unsigned_byte",
        "tex-2d-rgb-rgb-unsigned_short_5_6_5",
        "tex-2d-rgba-rgba-unsigned_byte",
        "tex-2d-rgba-rgba-unsigned_short_4_4_4_4",
        "tex-2d-rgba-rgba-unsigned_short_5_5_5_1",
        "tex-2d-luminance-luminance-unsigned_byte",
        "tex-2d-alpha-alpha-unsigned_byte",
        "tex-2d-luminance_alpha-luminance_alpha-unsigned_byte",
    ],
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/textures/svg_image/",
    timeout_ms = 10000,
)

webgl_conformance_test(
    name = "video",
    expected_failures = [
        "tex-2d-rgb-rgb-unsigned_byte",
        "tex-2d-rgb-rgb-unsigned_short_5_6_5",
        "tex-2d-rgba-rgba-unsigned_byte",
        "tex-2d-rgba-rgba-unsigned_short_4_4_4_4",
        "tex-2d-rgba-rgba-unsigned_short_5_5_5_1",
        "tex-2d-luminance-luminance-unsigned_byte",
        "tex-2d-alpha-alpha-unsigned_byte",
        "tex-2d-luminance_alpha-luminance_alpha-unsigned_byte",
    ],
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/textures/video/",
)

webgl_conformance_test(
    name = "webgl_canvas",
    expected_failures = [
        "tex-2d-rgb-rgb-unsigned_short_5_6_5",
        "tex-2d-rgba-rgba-unsigned_byte",
        "tex-2d-rgba-rgba-unsigned_short_4_4_4_4",
        "tex-2d-rgba-rgba-unsigned_short_5_5_5_1",
        "tex-2d-luminance-luminance-unsigned_byte",
        "tex-2d-alpha-alpha-unsigned_byte",
        "tex-2d-luminance_alpha-luminance_alpha-unsigned_byte",
    ],
    skips = [
        "tex-2d-rgb-rgb-unsigned_byte",
    ],
    tags = ["manual"],  # Flaky on jenkins
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/textures/webgl_canvas/",
)

webgl_conformance_test(
    name = "image_bitmap_from_image_data",
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/textures/image_bitmap_from_image_data/",
)

webgl_conformance_test(
    name = "image_bitmap_from_image",
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/textures/image_bitmap_from_image/",
)

webgl_conformance_test(
    name = "image_bitmap_from_video",
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/textures/image_bitmap_from_video/",
)

webgl_conformance_test(
    name = "image_bitmap_from_canvas",
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/textures/image_bitmap_from_canvas/",
)

webgl_conformance_test(
    name = "image_bitmap_from_blob",
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/textures/image_bitmap_from_blob/",
)

webgl_conformance_test(
    name = "image_bitmap_from_image_bitmap",
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/textures/image_bitmap_from_image_bitmap/",
)
