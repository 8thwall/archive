load("//bzl/apple:objc.bzl", "nia_objc_library")
load("@bazel_skylib//rules:common_settings.bzl", "BuildSettingInfo")
load("//bzl/runfiles:materialize-node-runfiles.bzl", "materialize_node_runfiles")

def _nia_apple_native_binary_impl(ctx):
    app = ctx.actions.declare_directory(ctx.attr.display_name + '.app')
    if ctx.attr.platform != 'ios' and ctx.attr.platform != 'osx':
        fail("Unsupported platform: {}".format(ctx.attr.platform))
    is_ios = ctx.attr.platform == 'ios'

    # We are input a list of assets. We want to to copy them into the app while preserving their
    # folder structure relative to this app. This is a pre-processing step.
    dirname = app.dirname
    assets = []
    for f in ctx.files.assets:
        short_path = f.path.split(dirname)
        if len(short_path) != 2:
            continue
        destination_path = short_path[1].split(f.basename)[0]
        assets.append(str(f.path + ',' + destination_path))

    command_args = {
        'app_path': app.path,
        'binary_path': ctx.files.binary[0].path,
        'binary_app_path': app.path + '/' + ctx.attr.display_name if is_ios else app.path + '/Contents/MacOS/' + ctx.attr.display_name,
        'info_plist_path': ctx.file.info_plist.path,
        'info_plist_app_path': app.path + '/Info.plist' if is_ios else app.path + '/Contents/Info.plist',
        'provisioning_profile_path': ctx.attr.provisioning_profile[BuildSettingInfo].value,
        # https://developer.apple.com/documentation/technotes/tn3125-inside-code-signing-provisioning-profiles#Profile-location
        # - macOS expects to find the profile at MyApp.app/Contents/embedded.provisionprofile.
        # - Other Apple platforms expect to find the profile at MyApp.app/embedded.mobileprovision.
        'provisioning_profile_app_path': app.path + '/embedded.mobileprovision' if is_ios else app.path + '/Contents/embedded.provisionprofile',
        'assets': " ".join(assets),
        'assets_app_path': app.path if is_ios else (app.path + '/Contents/Resources'),
        'certificate': ctx.attr._personal_apple_certificate[BuildSettingInfo].value,
        'entitlements_path': ctx.file.entitlements.path
    }

    command = ""
    if is_ios == False:
        command = """
            mkdir -p {app_path}/Contents/MacOS/
            mkdir -p {app_path}/Contents/Resources/
        """.format(**command_args)
    command += """
        cp {binary_path} {binary_app_path}
        cp {info_plist_path} {info_plist_app_path}
        if [ -n "{provisioning_profile_path}" ] && [ -f "{provisioning_profile_path}" ]; then
            cp "{provisioning_profile_path}" "{provisioning_profile_app_path}"
        fi

        # Copy all assets.
        for asset_tuple in {assets}; do
            asset_path=$(echo $asset_tuple | cut -d ',' -f1)
            destination=$(echo $asset_tuple | cut -d ',' -f2)

            mkdir -p {assets_app_path}/$destination
            cp -L "$asset_path" {assets_app_path}/$destination
        done

        # Sign all files in the app bundle.
        find {app_path} -type file | while read file; do
            codesign --force --verify --sign "{certificate}" "$file"
        done

        # Re-sign the main executable with extra arguments:
        # 1. Sign with entitlements file.
        #    - https://developer.apple.com/forums/thread/129980
        # 2. Sign with --options=runtime.
        #    - https://developer.apple.com/forums/thread/701514
        codesign --force --verify --options=runtime --entitlements {entitlements_path} --sign "{certificate}" {binary_app_path}
    """.format(**command_args)

    ctx.actions.run_shell(
        inputs = ctx.files.binary + ctx.files.assets + [ctx.file.info_plist, ctx.file.entitlements],
        outputs = [app],
        command = command,
    )
    return [
        DefaultInfo(
            files = depset([app]),
        ),
    ]

_nia_apple_native_binary = rule(
    implementation = _nia_apple_native_binary_impl,
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
        "info_plist": attr.label(
            allow_single_file = [".plist"],
            mandatory = True,
        ),
        "entitlements": attr.label(
            allow_single_file = [".plist", ".xcent"],
            mandatory = True,
        ),
        "provisioning_profile": attr.label(
            providers = [BuildSettingInfo],
            default = "@apple-developer-team//:empty-provisioning-profile",
        ),
        "binary": attr.label(
            providers = [CcInfo],
            mandatory = True,
        ),
        "assets": attr.label_list(
            mandatory = True,
        ),
        "_personal_apple_certificate": attr.label(
            providers = [BuildSettingInfo],
            default = "@apple-developer-team//:personal-certificate",
        ),
    },
)

def nia_apple_native_binary(platform, name, display_name, srcs, deps, sdk_frameworks, info_plist, entitlements, assets = [], provisioning_profile = None, **kwargs):
    library = name + '_objc_library'
    binary = name + '_binary'
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
        **kwargs,
    )

    native.cc_binary(
        name = binary,
        deps = [':' + library],
        srcs = [],
        **kwargs,
    )

    _nia_apple_native_binary(
        platform = platform,
        name = name,
        display_name = display_name,
        binary = binary,
        info_plist = info_plist,
        entitlements = entitlements,
        provisioning_profile = provisioning_profile,
        assets = [
            ":{}".format(assets_name),
        ],
        **kwargs,
    )
