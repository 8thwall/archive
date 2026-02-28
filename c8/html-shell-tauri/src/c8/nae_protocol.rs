use std::fs;
use std::path::{Path};

use tauri::http::{Request, Response as TauriResponse};
use crate::c8;

use mime_guess::MimeGuess;

fn create_error_response(status: u16, message: &str) -> TauriResponse<Vec<u8>> {
    TauriResponse::builder()
        .status(status)
        .body(message.as_bytes().to_vec())
        .unwrap()
}

async fn build_response_from_reqwest(resp: reqwest::Response) -> TauriResponse<Vec<u8>> {
    let status = resp.status().as_u16();
    let headers = resp.headers().clone();
    let body = resp.bytes().await.unwrap_or_default();

    let mut response_builder = TauriResponse::builder().status(status);

    for (name, value) in headers.iter() {
        response_builder = response_builder.header(name.as_str(), value.to_str().unwrap_or(""));
    }

    response_builder.body(body.to_vec()).unwrap()
}

pub(crate) async fn try_get_authentication_cookie(
    request_url: &str,
    authority_str: &str,
    encrypted_dev_cookie: &str,
    nia_env_access_code: &str,
) -> Result<Option<String>, TauriResponse<Vec<u8>>> {
    if !encrypted_dev_cookie.is_empty() {
        let decrypted_cookie = c8::dev_cookie::decrypt_cookie(encrypted_dev_cookie)
            .map_err(|e| create_error_response(500, &format!("Failed to decrypt dev cookie: {}", e)))?;

        let cookie_domain = c8::dev_cookie::parse_domain_from_cookie(&decrypted_cookie)
            .map_err(|e| create_error_response(400, &format!("Could not extract domain from cookie: {}", e)))?;

        c8::dev_cookie::verify_cookie_domain(&cookie_domain, authority_str)
            .map_err(|e| create_error_response(400, &format!("Cookie domain verification failed: {}", e)))?;

        Ok(Some(decrypted_cookie))
    } else if authority_str.ends_with(c8::dev_cookie::STAGING_DOMAIN) {
        let cookie = c8::dev_cookie::get_staging_cookie(nia_env_access_code.to_string(), request_url.to_string()).await
            .map_err(|e| create_error_response(500, &format!("Failed to get staging cookie: {}", e)))?;
        Ok(Some(cookie))
    } else if authority_str.ends_with(c8::dev_cookie::DEV_DOMAIN) {
        let cookie = c8::dev_cookie::get_dev_cookie(nia_env_access_code.to_string()).await
            .map_err(|e| create_error_response(500, &format!("Failed to get dev cookie: {}", e)))?;
        Ok(Some(cookie))
    } else {
        Ok(None)
    }
}

pub async fn handle_8thwall_protocol_request(
    request: Request<Vec<u8>>,
) -> TauriResponse<Vec<u8>> {
    let config = &*c8::shell_app_state::SHELL_APP_STATE;
    let nae_build_mode = config.nae_build_mode.as_ref().expect("NaeBuildMode required");

    match nae_build_mode.as_str() {
        "hot-reload" => handle_hotreload_request(request).await,
        "static" => handle_static_request(request).await,
        _ => create_error_response(500, "Unsupported NaeBuildMode"),
    }
}

async fn handle_hotreload_request(
    request: Request<Vec<u8>>,
) -> TauriResponse<Vec<u8>> {
    let config = &*c8::shell_app_state::SHELL_APP_STATE;
    let app_url = config.app_url.as_ref().expect("AppUrl required");
    let authority_str = url::Url::parse(app_url)
        .expect("AppUrl is not a valid absolute URL")
        .authority()
        .to_string();
    let nia_env_access_code = config.nia_env_access_code.clone().unwrap_or_default();
    let encrypted_dev_cookie = config.encrypted_dev_cookie.clone().unwrap_or_default();
    let request_url = request.uri().to_string().replace(
        "the8thwall://", "https://"
    );

    let client = reqwest::Client::new();
    let mut request_builder = client.get(&request_url);

    // When requesting dev or staging urls, we'll need to add a cookie
    if &request_url == app_url {
        match try_get_authentication_cookie(
            &request_url,
            &authority_str,
            &encrypted_dev_cookie,
            &nia_env_access_code,
        ).await {
            Ok(Some(cookie)) => {
                request_builder = request_builder.header("Cookie", cookie);
            },
            Ok(None) => {
                // No cookie needed for production builds
            },
            Err(error_response) => return error_response,
        };
    }

    match request_builder.send().await {
        Ok(resp) => build_response_from_reqwest(resp).await,
        Err(e) => {
            if e.is_connect() || e.is_timeout() {
                println!("Network error occurred, falling back to static request: {}", e);
                handle_static_request(request).await
            } else {
                create_error_response(500, &format!("Failed to fetch: {}", e))
            }
        }
    }
}

