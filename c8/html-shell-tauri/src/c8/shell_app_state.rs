use serde::Serialize;
use once_cell::sync::Lazy;

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ShellAppState {
    pub app_url: Option<String>,
    pub app_name: Option<String>,
    pub app_display_name: Option<String>,
    pub nae_build_mode: Option<String>,
    pub platform: String,
    pub use_fullscreen: Option<bool>,
    pub nia_env_access_code: Option<String>,
    pub encrypted_dev_cookie: Option<String>,
}

impl ShellAppState {
    pub fn new() -> Self {
        #[cfg(any(target_os = "ios", target_os = "macos"))]
        {
            Self::from_info_plist()
        }

        #[cfg(not(any(target_os = "ios", target_os = "macos")))]
        {
            Self::default_config()
        }
    }

    #[cfg(any(target_os = "ios", target_os = "macos"))]
    fn from_info_plist() -> Self {
        Self {
            app_url: crate::c8::info_plist::get_info_plist_value("AppUrl"),
            app_name: crate::c8::info_plist::get_info_plist_value("CFBundleExecutable"),
            app_display_name: crate::c8::info_plist::get_info_plist_value("CFBundleDisplayName"),
            nae_build_mode: crate::c8::info_plist::get_info_plist_value("NaeBuildMode"),
            platform: std::env::consts::OS.to_string(),
            use_fullscreen: crate::c8::info_plist::get_info_plist_bool("UseFullscreen"),
            nia_env_access_code: crate::c8::info_plist::get_info_plist_value("NiaEnvAccessCode"),
            encrypted_dev_cookie: crate::c8::info_plist::get_info_plist_value("EncryptedDevCookie"),
        }
    }

    #[cfg(not(any(target_os = "ios", target_os = "macos")))]
    fn default_config() -> Self {
        Self {
            app_url: None,
            app_name: None,
            app_display_name: None,
            nae_build_mode: None,
            platform: std::env::consts::OS.to_string(),
            use_fullscreen: None,
            nia_env_access_code: None,
            encrypted_dev_cookie: None,
        }
    }
}

// NOTE: We use lazy here, so SHELL_APP_STATE is only initialized once
pub static SHELL_APP_STATE: Lazy<ShellAppState> = Lazy::new(ShellAppState::new);

#[tauri::command]
pub fn get_shell_app_state() -> ShellAppState {
    SHELL_APP_STATE.clone()
}
