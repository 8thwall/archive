"""
This module defines the runfiles rule and transition config for the HTML shell on Android.
"""

# buildifier: disable=unused-variable
def _android_shell_transition_impl(settings, attr):
    return {
        "//command_line_option:platforms": ["//bzl:android_arm64"],
        "//c8/pixels/opengl:angle": True,
    }

android_shell_transition = transition(
    implementation = _android_shell_transition_impl,
    inputs = [],
    outputs = [
        "//command_line_option:platforms",
        "//c8/pixels/opengl:angle",
    ],
)

def _android_shell_runfiles_impl(ctx):
    return [DefaultInfo(files = depset([ctx.file._android_shell_library]))]

android_shell_runfiles = rule(
    implementation = _android_shell_runfiles_impl,
    attrs = {
        "_android_shell_library": attr.label(
            default = Label("//c8/html-shell/android/android:html-shell-android"),
            allow_single_file = True,
            cfg = android_shell_transition,
        ),
    },
)
