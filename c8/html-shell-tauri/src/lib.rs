mod c8;

use url::Url;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_cors_fetch::init())
        .plugin(tauri_plugin_native_app_export::init())
        .invoke_handler(tauri::generate_handler![
            c8::shell_app_state::get_shell_app_state,
        ])
        .register_asynchronous_uri_scheme_protocol("the8thwall", |_ctx, request, responder| {
            // NOTE(lreyna): We use a custom protocol to intercept and adapt certain network
            // requests to the needs of NAE features.
            //
            // For hot-reload, we handle the initial app page request and add a cookie for
            // staging / dev authentication. We could use a service worker, but iOS
            // WebViews force the use of AppBoundDomains which limit apps to at most 10 domains to
            // fetch from. There was a decision to avoid this limitation for now.
            // See information on AppBoundDomains: https://webkit.org/blog/10882/app-bound-domains/
            //
            // For static, we handle requests that could be served directly from disk.
            // It also handles certain special requests like '/v/' authentication for xrweb.
            tauri::async_runtime::spawn(async move {
                let response = c8::nae_protocol::handle_8thwall_protocol_request(request).await;
                responder.respond(response);
            });
        })
        .setup(move |app| {
            let config = &*c8::shell_app_state::SHELL_APP_STATE;
            let nae_build_mode = config.nae_build_mode.as_ref().expect("NaeBuildMode required");
            let app_url = config.app_url.as_ref().expect("AppUrl required");

            let authority_str = url::Url::parse(app_url)
                .expect("AppUrl is not a valid absolute URL")
                .authority()
                .to_string();

            let window_builder = match nae_build_mode.as_str() {
                "hot-reload" => {
                    let re = regex::Regex::new(r"https://[^/]+/").unwrap();
                    let custom_url = re.replace(app_url, &format!("the8thwall://{}/", authority_str));
                    tauri::WebviewWindowBuilder::new(
                        app,
                        "main",
                        tauri::WebviewUrl::External(Url::parse(&custom_url)?),
                    )
                }

                "static" => {
                    let html_path = format!(
                        "the8thwall://{}/index.html",
                        authority_str
                    );

                    let url = Url::parse(&html_path)
                        .expect("html_path is not a valid absolute URL");

                    tauri::WebviewWindowBuilder::new(
                        app,
                        "main",
                        tauri::WebviewUrl::External(url),
                    )
                }
                other => {
                    panic!("Unsupported buildMode: {}", other);
                }
            };

            #[cfg(not(target_os = "macos"))]
            let _window = window_builder.build().unwrap();

            #[cfg(target_os = "macos")]
            {
                use objc::{msg_send, sel, sel_impl};
                use objc::runtime::{Object, Class};

                let window = window_builder.build().unwrap();

                let app_display_name = config.app_display_name.as_deref().unwrap_or("8thwall App");

                let ns_window: *mut Object = window.ns_window().unwrap() as *mut Object;

                unsafe {
                    let title = std::ffi::CString::new(app_display_name).unwrap();
                    let nsstring: *mut Object = msg_send![Class::get("NSString").unwrap(), stringWithUTF8String:title.as_ptr()];
                    let _: () = msg_send![ns_window, setTitle: nsstring];
                }
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
