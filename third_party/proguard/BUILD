licenses(["reciprocal"])

package(default_visibility = ["//visibility:public"])

sh_binary(
    name = "proguard",
    srcs = [
        "proguard.sh",
    ],
    deps = [
        ":proguard-jar",
    ],
)

sh_library(
    name = "proguard-jar",
    srcs = [
        "proguard-5.3.3.jar",
    ],
)
