mod dev_cookie;
use dev_cookie::*;
use serde_json::json;

// Test Setup Overview:
//
// These tests validate the `get_staging_cookie_with_client_and_url` functions
// which make HTTP requests to authenticate staging access using a passcode.
//
// Dependencies and Architecture:
// - `mockito`: HTTP server mocking library that creates fake servers for testing
//   - Allows us to simulate different HTTP responses (success, errors, malformed data)
//   - Prevents tests from making real network calls to external APIs
//   - Provides deterministic, fast, and isolated test execution
//
// - `tokio::test`: Async test runner for testing async functions
//   - Required because our functions use `async/await` and return futures
//   - Provides an async runtime context for test execution
//
// - `reqwest::Client`: HTTP client used by the actual implementation
//   - Tests inject a real client but point it to mock servers
//   - This tests the actual HTTP interaction code paths
//
// - `serde_json::json!`: Macro for creating JSON test data
//   - Simplifies creation of mock response bodies
//   - Ensures valid JSON structure in test scenarios

#[tokio::test]
async fn test_get_staging_cookie_success() {
    let mut server = mockito::Server::new_async().await;
    let mock_url = server.url();

    let _m = server
        .mock("POST", "/prod/challenge")
        .with_status(200)
        .with_header("content-type", "application/json")
        .with_body(json!({"token": "test_token_123"}).to_string())
        .create_async()
        .await;

    let client = reqwest::Client::new();
    let full_url = format!("{}/prod/challenge", mock_url);
    let result = get_staging_cookie_with_client_and_url(
        "valid_passcode".to_string(),
        "https://example.com".to_string(),
        &client,
        &full_url,
    )
    .await;

    assert!(result.is_ok());
    assert_eq!(result.unwrap(), "test_token_123");
}

#[tokio::test]
async fn test_get_staging_cookie_success_with_null_token() {
    let mut server = mockito::Server::new_async().await;
    let mock_url = server.url();

    let _m = server
        .mock("POST", "/prod/challenge")
        .with_status(200)
        .with_header("content-type", "application/json")
        .with_body(json!({"token": null}).to_string())
        .create_async()
        .await;

    let client = reqwest::Client::new();
    let full_url = format!("{}/prod/challenge", mock_url);
    let result = get_staging_cookie_with_client_and_url(
        "valid_passcode".to_string(),
        "https://example.com".to_string(),
        &client,
        &full_url,
    )
    .await;

    assert!(result.is_err());
    let error_message = result.unwrap_err().to_string();
    assert_eq!(error_message, STAGING_UNAUTHORIZED_ERROR_MESSAGE);
}

#[tokio::test]
async fn test_get_staging_cookie_http_error() {
    let mut server = mockito::Server::new_async().await;
    let mock_url = server.url();

    let _m = server
        .mock("POST", "/prod/challenge")
        .with_status(401)
        .with_header("content-type", "application/json")
        .with_body(json!({"error": "Unauthorized"}).to_string())
        .create_async()
        .await;

    let client = reqwest::Client::new();
    let full_url = format!("{}/prod/challenge", mock_url);
    let result = get_staging_cookie_with_client_and_url(
        "invalid_passcode".to_string(),
        "https://example.com".to_string(),
        &client,
        &full_url,
    )
    .await;

    assert!(result.is_err());
    let error_message = result.unwrap_err().to_string();
    assert_eq!(error_message, STAGING_UNAUTHORIZED_ERROR_MESSAGE);
}

#[tokio::test]
async fn test_get_staging_cookie_empty_passcode() {
    let result = get_staging_cookie("".to_string(), "https://example.com".to_string()).await;

    assert!(result.is_err());
    let error_message = result.unwrap_err().to_string();
    assert_eq!(error_message, STAGING_MISSING_PASSCODE_ERROR_MESSAGE);
}

#[tokio::test]
async fn test_network_timeout_handling() {
    let client = reqwest::Client::new();
    let result = get_staging_cookie_with_client_and_url(
        "test_passcode".to_string(),
        "https://example.com".to_string(),
        &client,
        "http://invalid-url-that-does-not-exist.local:9999/challenge",
    )
    .await;

    assert!(result.is_err());
}

