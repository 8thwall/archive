load("//reality/app/nae:html-app.bzl", "html_app")

package(default_visibility = ["//visibility:public"])

html_app(
    name = "native-browse",
    custom_package = "com.nianticlabs.apps.client.exploratory.nativebrowse.quest",
    resource_files = glob(["res/**"]),
    shell = "//c8/html-shell/android/quest:html-shell-quest",
    splash_screen = "res/mipmap-xxxhdpi/ic_launcher.png",
    target_compatible_with = [
        "@platforms//os:android",
    ],
    url = "https://threejs.org/examples/webxr_xr_cubes.html",
)
