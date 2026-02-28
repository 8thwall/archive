"""
This module defines the runfiles rule and transition config for the HTML shell on Quest.
"""

# buildifier: disable=unused-variable
def _quest_shell_transition_impl(settings, attr):
    return {
        "//command_line_option:platforms": ["//bzl:android_arm64"],
    }

quest_shell_transition = transition(
    implementation = _quest_shell_transition_impl,
    inputs = [],
    outputs = [
        "//command_line_option:platforms",
    ],
)

def _quest_shell_runfiles_impl(ctx):
    return [DefaultInfo(files = depset([ctx.file._quest_shell_library]))]

quest_shell_runfiles = rule(
    implementation = _quest_shell_runfiles_impl,
    attrs = {
        "_quest_shell_library": attr.label(
            default = Label("//c8/html-shell/android/quest:html-shell-quest"),
            allow_single_file = True,
            cfg = quest_shell_transition,
        ),
    },
)
