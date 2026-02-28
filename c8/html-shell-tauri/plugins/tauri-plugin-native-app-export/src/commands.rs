use tauri::{command, Runtime};
use crate::{NativeAppExportExt, Result};

#[command]
pub fn vibrate<R: Runtime>(
    app: tauri::AppHandle<R>,
    pattern: Vec<u32>,
) -> Result<bool> {
    app.native_app_export().vibrate(pattern)
}
