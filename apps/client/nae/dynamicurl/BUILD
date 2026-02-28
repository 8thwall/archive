load("//reality/app/nae:html-app.bzl", "html_app")

package(default_visibility = ["//visibility:public"])

html_app(
    name = "dynamicurl-quest",
    custom_package = "com.the8thwall.dynamicurl.quest",
    resource_files = glob(["res/**"]),
    shell = "//c8/html-shell/android/quest:html-shell-quest",
    splash_screen = "res/mipmap-xxxhdpi/ic_launcher.png",
    target_compatible_with = [
        "@platforms//os:android",
    ],
)

html_app(
    name = "dynamicurl-android",
    custom_package = "com.the8thwall.dynamicurl.android",
    resource_files = glob(["res/**"]),
    target_compatible_with = [
        "@platforms//os:android",
    ],
)
