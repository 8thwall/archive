load("//reality/app/nae:html-app.bzl", "html_app")

package(default_visibility = ["//visibility:public"])

html_app(
    name = "html-app-android-example",
    custom_package = "com.nianticlabs.bzl.htmlapp.example",
    resource_files = glob(["res/**"]),
    target_compatible_with = [
        "@platforms//os:android",  # Only build this rule for Android.
    ],
    url = "https://threejs.org/examples/webgl_morphtargets_horse.html",
)

html_app(
    name = "html-app-android-staging-example",
    custom_package = "com.nianticlabs.bzl.htmlapp.staging.example",
    nia_env_access_code = "abcd1234",
    resource_files = glob(["res/**"]),
    target_compatible_with = [
        "@platforms//os:android",
    ],
    url = "https://studiobeta.staging.8thwall.app/native-dash/",
)

html_app(
    name = "html-app-android-dev-example",
    custom_package = "com.nianticlabs.bzl.htmlapp.dev.example",
    nia_env_access_code = "qeZZEP",  # 6 letter code from https://www-cd.8thwall.com/studiobeta/profile-a-cube/project > Device Authorization
    resource_files = glob(["res/**"]),
    target_compatible_with = [
        "@platforms//os:android",
    ],
    url = "https://master-studiobeta.dev.8thwall.app/profile-a-cube/",
)
