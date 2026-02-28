"""
This module defines rules and implementations for building HTML apps
targeting Android and Apple platforms using Bazel.
"""

load("@bazel_skylib//rules:common_settings.bzl", "BuildSettingInfo")
load(
    "//bzl/android:android-version.bzl",
    "ANDROID_BUILD_TOOLS_VERSION",
    "DEFAULT_ANDROID_API_LEVEL",
)

def _android_html_app_impl(ctx):
    if ctx.attr.android_output_artifact != "apk" and ctx.attr.android_output_artifact != "aab":
        fail("Unsupported output artifact type: {}. Should be 'apk' or 'aab'".format(ctx.attr.android_output_artifact))

    java_runtime = ctx.toolchains["@bazel_tools//tools/jdk:toolchain_type"].java.java_runtime
    app_out = ctx.actions.declare_file("{}.{}".format(ctx.label.name, ctx.attr.android_output_artifact))
    shell_lib = ctx.files.shell[0]
    manifest_merger_jar = ctx.file._android_manifest_merger_jar

    # Join the file paths with a comma separator to allow them to all be one argument.
    resource_file_paths = ",".join([file.path for file in ctx.files.resource_files])

    # Access the values passed via --define
    version_code = ctx.var.get("version_code", str(ctx.attr.version_code))
    version_name = ctx.var.get("version_name", ctx.attr.version_name)
    min_sdk_version = ctx.var.get("android_min_sdk_version", ctx.attr.android_min_sdk_version)
    target_sdk_version = ctx.var.get("android_target_sdk_version", ctx.attr.android_target_sdk_version)
    keystore_path = ctx.var.get("android_keystore", ctx.file.android_keystore.path)
    keystore_alias = ctx.var.get("android_keystore_key_alias", ctx.attr.android_keystore_key_alias)
    keystore_password = ctx.var.get("android_keystore_password", ctx.attr.android_keystore_password)

    jarsigner_executable = java_runtime.java_home + "/bin/jarsigner"

    screen_orientation = ctx.attr.screen_orientation
    if shell_lib.path.endswith("quest.aar"):
        screen_orientation = "landscape"

    d8_executable_path = [f for f in ctx.files._android_d8 if f.basename == "d8"][0].path

    inputs = [
        ctx.file._android_platform_jar,
        ctx.file._android_aapt2_binary,
        manifest_merger_jar,
        ctx.file._android_bundletool_jar,
        shell_lib,
        ctx.file._android_manifest_template,
        ctx.file.android_keystore,
    ] + ctx.files._android_d8 + ctx.files.resource_files + ctx.files.splash_screen + ctx.files.manifest + java_runtime.files.to_list()
    arguments = [
        app_out.path,
        java_runtime.java_executable_exec_path,
        ctx.file._android_platform_jar.path,
        ctx.file._android_aapt2_binary.path,
        manifest_merger_jar.path,
        ctx.file._android_bundletool_jar.path,
        shell_lib.path,
        ctx.file._android_manifest_template.path,
        ctx.attr.url,
        ctx.attr.custom_package,
        str(min_sdk_version),
        str(target_sdk_version),
        resource_file_paths,
        keystore_path,
        ctx.attr.nia_env_access_code,
        "",  # DevCookie String - Not needed for bazel builds
        ctx.file.splash_screen.path if ctx.file.splash_screen else "",
        keystore_alias,
        keystore_password,
        version_code,
        version_name,
        "",  # TODO: Add HTTP Cache Path
        ctx.file.manifest.path if ctx.file.manifest else "",
        ctx.attr.commit_id,
        "hot-reload",
        jarsigner_executable,
        # We don't allow setting the temp_dir today like we do in reality/app/nae/packager/html-app-packager.ts,
        # which sets it by env variable.
        "",
        screen_orientation,
        "true" if ctx.attr.status_bar_visible else "false",
        d8_executable_path,
        ",".join(ctx.attr.app_permissions),
        "",  # NOTE(lreyna): Custom App Permissions Description Not Implemented
    ]

    ctx.actions.run(
        inputs = inputs,
        outputs = [app_out],
        progress_message = "Building Android HTML app",
        executable = ctx.file.packager_script,
        arguments = arguments,
    )

    return [
        DefaultInfo(files = depset([app_out])),
    ]

