use tauri::{
  plugin::{Builder, TauriPlugin},
  Manager, Runtime,
};

#[cfg(desktop)]
mod desktop;
#[cfg(mobile)]
mod mobile;

mod error;
mod commands;

pub use error::{Error, Result};

#[cfg(desktop)]
use desktop::NativeAppExport;
#[cfg(mobile)]
use mobile::NativeAppExport;

/// Extensions to [`tauri::App`], [`tauri::AppHandle`] and [`tauri::Window`] to access the NativeAppExport APIs.
pub trait NativeAppExportExt<R: Runtime> {
  fn native_app_export(&self) -> &NativeAppExport<R>;
}

impl<R: Runtime, T: Manager<R>> crate::NativeAppExportExt<R> for T {
  fn native_app_export(&self) -> &NativeAppExport<R> {
    self.state::<NativeAppExport<R>>().inner()
  }
}

/// Initializes the native app export plugin.
pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("native-app-export")
        .invoke_handler(tauri::generate_handler![
          commands::vibrate
        ])
        .setup(|app, api| {
            #[cfg(mobile)]
            let native_app_export = mobile::init(app, api)?;
            #[cfg(desktop)]
            let native_app_export = desktop::init(app, api)?;
            app.manage(native_app_export);
            Ok(())
        })
        .build()
}
