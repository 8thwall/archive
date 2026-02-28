load("//reality/app/nae:html-app.bzl", "html_app")

package(default_visibility = ["//visibility:public"])

html_app(
    name = "catch-the-stack",
    custom_package = "com.the8thwall.catchthestack",
    manifest = "AndroidManifest.xml",
    resource_files = glob(["res/**"]),
    target_compatible_with = [
        "@platforms//os:android",
    ],
    # To run a dev app, this value from from https://www-cd.8thwall.com/8w/catch-the-stack/project
    # under Mobile Browser -> Token. To run a staging app, use the staging password. Prod apps do
    # not require an access code.
    # nia_env_access_code = "",
    url = "https://8w.8thwall.app/catch-the-stack",
)
