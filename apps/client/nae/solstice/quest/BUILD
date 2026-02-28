load("//bzl/js:js.bzl", "js_cli")
load("//reality/app/nae:html-app.bzl", "html_app")

package(default_visibility = ["//visibility:public"])

html_app(
    name = "solstice",
    custom_package = "com.the8thwall.solstice",
    nia_env_access_code = "moonshot",
    resource_files = glob(["res/**"]),
    shell = "//c8/html-shell/android/quest:html-shell-quest",
    splash_screen = "res/mipmap-xxxhdpi/ic_launcher.png",
    target_compatible_with = [
        "@platforms//os:android",
    ],
    url = "https://niantic.staging.8thwall.app/intothescaniverse/",
    version_code = 1,
    version_name = "0.0.0.0",
)

html_app(
    name = "solstice-release-staging",
    custom_package = "com.the8thwall.intothescaniverse",
    nia_env_access_code = "moonshot",
    resource_files = glob(["res/**"]),
    shell = "//c8/html-shell/android/quest:html-shell-quest",
    splash_screen = "res/mipmap-xxxhdpi/ic_launcher.png",
    target_compatible_with = [
        "@platforms//os:android",
    ],
    url = "https://niantic.staging.8thwall.app/intothescaniverse/",
)

html_app(
    name = "solstice-release-prod",
    custom_package = "com.the8thwall.intothescaniverse",
    resource_files = glob(["res/**"]),
    shell = "//c8/html-shell/android/quest:html-shell-quest",
    splash_screen = "res/mipmap-xxxhdpi/ic_launcher.png",
    target_compatible_with = [
        "@platforms//os:android",
    ],
    url = "https://www.intothescaniverse.com/",
)

js_cli(
    name = "fetch-version",
    esnext = 1,
    main = [
        "fetch-version.ts",
    ],
    npm_rule = "@npm-rendering//:npm-rendering",
    target = "node",
    deps = [
        "//bzl/js:fetch",
        "//c8/cli:args",
        "//c8/dom:staging-access",
    ],
)
