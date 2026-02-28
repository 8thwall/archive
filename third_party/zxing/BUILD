licenses(["permissive"])  # Apache 2.0

cc_library(
    name = "zxing",
    srcs = glob([
        "bigint/**/*.cc",
        "bigint/**/*.hh",
        "win32/**/*.h",
        "win32/**/*.c",
        "zxing/**/*.cc",
        "zxing/**/*.cpp",
    ]),
    hdrs = glob([
        "zxing/**/*.h",
    ]),
    copts = [
        "-Wno-unused-const-variable",
        "-Wno-unused-variable",
    ],
    includes = [
        "",
    ],
    licenses = ["permissive"],
    visibility = ["//visibility:public"],
    deps = [
    ],
)
