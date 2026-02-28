load("//c8/dom:webgl-conformance.bzl", "webgl_conformance_test")

TARGET_COMPATIBLE_WITH = select({
    "//c8/pixels/opengl:with-angle": [],
    "//conditions:default": ["@platforms//:incompatible"],
})

webgl_conformance_test(
    name = "bugs",
    expected_failures = [
        "character-set",
        "essl3-shaders-with-webgl1",
    ],
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/glsl/bugs/",
    timeout_ms = 20000,
)

webgl_conformance_test(
    name = "constructors",
    expected_failures = [
        "glsl-construct-vec-mat-index",
    ],
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/glsl/constructors/",
)

webgl_conformance_test(
    name = "functions",
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/glsl/functions/",
)

webgl_conformance_test(
    name = "implicit",
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/glsl/implicit/",
)

webgl_conformance_test(
    name = "literals",
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/glsl/literals/",
)

webgl_conformance_test(
    name = "matrices",
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/glsl/matrices/",
)

webgl_conformance_test(
    name = "misc",
    expected_failures = [
        "fragcolor-fragdata-invariant",
        "shader-with-257-character-define",
        "shader-with-array-of-structs-containing-arrays",
        "shader-with-dfdx.frag",
        "uniform-location-length-limits",
    ],
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/glsl/misc/",
    timeout_ms = 20000,
)

webgl_conformance_test(
    name = "preprocessor",
    expected_failures = [
        "comments",
    ],
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/glsl/preprocessor/",
)

webgl_conformance_test(
    name = "reserved",
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/glsl/reserved/",
)

webgl_conformance_test(
    name = "samplers",
    tags = ["manual"],  # Segfault
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/glsl/samplers/",
)

webgl_conformance_test(
    name = "variables",
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/glsl/variables/",
)
