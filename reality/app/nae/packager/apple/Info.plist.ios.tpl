<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleIdentifier</key>
    <string>$BUNDLE_IDENTIFIER</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleExecutable</key>
    <string>$APP_NAME</string>
    <key>CFBundleIcons</key>
    <dict>
        <key>CFBundlePrimaryIcon</key>
        <dict>
            <key>CFBundleIconFiles</key>
            <array>
                <string>icon-60x60.png</string>
                <string>icon-120x120.png</string>
                <string>icon-180x180.png</string>

                <string>icon-20x20.png</string>
                <string>icon-76x76.png</string>
                <string>icon-152x152.png</string>
                <string>icon-167x167.png</string>

                <string>icon-29x29.png</string>
                <string>icon-58x58.png</string>
                <string>icon-87x87.png</string>

                <string>icon-40x40.png</string>
                <string>icon-80x80.png</string>
            </array>
            <key>CFBundleIconName</key>
            <string>AppIcon</string>
            <key>UIPrerenderedIcon</key>
            <false/> <!-- Set to true if your icons have no rounded corners -->
        </dict>
    </dict>
    <key>UIDeviceFamily</key>
    <array>
        <integer>1</integer> <!-- iPhone and iPod touch -->
        <integer>2</integer> <!-- iPad -->
    </array>
    <key>CFBundleName</key>
    <string>$APP_NAME</string>
    <key>CFBundleShortVersionString</key>
    <string>$VERSION_NAME</string>
    <key>CFBundleVersion</key>
    <string>$VERSION_CODE</string>
    <key>CFBundleDisplayName</key>
    <string>$APP_DISPLAY_NAME</string>
    <key>CFBundleSupportedPlatforms</key>
    <array>
        <string>iPhoneOS</string>
    </array>

    <!-- See https://github.com/godotengine/godot/issues/74154#issuecomment-1450162767 for important keys related to distribution -->
    <key>DTPlatformName</key>
    <string>iphoneos</string>
    <key>DTSDKName</key>
    <string>iphoneos$MIN_OS_VERSION</string> <!-- TODO(lreyna): Decouple SDK version from MinOS Version -->
    <key>DTPlatformVersion</key>
    <string>$MIN_OS_VERSION</string>
    <key>DTPlatformBuild</key> <!-- TODO(lreyna): Get this from Xcode_app/Contents/Developer/Platforms/iPhoneOS.platform/version.plist-->
    <string>22F76</string> <!-- NOTE(lreyna): This is the ios 18.5 SDK build number -->
    <key>DTSDKBuild</key>
    <string>22F76</string>
    <key>DTXcode</key>
    <string>$XCODE_VERSION_NUMBER</string>
    <key>DTXcodeBuild</key>
    <string>$XCODE_BUILD_NUMBER</string>
    <key>UISupportedInterfaceOrientations</key>
    <array>
        $SUPPORTED_INTERFACE_ORIENTATION_ARRAY
    </array>
    <key>MinimumOSVersion</key>
    <string>$MIN_OS_VERSION</string>
    <key>UIRequiredDeviceCapabilities</key>
    <array>
        <string>arm64</string>
    </array>
    <key>UIRequiresFullScreen</key> <!-- NOTE(lreyna): This prevents iPad Multitasking -->
    <true/>
    <key>UILaunchScreen</key>
    <dict>
        <key>UIImageName</key>
        <string>icon-launch-screen.png</string>
    </dict>
    <key>AppUrl</key>
    <string>$HTML_APP_URL</string>
    <key>NaeBuildMode</key>
    <string>$NAE_BUILD_MODE</string>
    <key>CommitId</key>
    <string>$COMMIT_ID</string>
    <key>EncryptedDevCookie</key>
    <string>$ENCRYPTED_DEV_COOKIE</string>
    <key>NiaEnvAccessCode</key>
    <string>$NIA_ENV_ACCESS_CODE</string>
    <key>UIStatusBarHidden</key>
    <$STATUS_BAR_HIDDEN/>
    <key>UIViewControllerBasedStatusBarAppearance</key>
    <false/>
    <key>ITSAppUsesNonExemptEncryption</key>
    <false/>
$PERMISSIONS_XML
</dict>
</plist>
