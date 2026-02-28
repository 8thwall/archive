filegroup(
    name = "info-plist-template",
    srcs = [] + select({
        "@niantic//bzl/conditions:ios": ["Info.plist.ios.tpl"],
        "@niantic//bzl/conditions:osx": ["Info.plist.osx.tpl"],
        "//conditions:default": ["Info.plist.osx.tpl"],
    }),
    visibility = ["//visibility:public"],
)

filegroup(
    name = "info-plist-template-ios",
    srcs = ["Info.plist.ios.tpl"],
    visibility = ["//visibility:public"],
)

filegroup(
    name = "info-plist-template-osx",
    srcs = ["Info.plist.osx.tpl"],
    visibility = ["//visibility:public"],
)

filegroup(
    name = "entitlements-template",
    srcs = [] + select({
        "@niantic//bzl/conditions:ios": ["Entitlements.plist.ios.tpl"],
        "@niantic//bzl/conditions:osx": ["Entitlements.plist.osx.tpl"],
        "//conditions:default": ["Entitlements.plist.osx.tpl"],
    }),
    visibility = ["//visibility:public"],
)

filegroup(
    name = "entitlements-template-ios",
    srcs = ["Entitlements.plist.ios.tpl"],
    visibility = ["//visibility:public"],
)

filegroup(
    name = "entitlements-template-osx",
    srcs = ["Entitlements.plist.osx.tpl"],
    visibility = ["//visibility:public"],
)

filegroup(
    name = "build-apple-html-app",
    srcs = ["build-apple-html-app.sh"],
    visibility = ["//visibility:public"],
)

filegroup(
    name = "rcodesign",
    srcs = select({
        "@niantic//bzl/conditions:osx-arm64": ["@apple-codesign-osx-arm64//:rcodesign_bin"],
        "@niantic//bzl/conditions:osx-x86_64": ["@apple-codesign-osx-x86_64//:rcodesign_bin"],
        "@niantic//bzl/conditions:linux-x86_64": ["@apple-codesign-linux-x86_64//:rcodesign_bin"],
        "//conditions:default": [],
    }),
    target_compatible_with = select({
        "//bzl/conditions:linux-x86_64": [],
        "//bzl/conditions:osx": [],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    visibility = ["//visibility:public"],
)

genrule(
    name = "apple-html-packager-tools",
    srcs = [
        ":info-plist-template-ios",
        ":info-plist-template-osx",
        ":entitlements-template-ios",
        ":entitlements-template-osx",
        ":rcodesign",
    ],
    outs = [
        "apple-html-packager-tools/Info.plist.ios.tpl",
        "apple-html-packager-tools/Info.plist.osx.tpl",
        "apple-html-packager-tools/Entitlements.plist.ios.tpl",
        "apple-html-packager-tools/Entitlements.plist.osx.tpl",
        "apple-html-packager-tools/rcodesign",
    ],
    cmd = """
        mkdir -p "$(@D)/apple-html-packager-tools"
        cp $(SRCS) "$(@D)/apple-html-packager-tools"
    """,
    visibility = ["//visibility:public"],
)