def _apple_html_app_impl(ctx, platform):
    if ctx.attr.apple_certificate[BuildSettingInfo].value == "":
        fail("No Apple certificate was provided")

    shell_lib = ctx.files.shell[0]
    if platform == "ios":
        app_out = ctx.actions.declare_file("{}.ipa".format(ctx.attr.name))
    elif platform == "osx":
        app_out = ctx.actions.declare_directory("{}.app".format(ctx.attr.name))
    else:
        fail("Unsupported shell library for Apple HTML app: {}".format(platform))

    minimum_os_version = (
        ctx.attr._ios_min_version[BuildSettingInfo].value if platform == "ios" else ctx.attr._osx_min_version[BuildSettingInfo].value
    )

    # Join the file paths with a comma separator to allow them to all be one argument.
    resource_file_paths = ",".join([file.path for file in ctx.files.resource_files])

    # Access the values passed via --define
    version_code = ctx.var.get("version_code", str(ctx.attr.version_code))
    version_name = ctx.var.get("version_name", ctx.attr.version_name)

    inputs = [
        shell_lib,
        ctx.file._apple_entitlements_template,
        ctx.file._apple_info_plist_template,
    ] + ctx.files.resource_files

    interface_orientation_array = ""
    if platform == "ios":
        if ctx.attr.screen_orientation == "portrait":
            interface_orientation_array = "<string>UIInterfaceOrientationPortrait</string>"
        elif ctx.attr.screen_orientation == "landscape":
            interface_orientation_array = "<string>UIInterfaceOrientationLandscapeLeft</string>"
        else:
            fail("Unsupported screen orientation: {}".format(ctx.attr.screen_orientation))

    arguments = [
        app_out.path,
        shell_lib.path,
        ctx.attr.url,
        ctx.attr.custom_package,
        ctx.attr.apple_team_identifier,
        ctx.attr.name,
        version_code,
        version_name,

        # Should sign:
        "true",
        ctx.file._apple_entitlements_template.path,
        ctx.file._apple_info_plist_template.path,
        ctx.attr.apple_provisioning_profile[BuildSettingInfo].value,
        ctx.attr.apple_certificate[BuildSettingInfo].value,
        platform,
        minimum_os_version,
        resource_file_paths,
        "",  # TODO(lreyna): Add HTTP Cache Path
        ctx.attr.commit_id,
        # NOTE(lreyna): We force the build mode to "hot-reload", since bazel builds do not fetch
        # the app assets, so static builds are not possible.
        "hot-reload",
        "",  # DevCookie String - Not needed for bazel builds
        ctx.attr.apple_app_display_name if ctx.attr.apple_app_display_name else ctx.attr.name,
        ctx.attr._xcode[BuildSettingInfo].value,
        interface_orientation_array,

        # TODO(lreyna): Add support for Rust Codesign, if needed. Having the following fields, empty
        # will default to the legacy codesign method.
        "",  # Rust Codesign Binary Path
        "",  # p12 file used for Rust Codesign
        "",  # p12 password used for Rust Codesign
        ctx.attr.nia_env_access_code,
        ",".join(ctx.attr.app_permissions),
        "",  # NOTE(lreyna): Custom App Permissions Description Not Implemented
        "true" if ctx.attr.status_bar_visible else "false",
    ]
    ctx.actions.run(
        inputs = inputs,
        outputs = [app_out],
        progress_message = "Building Apple HTML app",
        executable = ctx.file.packager_script,
        arguments = arguments,
    )

    return [
        DefaultInfo(files = depset([app_out])),
    ]

def _html_app_impl(ctx):
    os_android = ctx.attr._os_android[platform_common.ConstraintValueInfo]
    os_ios = ctx.attr._os_ios[platform_common.ConstraintValueInfo]
    os_osx = ctx.attr._os_osx[platform_common.ConstraintValueInfo]

    # Validate arguments.
    if ctx.attr.nia_env_access_code:
        if ".staging.8thwall." not in ctx.attr.url and ".dev.8thwall." not in ctx.attr.url:
            fail("The nia_env_access_code will only be used if .staging.8thwall. or .dev.8thwall. is in the URL")
    if not ctx.attr.custom_package:
        fail("custom_package is required")

    # Check the platform of the shell target, and call the appropriate implementation.
    if ctx.target_platform_has_constraint(os_android):
        return _android_html_app_impl(ctx)
    elif ctx.target_platform_has_constraint(os_ios):
        return _apple_html_app_impl(ctx, "ios")
    elif ctx.target_platform_has_constraint(os_osx):
        return _apple_html_app_impl(ctx, "osx")
    else:
        fail("Unsupported target platform: {}".format(ctx.fragments.platform.platform))

