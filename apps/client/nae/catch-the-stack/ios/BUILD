load("//reality/app/nae:html-app.bzl", "html_app")

package(default_visibility = ["//visibility:public"])

html_app(
    name = "catch-the-stack",
    apple_app_display_name = "Catch the Stack",
    apple_certificate = "@apple-developer-team//:personal-certificate",
    apple_provisioning_profile = "@apple-developer-team//:wildcard-development",
    apple_team_identifier = "<REMOVED_BEFORE_OPEN_SOURCING>",
    custom_package = "com.the8thwall.catchthestack",
    resource_files = glob(["res/**"]),
    target_compatible_with = select({
        "@apple-developer-team//:wildcard-development-and-personal-certificate": [
            "@platforms//os:ios",
        ],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    url = "https://8w.8thwall.app/catch-the-stack",
)

html_app(
    name = "catch-the-stack-staging",
    apple_app_display_name = "Catch the Stack (Staging)",
    apple_certificate = "@apple-developer-team//:personal-certificate",
    apple_provisioning_profile = "@apple-developer-team//:wildcard-development",
    apple_team_identifier = "<REMOVED_BEFORE_OPEN_SOURCING>",
    custom_package = "com.the8thwall.catchthestack.staging",
    nia_env_access_code = "password",
    resource_files = glob(["res/**"]),
    target_compatible_with = select({
        "@apple-developer-team//:wildcard-development-and-personal-certificate": [
            "@platforms//os:ios",
        ],
        "//conditions:default": ["@platforms//:incompatible"],
    }),
    url = "https://8w.staging.8thwall.app/catch-the-stack/",
)
