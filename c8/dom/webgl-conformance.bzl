"""
This module defines a Bazel rule for running WebGL conformance tests.
"""

def _webgl_conformance_test_impl(ctx):
    output = ctx.actions.declare_file(ctx.label.name)
    expected_failures_str = ",".join(ctx.attr.expected_failures) if ctx.attr.expected_failures else ""
    ctx.actions.write(
        output = output,
        content = """
set -eu
export RUNFILES_DIR=${{RUNFILES_DIR:-$(realpath $0.runfiles)}}
export TEST_SET="${{TEST_SET:-{test_set}}}"
export WEBGL_TEST_TIMEOUT="${{WEBGL_TEST_TIMEOUT:-{timeout_ms}}}"
export EXPECTED_FAILURES="${{EXPECTED_FAILURES:-{expected_failures}}}"
export SKIPS="{skips}"

export HEADLESS_GL_DEBUG_MODE=1

${{RUNFILES_DIR}}/_main/{test_runner} "$@"
""".format(
            test_runner = ctx.executable._test_runner.short_path,
            test_set = ctx.attr.test_set,
            timeout_ms = ctx.attr.timeout_ms,
            expected_failures = expected_failures_str,
            skips = ",".join(ctx.attr.skips),
        ),
        is_executable = True,
    )
    runfiles = ctx.runfiles([output])
    runfiles = runfiles.merge(ctx.attr._test_runner[DefaultInfo].default_runfiles)
    return [
        DefaultInfo(
            executable = output,
            files = depset([output]),
            runfiles = runfiles,
        ),
        RunEnvironmentInfo(
            environment = {
                "TEST_SET": ctx.attr.test_set,
                "WEBGL_TEST_TIMEOUT": str(ctx.attr.timeout_ms),
            },
        ),
    ]

webgl_conformance_test = rule(
    implementation = _webgl_conformance_test_impl,
    test = True,
    attrs = {
        "expected_failures": attr.string_list(
            mandatory = False,
            doc = "List of expected failing tests",
        ),
        "skips": attr.string_list(
            mandatory = False,
            doc = "Skip tests which are flaky or time out",
        ),
        "test_set": attr.string(
            mandatory = True,
            doc = "Filter to apply to the tests",
        ),
        "timeout_ms": attr.int(
            default = 2000,
            doc = "Timeout for each test in milliseconds",
        ),
        "_test_runner": attr.label(
            default = Label("//c8/dom:webgl-conformance-tests"),
            executable = True,
            cfg = "target",
        ),
    },
)