_html_app = rule(
    implementation = _html_app_impl,
    toolchains = [
        "@bazel_tools//tools/jdk:toolchain_type",
    ],
    attrs = {
        "shell": attr.label(mandatory = True),
        "url": attr.string(default = ""),
        "resource_files": attr.label_list(allow_files = True, default = []),
        "version_code": attr.int(default = 1),
        "version_name": attr.string(default = "1.0.0"),
        "nia_env_access_code": attr.string(default = ""),
        "custom_package": attr.string(default = ""),
        "manifest": attr.label(allow_single_file = True, default = None),
        "splash_screen": attr.label(allow_single_file = True, default = None),
        "packager_script": attr.label(
            mandatory = True,
            allow_single_file = True,
            executable = True,
            cfg = "exec",
        ),
        "commit_id": attr.string(default = ""),
        "screen_orientation": attr.string(default = "portrait"),
        "status_bar_visible": attr.bool(default = True),
        "app_permissions": attr.string_list(default = []),

        # Android configuration:
        "android_output_artifact": attr.string(default = "apk"),
        "android_min_sdk_version": attr.int(default = 32),
        "android_target_sdk_version": attr.int(default = 32),
        "android_keystore": attr.label(
            default = Label("@bazel_tools//tools/android:debug_keystore"),
            allow_single_file = True,
            cfg = "exec",
        ),
        "android_keystore_key_alias": attr.string(default = "androiddebugkey"),
        "android_keystore_password": attr.string(default = "pass:android"),
        "_android_manifest_merger_jar": attr.label(
            default = Label("@android-manifest-merger//file"),
            allow_single_file = True,
            cfg = "exec",
        ),
        "_android_manifest_template": attr.label(
            default = Label("//reality/app/nae/packager/android:manifest"),
            allow_single_file = True,
            cfg = "exec",
        ),
        "_android_bundletool_jar": attr.label(
            default = Label("@android-bundle-tool//file"),
            allow_single_file = True,
            cfg = "exec",
        ),
        "_android_aapt2_binary": attr.label(
            default = Label("@androidsdk//:build-tools/{}/aapt2".format(ANDROID_BUILD_TOOLS_VERSION)),
            allow_single_file = True,
            cfg = "exec",
        ),
        "_android_d8": attr.label_list(
            default = [Label("//bzl/android:d8-tool")],
            cfg = "exec",
        ),
        "_android_platform_jar": attr.label(
            default = Label("@androidsdk//:platforms/android-{}/android.jar".format(DEFAULT_ANDROID_API_LEVEL)),
            allow_single_file = True,
            cfg = "exec",
        ),

        # Apple configuration:
        "_apple_info_plist_template": attr.label(
            default = Label("//reality/app/nae/packager/apple:info-plist-template"),
            allow_single_file = True,
        ),
        "_apple_entitlements_template": attr.label(
            default = Label("//reality/app/nae/packager/apple:entitlements-template"),
            allow_single_file = True,
        ),
        # TODO(paris): We'll need a way to use the team identifier, certificate, and provisioning profile
        # that Studio users / CI machines specify.
        "apple_team_identifier": attr.string(
            default = "",
        ),
        "apple_certificate": attr.label(
            providers = [BuildSettingInfo],
            default = "@apple-developer-team//:empty-personal-certificate",
        ),
        "apple_provisioning_profile": attr.label(
            providers = [BuildSettingInfo],
            default = "@apple-developer-team//:empty-provisioning-profile",
        ),
        "apple_app_display_name": attr.string(
            default = "",
        ),

        # Platform compatibility:
        "_os_android": attr.label(
            default = "@platforms//os:android",
            providers = [platform_common.ConstraintValueInfo],
        ),
        "_os_ios": attr.label(
            default = "@platforms//os:ios",
            providers = [platform_common.ConstraintValueInfo],
        ),
        "_os_osx": attr.label(
            default = "@platforms//os:osx",
            providers = [platform_common.ConstraintValueInfo],
        ),
        "_ios_min_version": attr.label(
            default = Label("//bzl/xcode:ios-min-version"),
            providers = [BuildSettingInfo],
        ),
        "_osx_min_version": attr.label(
            default = Label("//bzl/xcode:osx-min-version"),
            providers = [BuildSettingInfo],
        ),
        "_xcode": attr.label(
            default = Label("//bzl/xcode:version"),
            providers = [BuildSettingInfo],
        ),
    },
)

