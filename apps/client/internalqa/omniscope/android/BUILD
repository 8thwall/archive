package(default_visibility = ["//visibility:public"])

android_binary(
    name = "omniscope",
    srcs = glob([
        "*.java",
    ]),
    assets = glob(["assets/**"]),
    assets_dir = "assets",
    custom_package = "com.the8thwall",
    manifest = "AndroidManifest.xml",
    resource_files = glob(["res/**"]),
    deps = [
        "//apps/client/internalqa/omniscope/android/bridge:xr-android-java",
        "@androidsdk//com.android.support:percent-25.0.1",
        "@androidsdk//com.android.support:support-v13-25.0.1",
    ],
)
