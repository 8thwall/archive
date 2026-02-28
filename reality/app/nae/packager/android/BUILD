load(
    "//bzl/android:android-version.bzl",
    "ANDROID_BUILD_TOOLS_VERSION",
    "DEFAULT_ANDROID_API_LEVEL",
)

filegroup(
    name = "manifest",
    srcs = ["manifest.xml.tpl"],
    visibility = ["//visibility:public"],
)

filegroup(
    name = "build-android-html-app",
    srcs = ["build-android-html-app.sh"],
    visibility = ["//visibility:public"],
)

genrule(
    name = "android-manifest-merger-jar",
    srcs = ["@android-manifest-merger//file"],
    outs = ["android-manifest-merger.jar"],
    cmd = "cp $(SRCS) $@",
)

genrule(
    name = "android-bundle-tool-jar",
    srcs = ["@android-bundle-tool//file"],
    outs = ["android-bundle-tool.jar"],
    cmd = "cp $(SRCS) $@",
)

genrule(
    name = "linux_aapt2",
    srcs = ["@android-aapt2-linux-jar//file"],
    outs = ["aapt2"],
    cmd = """
    unzip -o $(SRCS) -d $(@D)/aapt2_unarchived &> /dev/null
    chmod +x $(@D)/aapt2_unarchived/aapt2
    mv $(@D)/aapt2_unarchived/aapt2 $(@D)/aapt2
    rm -rf $(@D)/aapt2_unarchived $(SRCS)
    """,
    target_compatible_with = [
        "@platforms//os:linux",
        "@platforms//cpu:x86_64",
    ],
    visibility = ["//visibility:public"],
)

genrule(
    name = "android-html-packager-tools",
    srcs = [
        ":manifest",
        ":android-manifest-merger-jar",
        ":android-bundle-tool-jar",
        "//bzl/android:d8-tool",
        "@androidsdk//:platforms/android-{}/android.jar".format(DEFAULT_ANDROID_API_LEVEL),
        "@bazel_tools//tools/android:debug_keystore",
    ] + select(
        {
            "//bzl/conditions:linux-x86_64": [
                ":linux_aapt2",
            ],
            "//conditions:default": [
                "@androidsdk//:build-tools/{}/aapt2".format(ANDROID_BUILD_TOOLS_VERSION),
            ],
        },
    ),
    outs = [
        "android-html-packager-tools/manifest.xml.tpl",
        "android-html-packager-tools/android-manifest-merger.jar",
        "android-html-packager-tools/android-bundle-tool.jar",
        "android-html-packager-tools/aapt2",
        "android-html-packager-tools/android.jar",
        "android-html-packager-tools/bazel_debug.keystore",
        "android-html-packager-tools/d8",
        "android-html-packager-tools/lib/d8.jar",
    ],
    cmd = """
    mkdir -p "$(@D)/android-html-packager-tools"

    # Copy files while preserving their intended structure
    for src in $(SRCS); do
        case "$$src" in
            */d8.jar)
                cp "$$src" "$(@D)/android-html-packager-tools/lib/"
                ;;
            *)
                cp "$$src" "$(@D)/android-html-packager-tools/"
                ;;
        esac
    done
  """,
    visibility = ["//visibility:public"],
)