#[tokio::test]
async fn test_malformed_json_response() {
    let mut server = mockito::Server::new_async().await;
    let mock_url = server.url();

    let _m = server
        .mock("POST", "/prod/challenge")
        .with_status(200)
        .with_header("content-type", "application/json")
        .with_body("invalid json response")
        .create_async()
        .await;

    let client = reqwest::Client::new();
    let full_url = format!("{}/prod/challenge", mock_url);
    let result = get_staging_cookie_with_client_and_url(
        "valid_passcode".to_string(),
        "https://example.com".to_string(),
        &client,
        &full_url,
    )
    .await;

    assert!(result.is_err());
}

#[tokio::test]
async fn test_server_error_status() {
    let mut server = mockito::Server::new_async().await;
    let mock_url = server.url();

    let _m = server
        .mock("POST", "/prod/challenge")
        .with_status(500)
        .with_header("content-type", "application/json")
        .with_body(json!({"error": "Internal Server Error"}).to_string())
        .create_async()
        .await;

    let client = reqwest::Client::new();
    let full_url = format!("{}/prod/challenge", mock_url);
    let result = get_staging_cookie_with_client_and_url(
        "valid_passcode".to_string(),
        "https://example.com".to_string(),
        &client,
        &full_url,
    )
    .await;

    assert!(result.is_err());
    let error_message = result.unwrap_err().to_string();
    assert_eq!(error_message, STAGING_UNAUTHORIZED_ERROR_MESSAGE);
}

#[tokio::test]
async fn test_get_dev_cookie_success() {
    let mut server = mockito::Server::new_async().await;
    let mock_url = server.url();

    let _m = server
        .mock("GET", "/test_token_123")
        .with_status(302)
        .with_header("Set-Cookie", "session=abc123; Path=/; Domain=.8thwall.app; HttpOnly; Secure")
        .create_async()
        .await;

    let client = reqwest::Client::new();
    let result = get_dev_cookie_with_client_and_url(
        "test_token_123".to_string(),
        &client,
        &mock_url,
    )
    .await;

    assert!(result.is_ok());
    assert_eq!(result.unwrap(), "session=abc123; Path=/; Domain=.8thwall.app; HttpOnly; Secure");
}

#[tokio::test]
async fn test_get_dev_cookie_empty_token() {
    let result = get_dev_cookie("".to_string()).await;

    assert!(result.is_err());
    let error_message = result.unwrap_err().to_string();
    assert_eq!(error_message, DEV_MISSING_TOKEN_ERROR_MESSAGE);
}

#[tokio::test]
async fn test_get_dev_cookie_invalid_token_404() {
    let mut server = mockito::Server::new_async().await;
    let mock_url = server.url();

    let _m = server
        .mock("GET", "/invalid_token")
        .with_status(404)
        .with_body("Token not found")
        .create_async()
        .await;

    let client = reqwest::Client::new();
    let result = get_dev_cookie_with_client_and_url(
        "invalid_token".to_string(),
        &client,
        &mock_url,
    )
    .await;

    assert!(result.is_err());
    let error_message = result.unwrap_err().to_string();
    assert!(error_message.contains("Request failed with status: 404"));
}

#[tokio::test]
async fn test_get_dev_cookie_302_without_set_cookie() {
    let mut server = mockito::Server::new_async().await;
    let mock_url = server.url();

    let _m = server
        .mock("GET", "/token_without_cookie")
        .with_status(302)
        // Note: No Set-Cookie header
        .create_async()
        .await;

    let client = reqwest::Client::new();
    let result = get_dev_cookie_with_client_and_url(
        "token_without_cookie".to_string(),
        &client,
        &mock_url,
    )
    .await;

    assert!(result.is_err());
    let error_message = result.unwrap_err().to_string();
    assert_eq!(error_message, DEV_NO_SET_COOKIE_ERROR_MESSAGE);
}

#[tokio::test]
async fn test_get_dev_cookie_success_multiple_cookies() {
    let mut server = mockito::Server::new_async().await;
    let mock_url = server.url();

    let _m = server
        .mock("GET", "/multi_cookie_token")
        .with_status(302)
        .with_header("Set-Cookie", "session=abc123; Path=/; HttpOnly")
        .with_header("Set-Cookie", "csrf=def456; Path=/; Secure")
        .create_async()
        .await;

    let client = reqwest::Client::new();
    let result = get_dev_cookie_with_client_and_url(
        "multi_cookie_token".to_string(),
        &client,
        &mock_url,
    )
    .await;

    assert!(result.is_ok());
    // Should return the first Set-Cookie header
    assert_eq!(result.unwrap(), "session=abc123; Path=/; HttpOnly");
}

