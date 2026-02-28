const COMMANDS: &[&str] = &["vibrate"];

fn main() {
    tauri_plugin::Builder::new(COMMANDS)
        .ios_path("ios")
        .global_api_script_path("./api-iife.js")
        .build();
}
