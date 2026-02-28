filegroup(
    name = "lws_configs",
    srcs = select({
        "@niantic//bzl/conditions:android": [
            "android/lws_config.h",
            "android/lws_config_private.h",
        ],
        "@niantic//bzl/conditions:ios": [
            "ios/lws_config.h",
            "lws_config_private.h",
        ],
        "@platforms//os:windows": [
            "windows/lws_config.h",
            "windows/lws_config_private.h",
        ],
        "//conditions:default": [
            "lws_config.h",
            "lws_config_private.h",
        ],
    }),
    visibility = ["//visibility:public"],
)
