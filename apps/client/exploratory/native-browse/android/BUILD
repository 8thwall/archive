load("//reality/app/nae:html-app.bzl", "html_app")

package(default_visibility = ["//visibility:public"])

html_app(
    name = "native-browse",
    custom_package = "com.nianticlabs.apps.client.exploratory.nativebrowse.android",
    resource_files = glob(["res/**"]),
    target_compatible_with = [
        "@platforms//os:android",
    ],
    url = "https://threejs.org/examples/webgl_morphtargets_horse.html",
)