#[tokio::test]
async fn test_get_dev_cookie_server_error() {
    let mut server = mockito::Server::new_async().await;
    let mock_url = server.url();

    let _m = server
        .mock("GET", "/error_token")
        .with_status(500)
        .with_body("Internal Server Error")
        .create_async()
        .await;

    let client = reqwest::Client::new();
    let result = get_dev_cookie_with_client_and_url(
        "error_token".to_string(),
        &client,
        &mock_url,
    )
    .await;

    assert!(result.is_err());
    let error_message = result.unwrap_err().to_string();
    assert!(error_message.contains("Request failed with status: 500"));
}

#[tokio::test]
async fn test_verify_cookie_domain_dev_valid() {
    let result = verify_cookie_domain(DEV_DOMAIN, "example.dev.8thwall.app");
    assert!(result.is_ok());
}

#[tokio::test]
async fn test_verify_cookie_domain_dev_invalid() {
    let result = verify_cookie_domain(DEV_DOMAIN, "example.staging.8thwall.app");
    assert!(result.is_err());
    let error_message = result.unwrap_err().to_string();
    assert!(error_message.contains("Cookie dev domain does not match URL"));
}

#[tokio::test]
async fn test_verify_cookie_domain_staging_valid() {
    let result = verify_cookie_domain(".example.staging.8thwall.app", "example.staging.8thwall.app");
    assert!(result.is_ok());
}

#[tokio::test]
async fn test_verify_cookie_domain_staging_invalid() {
    let result = verify_cookie_domain(".wrong.staging.8thwall.app", "example.staging.8thwall.app");
    assert!(result.is_err());
    let error_message = result.unwrap_err().to_string();
    assert!(error_message.contains("Cookie staging domain does not match URL"));
}

#[tokio::test]
async fn test_verify_cookie_domain_invalid_origin() {
    let result = verify_cookie_domain(".example.com", "example.com");
    assert!(result.is_err());
    let error_message = result.unwrap_err().to_string();
    assert!(error_message.contains("Cookie domain is not 8thWall in origin"));
}

#[tokio::test]
async fn test_verify_cookie_domain_dev_subdomain() {
    let result = verify_cookie_domain(DEV_DOMAIN, "project.workspace.dev.8thwall.app");
    assert!(result.is_ok());
}

#[tokio::test]
async fn test_verify_cookie_domain_staging_workspace_mismatch() {
    let result = verify_cookie_domain(".workspace1.staging.8thwall.app", "workspace2.staging.8thwall.app");
    assert!(result.is_err());
    let error_message = result.unwrap_err().to_string();
    assert!(error_message.contains("Cookie staging domain does not match URL"));
}

#[tokio::test]
async fn test_verify_cookie_domain_empty_strings() {
    let result = verify_cookie_domain("", "");
    assert!(result.is_err());
    let error_message = result.unwrap_err().to_string();
    assert!(error_message.contains("Cookie domain is not 8thWall in origin"));
}

#[tokio::test]
async fn test_verify_cookie_domain_dev_wrong_tld() {
    let result = verify_cookie_domain(".dev.8thwall.com", "example.dev.8thwall.com");
    assert!(result.is_err());
    let error_message = result.unwrap_err().to_string();
    assert!(error_message.contains("Cookie domain is not 8thWall in origin"));
}

#[tokio::test]
async fn test_decrypt_cookie_invalid_format_too_few_parts() {
    let encrypted_text = "onlyonepart";
    let result = decrypt_cookie(encrypted_text);
    assert!(result.is_err());
    let error_message = result.unwrap_err().to_string();
    assert_eq!(error_message, INVALID_ENCRYPTED_FORMAT_ERROR_MESSAGE);
}

#[tokio::test]
async fn test_decrypt_cookie_invalid_format_too_many_parts() {
    let encrypted_text = "part1:part2:part3:part4";
    let result = decrypt_cookie(encrypted_text);
    assert!(result.is_err());
    let error_message = result.unwrap_err().to_string();
    assert_eq!(error_message, INVALID_ENCRYPTED_FORMAT_ERROR_MESSAGE);
}

#[tokio::test]
async fn test_decrypt_cookie_invalid_hex_iv() {
    let encrypted_text = "invalidhex:616263:646566";
    let result = decrypt_cookie(encrypted_text);
    assert!(result.is_err());
}

#[tokio::test]
async fn test_decrypt_cookie_invalid_hex_ciphertext() {
    let encrypted_text = "616263:invalidhex:646566";
    let result = decrypt_cookie(encrypted_text);
    assert!(result.is_err());
}

