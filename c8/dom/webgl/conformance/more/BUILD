load("//c8/dom:webgl-conformance.bzl", "webgl_conformance_test")

TARGET_COMPATIBLE_WITH = select({
    "//c8/pixels/opengl:with-angle": [],
    "//conditions:default": ["@platforms//:incompatible"],
})

webgl_conformance_test(
    name = "conformance",
    skips = [
        "constants",
        "getContext",
        "methods",
        "quickCheckAPI-A",
        "quickCheckAPI-B1",
        "quickCheckAPI-B2",
        "quickCheckAPI-B3",
        "quickCheckAPI-B4",
        "quickCheckAPI-C",
        "quickCheckAPI-D_G",
        "quickCheckAPI-G_I",
        "quickCheckAPI-L_S",
        "quickCheckAPI-S_V",
        "webGLArrays",
    ],
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/more/conformance/",
)

webgl_conformance_test(
    name = "functions",
    skips = [
        "bindBuffer",
        "bindBufferBadArgs",
        "bindFramebufferLeaveNonZero",
        "bufferData",
        "bufferDataBadArgs",
        "bufferSubData",
        "bufferSubDataBadArgs",
        "copyTexImage2D",
        "copyTexImage2DBadArgs",
        "copyTexSubImage2D",
        "copyTexSubImage2DBadArgs",
        "deleteBufferBadArgs",
        "drawArrays",
        "drawElements",
        "isTests",
        "readPixels",
        "readPixelsBadArgs",
        "texImage2D",
        "texImage2DBadArgs",
        "texImage2DHTML",
        "texImage2DHTMLBadArgs",
        "texSubImage2D",
        "texSubImage2DBadArgs",
        "texSubImage2DHTML",
        "texSubImage2DHTMLBadArgs",
        "uniformf",
        "uniformfBadArgs",
        "uniformfArrayLen1",
        "uniformi",
        "uniformiBadArgs",
        "uniformMatrix",
        "uniformMatrixBadArgs",
        "vertexAttrib",
        "vertexAttribBadArgs",
        "vertexAttribPointer",
        "vertexAttribPointerBadArgs",
    ],
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/more/functions/",
    timeout_ms = 10000,
)

webgl_conformance_test(
    name = "glsl",
    tags = ["manual"],  # Timeout
    target_compatible_with = TARGET_COMPATIBLE_WITH,
    test_set = "conformance/more/glsl/",
)
