licenses(["permissive"])  # Public Domain

package(
    default_visibility = [
        "//third_party/zxing:__subpackages__",
    ],
)

cc_library(
    name = "big-integer",
    srcs = [
        "BigInteger.cc",
    ],
    hdrs = [
        "BigInteger.hh",
    ],
    deps = [
        ":big-unsigned",
    ],
)

cc_library(
    name = "big-integer-algorithms",
    srcs = [
        "BigIntegerAlgorithms.cc",
    ],
    hdrs = [
        "BigIntegerAlgorithms.hh",
    ],
    deps = [
        ":big-integer",
    ],
)

cc_library(
    name = "big-integer-library",
    srcs = [
    ],
    hdrs = [
        "BigIntegerLibrary.hh",
    ],
    deps = [
        ":big-integer",
        ":big-integer-algorithms",
        ":big-integer-utils",
        ":big-unsigned",
        ":big-unsigned-in-a-base",
        ":numberlike-array",
    ],
)

cc_library(
    name = "big-integer-utils",
    srcs = [
        "BigIntegerUtils.cc",
    ],
    hdrs = [
        "BigIntegerUtils.hh",
    ],
    deps = [
        ":big-integer",
        ":big-unsigned-in-a-base",
    ],
)

cc_library(
    name = "big-unsigned",
    srcs = [
        "BigUnsigned.cc",
    ],
    hdrs = [
        "BigUnsigned.hh",
    ],
    deps = [
        ":numberlike-array",
    ],
)

cc_library(
    name = "big-unsigned-in-a-base",
    srcs = [
        "BigUnsignedInABase.cc",
    ],
    hdrs = [
        "BigUnsignedInABase.hh",
    ],
    deps = [
        ":big-unsigned",
        ":numberlike-array",
    ],
)

cc_library(
    name = "numberlike-array",
    srcs = [
    ],
    hdrs = [
        "NumberlikeArray.hh",
    ],
    deps = [
    ],
)
