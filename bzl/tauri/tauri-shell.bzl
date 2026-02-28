"""
This rule will build a Tauri shell using the @tauri-apps/cli npm package.
"""

# TODO(paris): Map from Bazel dbg/fastbuild/opt flags to cargo/tauri cli flags.
def _tauri_shell_impl(ctx):
    if ctx.attr.platform != "ios":
        fail("Unsupported platform: {}".format(ctx.attr.platform))

    out_executable = ctx.actions.declare_file(ctx.label.name)
    out_zip = ctx.actions.declare_file(ctx.label.name + ".zip")

    inputs = depset(
        direct =
            [f for src in ctx.attr.srcs for f in src.files.to_list()] +
            ctx.files._rust_stdlib_exec +
            ctx.files._rust_stdlib_target +
            ctx.files._npm_tauri_shell +
            [
                ctx.file._node_bin,
                ctx.file._cargo_bin,
                ctx.file._rustc_bin,
                ctx.executable._tauri_cli_bin,
            ],
    )

    # We change into the tauri source code directory for building. So here we compute the relative
    # path to the root of the workspace for use in the tool paths.
    depth = 0 if not ctx.label.package else len(ctx.label.package.split("/"))
    rel_to_root = "" if depth == 0 else "/".join([".."] * depth) + "/"

    # Get the sysroot dirs. We take the provided file and go up two directories to get the directory
    # right above aarch64-apple-darwin / aarch64-apple-ios / etc. Then we can copy that directory
    # into the combined sysroot for the host and target platforms.
    def get_sysroot_dir(files):
        sysroot = files.to_list()[0].dirname
        return "/".join(sysroot.split("/")[:-2])

    exec_sysroot_dir = get_sysroot_dir(ctx.attr._rust_stdlib_exec.files)
    target_sysroot_dir = get_sysroot_dir(ctx.attr._rust_stdlib_target.files)

    compilation_mode = "release" if ctx.var.get("COMPILATION_MODE") == "opt" else "debug"

    command = """
        # Add our tools to the PATH.
        export PATH="$PATH:{node_dir}:{cargo_dir}"

        WORKING_DIR=$(pwd)

        # Override the cargo directories to be within the Bazel sandbox.
        export CARGO_HOME="$WORKING_DIR/cargo_home"
        export CARGO_TARGET_DIR="$WORKING_DIR/cargo_target"

        # Change to the tauri source code directory.
        cd {tauri_src_dir}

        # This is a workaround to support what seems like a bug when compiling for iOS. The rustc
        # version we use, i.e. _rustc_bin, uses `cfg = "exec"` is built for the host platform. If
        # you look in the tools dir, e.g. /private/var/tmp/_bazel_<name>/<id>/external/rust_darwin_aarch64__aarch64-apple-darwin__stable_tools/lib/rustlib/
        # you'll see it contains aarch64-apple-darwin. We would have expected it to also contain
        # aarch64-apple-ios because in rust_register_toolchains() we specify aarch64-apple-ios as an
        # extra target, but it is not present. It's also strange because running
        # "$RUSTC --print target-libdir --target aarch64-apple-ios" gives you
        # /private/var/tmp/_bazel_<name>/<id>/external/rust_darwin_aarch64__aarch64-apple-darwin__stable_tools/lib/rustlib/aarch64-apple-ios/lib
        # but that path doesn't exist. So to workaround this, we explicitly copy the host stdlib and
        # the target (i.e. iOS) stdlib into a new combined sysroot, which we then use for the build.
        # The exact build error in this case is:
        #   error[E0463]: can't find crate for `core`
        #   |
        #   = note: the `aarch64-apple-ios` target may not be installed
        #   = help: consider downloading the target with `rustup target add aarch64-apple-ios`
        #
        # Note that if you change _rustc_bin to not have `cfg = "exec"`, then the build will fail
        # because the host stdlib is missing. I.e. we will have aarch64-apple-ios available under
        # `$RUSTC --print sysroot`, but not aarch64-apple-darwin. And we need the host to build Rust
        # files like build.rs. The exact build error in this case is:
        #   error[E0463]: can't find crate for `std`
        #   |
        #   = note: the `aarch64-apple-darwin` target may not be installed
        #   = help: consider downloading the target with `rustup target add aarch64-apple-darwin`
        COMBINED_SYSROOT="$WORKING_DIR/combined_sysroot"
        rsync -a "{exec_sysroot_dir}" "$COMBINED_SYSROOT/lib"
        rsync -a "{target_sysroot_dir}" "$COMBINED_SYSROOT/lib"
        export RUSTFLAGS="--sysroot=$COMBINED_SYSROOT ${{RUSTFLAGS:-}}"

        # Build the Tauri app.
        # TODO(paris): Add support for other platforms.
        {tauri_path} build --target aarch64-apple-ios --ci --no-bundle {debug_flag}

        # Change back to the working directory and copy the output executable.
        cd $WORKING_DIR
        cp "$WORKING_DIR/cargo_target/aarch64-apple-ios/{compilation_mode}/{product_name}" "{output_file}"
    """.format(
        node_dir = rel_to_root + ctx.file._node_bin.dirname,
        cargo_dir = rel_to_root + ctx.file._cargo_bin.dirname,
        tauri_path = rel_to_root + ctx.executable._tauri_cli_bin.path,
        tauri_src_dir = ctx.label.package,
        exec_sysroot_dir = rel_to_root + exec_sysroot_dir,
        target_sysroot_dir = rel_to_root + target_sysroot_dir,
        product_name = ctx.attr.product_name,
        output_file = out_executable.path,
        debug_flag = "--{}".format(compilation_mode) if compilation_mode == "debug" else "",
        compilation_mode = compilation_mode,
    )

    ctx.actions.run_shell(
        inputs = inputs,
        outputs = [out_executable],
        command = command,
        tools = [
            ctx.file._node_bin,
            ctx.file._cargo_bin,
            ctx.file._rustc_bin,
            ctx.executable._tauri_cli_bin,
        ],
        progress_message = "Building Tauri Shell",
        env = {
            "RUSTC": rel_to_root + ctx.file._rustc_bin.path,
        },
    )

    ctx.actions.run_shell(
        inputs = [out_executable],
        outputs = [out_zip],
        command = "zip -j {zip_path} {file_path}".format(
            zip_path = out_zip.path,
            file_path = out_executable.path,
        ),
    )

    return [
        DefaultInfo(files = depset([out_zip])),
    ]

