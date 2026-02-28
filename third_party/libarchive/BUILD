exports_files(["libarchive-3.4.0.patch"])

cc_library(
    name = "config",
    hdrs = select({
        "@niantic//bzl/conditions:windows": [
            "windows/config.h",
        ],
        "//conditions:default": [
            "default/config.h",
        ],
    }),
    includes = select({
        "@niantic//bzl/conditions:windows": [
            "windows",
        ],
        "//conditions:default": [
            "default",
        ],
    }),
    visibility = [
        "@libarchive//:__pkg__",
    ],
)