def html_app(
        name,
        url = "",
        nia_env_access_code = None,
        shell = None,
        custom_package = None,
        android_output_artifact = None,
        android_min_sdk_version = None,
        android_target_sdk_version = None,
        android_keystore = None,
        android_keystore_key_alias = None,
        android_keystore_password = None,
        app_permissions = None,
        manifest = None,
        splash_screen = None,
        target_compatible_with = None,
        resource_files = [],
        version_code = None,
        version_name = None,
        apple_team_identifier = None,
        apple_certificate = None,
        apple_provisioning_profile = None,
        apple_app_display_name = None,
        commit_id = None,
        screen_orientation = None,
        status_bar_visible = None):
    """Builds an HTML app for a specific platform.

    Args:
      name (string): Target name. Outputs will preserve their original names.
      url (string): The URL the resulting app should fetch, at runtime.
      nia_env_access_code (string): The access code to use when building the application
        only when .staging.8thwall. or .dev.8thwall. is part of the url.
      shell (Label): The HTML shell target to use when building the application.
      custom_package (string): The package name to use.
      android_output_artifact (string): The output artifact type. Can be "apk" or "aab".
      android_keystore (Label): The keystore to use for signing the Android app.
      android_keystore_key_alias (string): The alias for the keystore.
      android_keystore_password (string): The password for the keystore.
      app_permissions (list of string): The permissions required by the app.
      manifest (Label): The manifest file to merge for the Android app.
      splash_screen (Label): The splash screen image to use for the Android app.
      target_compatible_with (list of Label): List of platforms this rule is compatible with.
      resource_files (list of File): List of resource files to include in the app.
      version_code (int): The version code to use for the Android app.
      version_name (string): The version name to use for the Android app.
      apple_team_identifier (string): The team identifier to use for signing the Apple app.
      apple_certificate (Label): The certificate to use for signing the Apple app.
      apple_provisioning_profile (Label): The provisioning profile to use for signing the Apple app.
      apple_app_display_name (string): The display name of the Apple app.
      android_min_sdk_version (int): The minimum SDK version for the Android app.
      android_target_sdk_version (int): The target SDK version for the Android app.
      commit_id (string): The commit ID to associate with the build.
      screen_orientation (string): The orientation of the app, e.g., "portrait", "landscape", etc.
      status_bar_visible (bool): Whether system insets (status bar, navigation bar) are visible.
    """

    if not shell:
        shell = select({
            "@niantic//bzl/conditions:android": Label("//c8/html-shell/android/android:html-shell-android"),
            "@niantic//bzl/conditions:osx": Label("//c8/html-shell-tauri:html-shell-osx"),
            "@niantic//bzl/conditions:ios": Label("//c8/html-shell-tauri:html-shell-ios"),
            "//conditions:default": None,
        })

    _html_app(
        name = name,
        shell = shell,
        url = url,
        nia_env_access_code = nia_env_access_code,
        custom_package = custom_package,
        android_output_artifact = android_output_artifact,
        android_min_sdk_version = android_min_sdk_version,
        android_target_sdk_version = android_target_sdk_version,
        android_keystore = android_keystore,
        android_keystore_key_alias = android_keystore_key_alias,
        android_keystore_password = android_keystore_password,
        app_permissions = app_permissions,
        manifest = manifest,
        splash_screen = splash_screen,
        resource_files = resource_files,
        version_code = version_code,
        version_name = version_name,
        packager_script = select({
            "@niantic//bzl/conditions:android": Label("//reality/app/nae/packager/android:build-android-html-app"),
            "@niantic//bzl/conditions:apple": Label("//reality/app/nae/packager/apple:build-apple-html-app"),
            "//conditions:default": None,
        }),
        target_compatible_with = target_compatible_with,
        apple_team_identifier = apple_team_identifier,
        apple_certificate = apple_certificate,
        apple_provisioning_profile = apple_provisioning_profile,
        apple_app_display_name = apple_app_display_name,
        commit_id = commit_id,
        screen_orientation = screen_orientation,
        status_bar_visible = status_bar_visible,
    )
