"""
This module defines Bazel rules for packaging iOS and OSX native shell applications,
including copying assets, frameworks and zipping the app bundle for further processing.
"""

load("@bazel_skylib//rules:common_settings.bzl", "BuildSettingInfo")
load("//bzl/apple:objc.bzl", "nia_objc_library")
load("//bzl/runfiles:materialize-node-runfiles.bzl", "materialize_node_runfiles")

def _nia_apple_native_shell_impl(ctx):
    if ctx.attr.platform != "ios" and ctx.attr.platform != "osx":
        fail("Unsupported platform: {}".format(ctx.attr.platform))
    is_ios = ctx.attr.platform == "ios"

    out_zip = ctx.actions.declare_file(ctx.attr.display_name + ".zip")
    out_dir = ctx.actions.declare_directory(ctx.attr.display_name)

    # We are input a list of assets. We want to to copy them into the app while preserving their
    # folder structure relative to this app. This is a pre-processing step.
    dirname = out_dir.dirname
    assets = []
    framework_binaries = []
    for f in ctx.files.assets:
        short_path = f.path.split(dirname)
        if len(short_path) != 2:
            continue

        # For binary files, we will copy them into the app as frameworks.
        if f.path.endswith(".node"):
            framework_binaries.append(f.path)
            continue

        destination_path = short_path[1].split(f.basename)[0]
        assets.append(str(f.path + "," + destination_path))

    inputs = ctx.files.binary + ctx.files.assets + [ctx.file._apple_framework_script] + [ctx.file._apple_framework_info_plist_template]

    command_args = {
        "app_path": out_dir.path,
        "binary_path": ctx.files.binary[0].path,
        "binary_app_path": out_dir.path + "/" + ctx.attr.display_name if is_ios else out_dir.path + "/Contents/MacOS/" + ctx.attr.display_name,
        "assets": " ".join(assets),
        "assets_app_path": out_dir.path if is_ios else (out_dir.path + "/Contents/Resources"),
        "framework_binaries": " ".join(framework_binaries),
        "framework_app_path": out_dir.path + "/Frameworks" if is_ios else (out_dir.path + "/Contents/Frameworks"),
        "build_framework_script": ctx.file._apple_framework_script.path,
        "info_plist_framework_template": ctx.file._apple_framework_info_plist_template.path,
        "min_os_version": ctx.attr._ios_min_version[BuildSettingInfo].value if is_ios else ctx.attr._osx_min_version[BuildSettingInfo].value,
    }

    command = ""
    if is_ios == False:
        command = """
            mkdir -p {app_path}/Contents/MacOS/
            mkdir -p {app_path}/Contents/Resources/
        """.format(**command_args)
    command += """
        cp {binary_path} {binary_app_path}

        # Copy all assets.
        for asset_tuple in {assets}; do
            asset_path=$(echo $asset_tuple | cut -d ',' -f1)
            destination=$(echo $asset_tuple | cut -d ',' -f2)

            mkdir -p {assets_app_path}/$destination
            cp -L "$asset_path" {assets_app_path}/$destination
        done

        # Create all frameworks from the binary files.
        for framework_binary in {framework_binaries}; do
            mkdir -p {framework_app_path}
            echo "Building framework for $framework_binary"

            framework_name="$(basename "$framework_binary" .node)"
            framework_output_dir="{framework_app_path}/$framework_name.framework"

            sanitized_framework_name=$(echo "$framework_name" | tr -d '[:punct:]')
            if [[ "$sanitized_framework_name" =~ ^[0-9] ]]; then
                sanitized_framework_name="X$sanitized_framework_name"
            fi

            framework_bundle_id="com.the8thwall.$sanitized_framework_name"

            # TODO(lreyna): Make the following variables configurable.
            framework_version="1.0.0.123"
            framework_version_short="1.0.0"

            {build_framework_script} \
                "$framework_output_dir" \
                "$framework_binary" \
                {info_plist_framework_template} \
                "$framework_name" \
                "$framework_bundle_id" \
                "$framework_version" \
                "$framework_version_short" \
                {min_os_version}
        done
    """.format(**command_args)

    ctx.actions.run_shell(
        inputs = inputs,
        outputs = [out_dir],
        command = command,
    )

    ctx.actions.run_shell(
        inputs = [out_dir],
        outputs = [out_zip],
        command = "cd {dir} && zip -r ../{zip_name} .".format(
            dir = out_dir.path,
            dir_name = out_dir.basename,
            zip_name = out_zip.basename,
        ),
    )

    return [
        DefaultInfo(
            files = depset([out_zip]),
        ),
    ]

_nia_apple_native_shell = rule(
    implementation = _nia_apple_native_shell_impl,
    attrs = {
        "platform": attr.string(
            mandatory = True,
        ),
        "srcs": attr.label_list(
            allow_files = True,
        ),
        "display_name": attr.string(
            mandatory = True,
        ),
        "binary": attr.label(
            providers = [CcInfo],
            mandatory = True,
        ),
        "assets": attr.label_list(
            mandatory = True,
        ),
        "_apple_framework_info_plist_template": attr.label(
            default = Label("//bzl/apple:info-plist-framework-template"),
            allow_single_file = True,
        ),
        "_apple_framework_script": attr.label(
            default = Label("//bzl/apple:build-apple-framework"),
            allow_single_file = True,
            executable = True,
            cfg = "exec",
        ),
        "_ios_min_version": attr.label(
            default = Label("//bzl/xcode:ios-min-version"),
            providers = [BuildSettingInfo],
        ),
        "_osx_min_version": attr.label(
            default = Label("//bzl/xcode:osx-min-version"),
            providers = [BuildSettingInfo],
        ),
    },
)

def nia_apple_native_shell(platform, name, display_name, srcs, deps, sdk_frameworks, assets = [], **kwargs):
    """Creates a .zip file containing the necessary files for an iOS or OSX app.

    Specifically, we will build and then zip:
        - The app executable.
        - The app node runfiles, i.e. the javascript and node native modules.

    This rule is used as a dependency for html_app(), which will unzip these files, add the missing
    files (e.g. the Info.plist file and any other assets), package the app, and then sign it.

    Args:
      platform: The target platform, either "ios" or "osx".
      name: The name of the Bazel target.
      display_name: The display name for the app bundle.
      srcs: List of source files for the Objective-C library.
      deps: List of dependencies for the Objective-C library.
      sdk_frameworks: List of SDK frameworks to link against.
      assets: List of asset targets to include in the app bundle.
      **kwargs: Additional keyword arguments passed to underlying rules.
    """
    library = name + "_objc_library"
    binary = name + "_binary"
    assets_name = name + "_assets_impl"

    materialize_node_runfiles(
        name = assets_name,
        deps = assets,
        wasm_deps = [],
    )

    nia_objc_library(
        name = library,
        srcs = srcs,
        deps = deps,
        sdk_frameworks = sdk_frameworks,
        alwayslink = 1,
        **kwargs
    )

    native.cc_binary(
        name = binary,
        deps = [":" + library],
        srcs = [],
        **kwargs
    )

    _nia_apple_native_shell(
        platform = platform,
        name = name,
        display_name = display_name,
        binary = binary,
        assets = [
            ":{}".format(assets_name),
        ],
        **kwargs
    )
