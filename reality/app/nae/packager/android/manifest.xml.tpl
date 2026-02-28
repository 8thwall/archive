<?xml version="1.0" encoding="utf-8"?>
<!-- TODO(alvinp): The package name should be parameterized. -->
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="$HTML_APP_PACKAGE"
    android:installLocation="auto"
    android:versionCode="$VERSION_CODE"
    android:versionName="$VERSION_NAME" >

    <uses-sdk
        android:minSdkVersion="$MIN_SDK_VERSION"
        android:targetSdkVersion="$TARGET_SDK_VERSION" />

    <!-- TODO(alvinp): The app name and icon should be parameterized. -->
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:hasCode="$HAS_DEX_FILE"
        android:supportsRtl="true"
        android:theme="@style/AppTheme"
        android:debuggable="$DEBUGGABLE">
        <activity
            android:name="android.app.NativeActivity"
            android:screenOrientation="$SCREEN_ORIENTATION"
            android:launchMode="singleTask">
        </activity>
      <meta-data android:name="app_url" android:value="$HTML_APP_URL" />
      <meta-data android:name="nia_env_access_code" android:value="$NIA_ENV_ACCESS_CODE" />
      <meta-data android:name="encrypted_dev_cookie" android:value="$ENCRYPTED_DEV_COOKIE" />
      <meta-data android:name="com.oculus.ossplash" android:value="$OCULUS_SPLASH_SCREEN_ENABLED" />
      <meta-data android:name="nae_build_mode" android:value="$NAE_BUILD_MODE" />
      <meta-data android:name="commit_id_at_app_build_time" android:value="$COMMIT_ID" />
      <meta-data android:name="status_bar_visible" android:value="$STATUS_BAR_VISIBLE" />
    </application>

</manifest>
