use serde::de::DeserializeOwned;
use tauri::{plugin::PluginApi, AppHandle, Runtime};

pub fn init<R: Runtime, C: DeserializeOwned>(
  app: &AppHandle<R>,
  _api: PluginApi<R, C>,
) -> crate::Result<NativeAppExport<R>> {
  Ok(NativeAppExport(app.clone()))
}

/// Access to the NativeAppExport APIs.
pub struct NativeAppExport<R: Runtime>(AppHandle<R>);

impl<R: Runtime> NativeAppExport<R> {
    pub fn vibrate(&self, _pattern: Vec<u32>) -> crate::Result<bool> {
        // Desktop doesn't typically support vibration
        Ok(false)
    }
}
