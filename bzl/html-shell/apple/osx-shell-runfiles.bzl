"""
This module defines the runfiles rule and transition config for the HTML shell on OSX.
"""

# Use this variable to define the minimum OSX version to compile the HTML shell, this is also
# set in the 'osx-min.version' file to be used by post build scripts.
OSX_SHELL_MIN_VERSION = "11.0"
XCODE_MAJOR_VERSION = "16"

# buildifier: disable=unused-variable
def _osx_shell_transition_impl(settings, attr):
    return {
        "//command_line_option:platforms": ["//bzl:osx_arm64"],
        "//bzl/xcode:osx-min-version": OSX_SHELL_MIN_VERSION,
        "//bzl/xcode:version": XCODE_MAJOR_VERSION,
    }

osx_shell_transition = transition(
    implementation = _osx_shell_transition_impl,
    inputs = [],
    outputs = [
        "//command_line_option:platforms",
        "//bzl/xcode:osx-min-version",
        "//bzl/xcode:version",
    ],
)

def _osx_shell_runfiles_impl(ctx):
    min_version_file = ctx.actions.declare_file("osx-min.version")
    ctx.actions.write(
        output = min_version_file,
        content = OSX_SHELL_MIN_VERSION,
    )

    xcode_major_version_file = ctx.actions.declare_file("xcode-major.version")
    ctx.actions.write(
        output = xcode_major_version_file,
        content = XCODE_MAJOR_VERSION,
    )

    return [DefaultInfo(files = depset([
        ctx.file._osx_shell_library,
        min_version_file,
        xcode_major_version_file,
    ]))]

osx_shell_runfiles = rule(
    implementation = _osx_shell_runfiles_impl,
    attrs = {
        "_osx_shell_library": attr.label(
            default = Label("//c8/html-shell-tauri:html-shell-osx"),
            allow_single_file = True,
            cfg = osx_shell_transition,
        ),
    },
)
