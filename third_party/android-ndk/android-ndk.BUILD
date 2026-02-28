# This stub rules allows the external repository to load, without adding files
# to the bazel sandbox.

package(default_visibility = ["//visibility:public"])

load(":android-ndk.bzl", "android_ndk_runtime_libraries")

filegroup(
    name = "stub",
    srcs = [],
)

android_ndk_runtime_libraries(target = "armeabi-v7a")

android_ndk_runtime_libraries(target = "arm64-v8a")

android_ndk_runtime_libraries(target = "x86")

android_ndk_runtime_libraries(target = "x86_64")
