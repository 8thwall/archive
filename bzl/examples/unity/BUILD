load("//bzl/macro:strip.bzl", "strip_if_requested")
load("//bzl/unity:unity.bzl", "unity_app", "unity_csharp_dll", "unity_package", "unity_plugin", "unity_project")
load("@bazel_skylib//lib:selects.bzl", "selects")

EXAMPLES_SUPPORTED_UNITY_PLATFORMS = select({
    "@unity-version//:2020.3": [],
    "@unity-version//:2021.3": [],
    "//conditions:default": ["@platforms//:incompatible"],
})

unity_app(
    name = "hello-world",
    project = ":hello-world-unity",
    tags = [
        # Consider deleting this when CI runners have Unity OSX support and iOS builds are working.
        "manual",
    ],
    target_compatible_with = selects.with_or({
        ("//bzl/conditions:osx", "//bzl/conditions:android", "//bzl/conditions:ios"): [
            "@unity-version//:2021.3",
        ],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
)

unity_project(
    name = "hello-world-unity",
    plugins = select(strip_if_requested([":hello-world-plugin"])),
    project_name = "HelloWorld",
    project_relative_path = "hello-world-unity",
)

unity_plugin(
    name = "hello-world-plugin",
    srcs = [
        "HelloWorldPlugin.cs",
    ],
    build_all_target_platforms = False,  # Set to true to build all target_platforms.
    project = "HelloWorldPlugin",
    target_platforms = [
        "//bzl:osx_x86_64",
        "//bzl:osx_arm64",
        "//bzl:android_armv7a",
        "//bzl:android_arm64",
        "//bzl:android_x86_64",
        "//bzl:windows_x86_64",
        "//bzl:ios_arm64",
    ],
    visibility = [
        "//visibility:public",
    ],
    deps = [
        "//bzl/examples:export-methods",
    ],
)

unity_plugin(
    name = "hello-world-plugin-renamed-bundle",
    srcs = [
        "HelloWorldPluginHacked.cs",
    ],
    build_all_target_platforms = False,  # Set to true to build all target_platforms.
    project = "HelloWorldPluginHacked",
    target_platforms = [
        "//bzl:osx_x86_64",
        "//bzl:osx_arm64",
        "//bzl:android_armv7a",
        "//bzl:android_arm64",
        "//bzl:windows_x86_64",
        "//bzl:ios_arm64",
    ],
    visibility = [
        "//visibility:public",
    ],
    deps = [
        "//bzl/examples:export-methods",
    ],
)

unity_package(
    name = "hello-world-plugin-unitypackage",
    package_name = "HelloWorldPlugin",
    srcs = select(strip_if_requested([":hello-world-plugin"])),
    manifest = "HelloWorldPlugin/Editor/HelloWorldPluginManifest.manifest",
    target_compatible_with = EXAMPLES_SUPPORTED_UNITY_PLATFORMS,
    visibility = [
        "//visibility:public",
    ],
)

unity_package(
    name = "hello-world-plugin-renamed-bundle-unitypackage",
    package_name = "HelloWorldPluginHacked",
    srcs = select(strip_if_requested([":hello-world-plugin-renamed-bundle"])),
    manifest = "HelloWorldPlugin/Editor/HelloWorldPluginManifest.manifest",
    nativelib_final_destinations = {
        "HelloWorldPlugin.bundle": "Assets/Just/Another/Place",  # For OSX stuff
        "HelloWorldPluginHacked.dll": "Assets/Just/Another/Place.dll",  # For windows stuff
    },
    target_compatible_with = EXAMPLES_SUPPORTED_UNITY_PLATFORMS,
    target_deps = [":hello-world-plugin-unitypackage"],
    visibility = [
        "//visibility:public",
    ],
)

unity_csharp_dll(
    name = "ADll",
    srcs = [
        "A.cs",
    ],
    target_compatible_with = selects.with_or({
        ("//bzl/conditions:osx", "//bzl/conditions:android", "//bzl/conditions:ios"): [
            "@unity-version//:2021.3",
        ],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
)

unity_csharp_dll(
    name = "BCDll",
    srcs = [
        "B.cs",
        "C.cs",
    ],
    deps = [
        ":ADll",
    ],
)

unity_csharp_dll(
    name = "DDll",
    srcs = [
        "D.cs",
    ],
    deps = [
        ":ADll",
        ":BCDll",
    ],
)
