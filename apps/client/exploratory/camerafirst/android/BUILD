package(default_visibility = ["//visibility:public"])

android_binary(
    name = "camerafirst",
    srcs = glob([
        "*.java",
    ]),
    assets = glob(["assets/**"]),
    assets_dir = "assets",
    custom_package = "com.the8thwall",
    manifest = "AndroidManifest.xml",
    resource_files = glob(["res/**"]),
    deps = [
        "//c8:quaternion-java",
        "//reality/app/xr/android:xr-android-java",
        "//reality/engine/api:reality.capnp-java",
        "//reality/engine/api/request:app.capnp-java",
        "//reality/engine/api/response:features.capnp-java",
        "@androidsdk//com.android.support:percent-25.0.1",
        "@androidsdk//com.android.support:support-v13-25.0.1",
        "@capnproto_java//:capnp-runtime-java",
    ],
)