#[tokio::test]
async fn test_decrypt_cookie_invalid_hex_auth_tag() {
    let encrypted_text = "616263:646566:invalidhex";
    let result = decrypt_cookie(encrypted_text);
    assert!(result.is_err());
}

#[tokio::test]
async fn test_decrypt_cookie_invalid_iv_length_too_short() {
    let encrypted_text = "61626364:616263646566676869616263646566676869616263646566676869616263:646566676869616263646566676869616263";
    let result = decrypt_cookie(encrypted_text);
    assert!(result.is_err());
    let error_message = result.unwrap_err().to_string();
    assert!(error_message.contains("Invalid IV length: expected 12 bytes, got 4"));
}

#[tokio::test]
async fn test_decrypt_cookie_invalid_iv_length_too_long() {
    let encrypted_text = "61626364656667686961626364656667:616263646566676869616263646566676869616263646566676869616263:646566676869616263646566676869616263";
    let result = decrypt_cookie(encrypted_text);
    assert!(result.is_err());
    let error_message = result.unwrap_err().to_string();
    assert!(error_message.contains("Invalid IV length: expected 12 bytes, got 16"));
}

#[tokio::test]
async fn test_decrypt_cookie_invalid_auth_tag_length_too_short() {
    let encrypted_text = "616263646566676869616263:616263646566676869616263646566676869616263646566676869616263:6465666768696162";
    let result = decrypt_cookie(encrypted_text);
    assert!(result.is_err());
    let error_message = result.unwrap_err().to_string();
    assert!(error_message.contains("Invalid auth tag length: expected 16 bytes, got 8"));
}

#[tokio::test]
async fn test_decrypt_cookie_invalid_auth_tag_length_too_long() {
    let encrypted_text = "616263646566676869616263:616263646566676869616263646566676869616263646566676869616263:6465666768696162636465666768696162636465";
    let result = decrypt_cookie(encrypted_text);
    assert!(result.is_err());
    let error_message = result.unwrap_err().to_string();
    assert!(error_message.contains("Invalid auth tag length: expected 16 bytes, got 20"));
}

#[tokio::test]
async fn test_parse_domain_lowercase() {
    let cookie = "sessionid=abc123; domain=.dev.8thwall.app; Path=/; HttpOnly";
    let result = parse_domain_from_cookie(cookie);
    assert!(result.is_ok());
    assert_eq!(result.unwrap(), DEV_DOMAIN);
}

#[tokio::test]
async fn test_parse_domain_uppercase() {
    let cookie = "sessionid=abc123; Domain=.dev.8thwall.app; Path=/; HttpOnly";
    let result = parse_domain_from_cookie(cookie);
    assert!(result.is_ok());
    assert_eq!(result.unwrap(), DEV_DOMAIN);
}

#[tokio::test]
async fn test_parse_domain_mixed_case() {
    let cookie = "sessionid=abc123; DoMaIn=.dev.8thwall.app; Path=/; HttpOnly";
    let result = parse_domain_from_cookie(cookie);
    assert!(result.is_ok());
    assert_eq!(result.unwrap(), DEV_DOMAIN);
}

#[tokio::test]
async fn test_parse_domain_with_spaces() {
    let cookie = "   domain=.dev.8thwall.app  ; Path=/; HttpOnly";
    let result = parse_domain_from_cookie(cookie);
    assert!(result.is_ok());
    assert_eq!(result.unwrap(), DEV_DOMAIN);
}

#[tokio::test]
async fn test_parse_domain_staging() {
    let cookie = "sessionid=abc123; Domain=.workspace.staging.8thwall.app; Path=/; HttpOnly";
    let result = parse_domain_from_cookie(cookie);
    assert!(result.is_ok());
    let result_unwrap = result.unwrap();
    assert!(result_unwrap.contains(STAGING_DOMAIN));
}

#[tokio::test]
async fn test_parse_domain_no_equals_sign() {
    let cookie = "sessionid=abc123; domain; Path=/; HttpOnly";
    let result = parse_domain_from_cookie(cookie);
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().to_string(), COOKIE_MISSING_DOMAIN_ERROR_MESSAGE);
}

#[tokio::test]
async fn test_parse_domain_partial_match() {
    // Should not match "mydomain" as it doesn't start with "domain="
    let cookie = "sessionid=abc123; mydomain=.example.com; Path=/; HttpOnly";
    let result = parse_domain_from_cookie(cookie);
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().to_string(), COOKIE_MISSING_DOMAIN_ERROR_MESSAGE);
}
