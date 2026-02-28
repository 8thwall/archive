use serde::{Deserialize, Serialize};

use sha2::{Sha256, Digest};
use aes_gcm::{Aes256Gcm, Key, Nonce, aead::{Aead, KeyInit}};

#[derive(Serialize, Deserialize)]
pub struct ChallengeRequest {
    pub access: String,
    pub url: String,
}

#[derive(Deserialize)]
pub struct ChallengeResponse {
    pub token: Option<String>,
}

const PASSCODE_URL: &str = "https://<REMOVED_BEFORE_OPEN_SOURCING>.execute-api.us-west-2.amazonaws.com/prod/challenge";
const DEV_TOKEN_URL: &str = "<REMOVED_BEFORE_OPEN_SOURCING>";

pub const STAGING_MISSING_PASSCODE_ERROR_MESSAGE: &str = "Please provide a passcode to load the 8th Wall staging URL";
pub const STAGING_UNAUTHORIZED_ERROR_MESSAGE: &str = "Unauthorized! Please check the passcode";

pub const DEV_MISSING_TOKEN_ERROR_MESSAGE: &str = "Please provide a dev token to load the 8th Wall dev URL.";
pub const DEV_NO_SET_COOKIE_ERROR_MESSAGE: &str = "No Set-Cookie header found in the response.";

pub const DEV_DOMAIN: &str = ".dev.8thwall.app";
pub const STAGING_DOMAIN: &str = ".staging.8thwall.app";

pub const INVALID_ENCRYPTED_FORMAT_ERROR_MESSAGE: &str = "Invalid encrypted cookie format.";

pub const COOKIE_MISSING_DOMAIN_ERROR_MESSAGE: &str = "Domain not found in cookie.";

pub async fn get_staging_cookie(passcode: String, url: String) -> Result<String, Box<dyn std::error::Error>> {
    get_staging_cookie_with_client_and_url(passcode, url, &reqwest::Client::new(), PASSCODE_URL).await
}

pub(crate) async fn get_staging_cookie_with_client_and_url(
    passcode: String,
    url: String,
    client: &reqwest::Client,
    passcode_url: &str,
) -> Result<String, Box<dyn std::error::Error>> {
    if passcode.is_empty() {
        return Err(STAGING_MISSING_PASSCODE_ERROR_MESSAGE.into());
    }

    let request_body = ChallengeRequest {
        access: passcode,
        url,
    };

    let response = client
        .post(passcode_url)
        .header("Content-Type", "application/json")
        .json(&request_body)
        .send()
        .await?;

    if response.status().is_success() {
        let data: ChallengeResponse = response.json().await?;
        match data.token {
            Some(token) => Ok(token),
            None => Err(STAGING_UNAUTHORIZED_ERROR_MESSAGE.into()),
        }
    } else {
        Err(STAGING_UNAUTHORIZED_ERROR_MESSAGE.into())
    }
}

pub async fn get_dev_cookie(token: String) -> Result<String, Box<dyn std::error::Error>> {
    let client = reqwest::Client::builder()
        .redirect(reqwest::redirect::Policy::none()) // Disable automatic redirects
        .build()?;

    get_dev_cookie_with_client_and_url(token, &client, DEV_TOKEN_URL).await
}

pub(crate) async fn get_dev_cookie_with_client_and_url(
    token: String,
    client: &reqwest::Client,
    dev_token_url: &str,
) -> Result<String, Box<dyn std::error::Error>> {
    if token.is_empty() {
        return Err(DEV_MISSING_TOKEN_ERROR_MESSAGE.into());
    }

    let base_url = if dev_token_url.ends_with('/') {
        dev_token_url.to_string()
    } else {
        format!("{}/", dev_token_url)
    };

    let full_url = format!("{}{}", base_url, token);

    let response = client
        .get(&full_url)
        .send()
        .await?;

    let status = response.status();

    if status == 302 {
        response.headers()
            .get("Set-Cookie")
            .and_then(|cookie| cookie.to_str().ok())
            .map(String::from)
            .ok_or_else(|| DEV_NO_SET_COOKIE_ERROR_MESSAGE.into())
    } else {
        Err(format!("Request failed with status: {}", status).into())
    }
}

pub fn verify_cookie_domain(cookie_domain: &str, url_hostname: &str) -> Result<(), Box<dyn std::error::Error>> {
    // Check if the cookie domain matches the URL's hostname or vice versa.
    // - Staging Cookies' domain will include the entire url hostname (includes project workspace)
    // - Dev Cookies' domain will only include part of the url hostname (sans project workspace)
    // If the URL is https://example.dev.8thwall.app, the cookie domain will be '.dev.8thwall.app'
    // If the URL is https://example.staging.8thwall.app, the cookie domain will be
    // '.example.staging.8thwall.app'

    if cookie_domain.ends_with(DEV_DOMAIN) {
        if !url_hostname.ends_with(cookie_domain) {
            return Err(format!("Cookie dev domain does not match URL: {} vs {}", url_hostname, cookie_domain).into());
        }
    } else if cookie_domain.ends_with(STAGING_DOMAIN) {
        if !cookie_domain.ends_with(url_hostname) {
            return Err(format!("Cookie staging domain does not match URL: {} vs {}", url_hostname, cookie_domain).into());
        }
    } else {
        return Err(format!("Cookie domain is not 8thWall in origin: {}.", cookie_domain).into());
    }

    Ok(())
}

// NOTE(lreyna): Should match implementation in c8/dom/dev-access.ts
fn get_encryption_key() -> [u8; 32] {
    let mut hasher = Sha256::default();
    hasher.update(DEV_TOKEN_URL.as_bytes());
    hasher.finalize().into()
}

pub fn decrypt_cookie(encrypted_text: &str) -> Result<String, Box<dyn std::error::Error>> {
    let text_parts: Vec<&str> = encrypted_text.split(':').collect();
    if text_parts.len() != 3 {
        return Err(INVALID_ENCRYPTED_FORMAT_ERROR_MESSAGE.into());
    }

    let iv = hex::decode(text_parts[0])?;
    let ciphertext = hex::decode(text_parts[1])?;
    let auth_tag = hex::decode(text_parts[2])?;

    if iv.len() != 12 {
        return Err(format!("Invalid IV length: expected 12 bytes, got {}", iv.len()).into());
    }

    if auth_tag.len() != 16 {
        return Err(format!("Invalid auth tag length: expected 16 bytes, got {}", auth_tag.len()).into());
    }

    let encryption_key = get_encryption_key();
    let key = Key::<Aes256Gcm>::from_slice(&encryption_key);
    let cipher = Aes256Gcm::new(key);
    let nonce = Nonce::from_slice(&iv);

    // The aes_gcm crate expects ciphertext + auth_tag concatenated
    let mut payload = ciphertext;
    payload.extend_from_slice(&auth_tag);

    let decrypted = cipher.decrypt(nonce, payload.as_ref())
        .map_err(|e| format!("Decryption failed: {}", e))?;

    String::from_utf8(decrypted)
        .map_err(|e| format!("Invalid UTF-8: {}", e).into())
}

pub fn parse_domain_from_cookie(cookie: &str) -> Result<String, Box<dyn std::error::Error>> {
    cookie
        .split(';')
        .map(|part| part.trim())
        .find(|part| part.to_lowercase().starts_with("domain="))
        .and_then(|domain_part| domain_part.split_once('='))
        .map(|(_, domain)| domain.to_string())
        .ok_or_else(|| COOKIE_MISSING_DOMAIN_ERROR_MESSAGE.into())
}
