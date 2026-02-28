use serde::de::DeserializeOwned;
use tauri::{
  plugin::{PluginApi, PluginHandle},
  AppHandle, Runtime,
};

#[cfg(target_os = "ios")]
tauri::ios_plugin_binding!(init_plugin_native_app_export);

pub fn init<R: Runtime, C: DeserializeOwned>(
    _app: &AppHandle<R>,
    api: PluginApi<R, C>
) -> crate::Result<NativeAppExport<R>> {
    #[cfg(target_os = "ios")]
    let handle = api.register_ios_plugin(init_plugin_native_app_export)?;
    Ok(NativeAppExport(handle))
}

pub struct NativeAppExport<R: Runtime>(PluginHandle<R>);

impl<R: Runtime> NativeAppExport<R> {
    pub fn vibrate(&self, pattern: Vec<u32>) -> crate::Result<bool> {
        self.0
            .run_mobile_plugin("vibrate", pattern)
            .map_err(Into::into)
    }
}