tauri_shell = rule(
    implementation = _tauri_shell_impl,
    attrs = {
        "product_name": attr.string(
            mandatory = True,
            doc = "The name of the app. Should be the productName from tauri.conf.json.",
        ),
        "platform": attr.string(
            mandatory = True,
            doc = "The platform to build for.",
        ),
        "srcs": attr.label_list(
            mandatory = True,
            doc = "List of tauri project files.",
        ),
        "_node_bin": attr.label(
            allow_single_file = True,
            cfg = "exec",
            default = "@nodejs_host//:node_bin",
            executable = True,
        ),
        "_cargo_bin": attr.label(
            allow_single_file = True,
            cfg = "exec",
            default = "@rules_rust//rust/toolchain:current_cargo_files",
        ),
        "_rustc_bin": attr.label(
            allow_single_file = True,
            cfg = "exec",
            default = "@rules_rust//rust/toolchain:current_rustc_files",
        ),
        "_npm_tauri_shell": attr.label(
            default = Label("@npm-tauri-shell//:npm-tauri-shell"),
        ),
        "_tauri_cli_bin": attr.label(
            executable = True,
            cfg = "exec",
            allow_single_file = True,
            default = (
                "@npm-tauri-shell//:node_modules/.bin/tauri"
            ),
        ),
        # This provides the stdlib files for the host platform. On OSX Arm64, these will be under
        # /private/var/tmp/_bazel_<your_name>/<id>/external/rust_darwin_aarch64__aarch64-apple-darwin__stable_tools.
        # They are needed when building Rust code because some Rust code uses the host platform's
        # stdlib, i.e. build.rs files.
        "_rust_stdlib_exec": attr.label(
            cfg = "exec",
            default = "@rules_rust//rust/toolchain:current_rust_stdlib_files",
        ),
        # This provides the stdlib files for the target platform. When building for iOS, these will
        # be under /private/var/tmp/_bazel_<your_named>/<id>/external/rust_darwin_aarch64__aarch64-apple-ios__stable_tools.
        "_rust_stdlib_target": attr.label(
            default = "@rules_rust//rust/toolchain:current_rust_stdlib_files",
        ),
    },
)