async fn handle_static_request(
    request: Request<Vec<u8>>,
) -> TauriResponse<Vec<u8>> {
    let config = &*c8::shell_app_state::SHELL_APP_STATE;
    let app_name = config.app_name.as_ref().expect("AppName required");
    let app_url = config.app_url.as_ref().expect("AppUrl required");
    let authority_str = url::Url::parse(app_url)
        .expect("AppUrl is not a valid absolute URL")
        .authority()
        .to_string();

    let static_assets_dir_name = "_http-cache";
    let resources_directory = c8::path_helpers::get_resources_directory().unwrap();

    let uri_path_raw = request.uri()
        .path_and_query()
        .unwrap()
        .path()
        .trim_start_matches('/');

    // We need to use <app_name>/index.html, otherwise local asset paths will be off.
    // See: reality/app/nae/packager/bundler.ts
    let app_uri = format!("the8thwall://{}/{}", authority_str, app_name);
    let uri_path = if request.uri().to_string() == app_uri {
        let mut path_buf = std::path::PathBuf::from(uri_path_raw);
        path_buf.push("index.html");
        path_buf.to_string_lossy().to_string()
    } else {
        uri_path_raw.to_string()
    };

    let file_path = Path::new(&resources_directory)
        .join(static_assets_dir_name)
        .join(uri_path.clone())
        .to_string_lossy()
        .to_string();

    if let Ok(bytes) = fs::read(&file_path) {
        let mime_type = MimeGuess::from_path(&file_path)
            .first_or_octet_stream()
            .to_string();

        return TauriResponse::builder()
            .status(200)
            .header("Content-Type", mime_type)
            .header("Content-Length", bytes.len().to_string())
            .header("Cache-Control", "no-cache")
            .body(bytes)
            .unwrap();
    }

    // Since we control what uses the 8thwall protocol, we can know that the verification endpoint
    // for xr could be fetched with https
    // Example url: https://apps.8thwall.com/v/${numbers}/${appKey}
    // First we try an https fetch, if it fails due to network error, we fall back to offline mode.
    // If it fails due to 403 forbidden, we return that to the caller.
    let re = regex::Regex::new(r"^v/(\d+)/([A-Za-z0-9]+)$").unwrap();
    if re.is_match(&uri_path) {
        let origin = url::Url::parse(app_url).unwrap().origin().ascii_serialization();

        let verification_endpoint = format!("https://apps.8thwall.com/{}", uri_path);
        let client = reqwest::Client::new();
        let resp_result = client.get(&verification_endpoint).header("Origin", origin).send().await;

        match resp_result {
            Ok(resp) => {
                return build_response_from_reqwest(resp).await;
            }
            Err(ref err) if err.status() == Some(reqwest::StatusCode::FORBIDDEN) => {
                return create_error_response(403, "Forbidden");
            }
            Err(_) => {
                // fall back to the allowing the XR engine offline
            }
        }

        let (verification_code, app_key) = if let Some(caps) = re.captures(&uri_path) {
            (caps[1].to_string(), caps[2].to_string())
        } else {
            return create_error_response(400, "Invalid verification URL");
        };

        // Should be in sync with reality/cloud/xrhome/src/server/controllers/public-controller.ts
        #[derive(serde::Serialize)]
        struct VerificationResponse {
            code: String,
        }

        let verification_response = c8::verify_xrweb_code::verify_xrweb_code(&verification_code, &app_key);

        let body = serde_json::to_vec(&VerificationResponse {
            code: verification_response,
        })
        .unwrap();

        return TauriResponse::builder()
            .body(body)
            .unwrap();
    }

    create_error_response(404, "File not found locally or on CDN")
}
