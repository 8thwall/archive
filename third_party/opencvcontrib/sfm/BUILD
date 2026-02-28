licenses(["permissive"])

cc_library(
    name = "sfm",
    srcs = glob([
        "src/**/*.cc",
        "src/**/*.cpp",
        "src/**/*.h",
        "src/**/*.hpp",
        "include/**/*.h",
        "include/**/*.hpp",
    ]),
    hdrs = [
        "include/opencv2/sfm.hpp",
    ],
    copts = [
        "-DCERES_FOUND",
        "-Wno-ignored-qualifiers",
    ],
    includes = [
        "",
        "include",
        "src/libmv_light",
    ],
    licenses = ["permissive"],
    visibility = ["//visibility:public"],
    deps = [
        "@ceres",
        "@ceres//:miniglog",
        "@eigen3",
        "@opencv//:core",
        "@opencv//:features2d",
    ],
)
