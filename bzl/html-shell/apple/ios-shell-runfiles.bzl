"""
This module defines the runfiles rule and transition config for the HTML shell on iOS.
"""

# Use this variable to define the minimum iOS version to compile the HTML shell, this is also
# set in the 'ios-min.version' file to be used by post build scripts.
# See https://developer.apple.com/news/upcoming-requirements/ for required SDK versions.

# NOTE(lreyna): This is value should be decoupled from the iphoneos SDK version. That value is
# defined by the platform sdk that's included with xcode.
# See: bzl/crosstool/rustc-wrapper.sh for an example
IOS_SHELL_MIN_VERSION = "17.0"
XCODE_MAJOR_VERSION = "16"

# buildifier: disable=unused-variable
def _ios_shell_transition_impl(settings, attr):
    return {
        "//command_line_option:platforms": ["//bzl:ios_arm64"],
        "//bzl/xcode:ios-min-version": IOS_SHELL_MIN_VERSION,
        "//bzl/xcode:version": XCODE_MAJOR_VERSION,
    }

ios_shell_transition = transition(
    implementation = _ios_shell_transition_impl,
    inputs = [],
    outputs = [
        "//command_line_option:platforms",
        "//bzl/xcode:ios-min-version",
        "//bzl/xcode:version",
    ],
)

def _ios_shell_runfiles_impl(ctx):
    # TODO(lreyna): Remove these version files once the HTML shell has its own plist template,
    # this info doesn't need to be known at an app's build time.
    min_version_file = ctx.actions.declare_file("ios-min.version")
    ctx.actions.write(
        output = min_version_file,
        content = IOS_SHELL_MIN_VERSION,
    )

    xcode_major_version_file = ctx.actions.declare_file("xcode-major.version")
    ctx.actions.write(
        output = xcode_major_version_file,
        content = XCODE_MAJOR_VERSION,
    )

    return [DefaultInfo(files = depset([
        ctx.file._ios_shell_library,
        min_version_file,
        xcode_major_version_file,
    ]))]

ios_shell_runfiles = rule(
    implementation = _ios_shell_runfiles_impl,
    attrs = {
        "_ios_shell_library": attr.label(
            default = Label("//c8/html-shell-tauri:html-shell-ios"),
            allow_single_file = True,
            cfg = ios_shell_transition,
        ),
    },
)
