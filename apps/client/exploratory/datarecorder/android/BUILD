package(default_visibility = ["//visibility:public"])

android_binary(
    name = "data-recorder",
    srcs = glob([
        "*.java",
    ]),
    assets = glob(["assets/**"]),
    assets_dir = "assets",
    custom_package = "com.the8thwall.DataRecorder",
    manifest = "AndroidManifest.xml",
    resource_files = glob(["res/**"]),
    deps = [
        "//reality/app/disk:xr-disk-java",
        "//reality/app/sensors/arcore:arcore-sensor",
        "//reality/app/xr/android:xr-android-java",
        "//reality/app/xr/common:xr-extern-java",
        "//reality/engine/api:reality.capnp-java",
        "//reality/engine/api/request:app.capnp-java",
        "@androidsdk//com.android.support:percent-25.0.1",
        "@capnproto_java//:capnp-runtime-java",
    ],
)
