# NOTE(dat) : All files used for this dll has to be available as srcs
# You cannot deps on : windows - funcs and export all symbols.If you do, only the
# Compilation Unit that has DllMain will have its symbol in the final dll.
# TODO(dat) : Fix multi - compilation - unit dllexport issue on Windows
cc_binary(
    name = "hello.dll",
    srcs = [
        "dll-lib2.cc",
        "dll-main.cc",
    ],
    linkshared = 1,
    linkstatic = 1,
    target_compatible_with = select({
        "@niantic//bzl/conditions:windows": [],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    deps = [
        "//c8:symbol-visibility",
    ],
)
