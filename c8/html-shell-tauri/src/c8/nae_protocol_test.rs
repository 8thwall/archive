// NOTE(lreyna): Some of the dependencies have unused code that is not explicitly tested.
// We should consider setting up the test dependencies differently.
#![allow(dead_code)]

// Module declarations - these correspond to the source files included in the Bazel target
mod dev_cookie;
mod shell_app_state;
mod path_helpers;
mod info_plist;
mod verify_xrweb_code;

// For nae_protocol, we need to handle the fact that it references `crate::c8`
// In this standalone test crate, we create a `c8` module that contains our modules
// TODO(lreyna): Should reduce the unused imports in the future
mod c8 {
    pub mod dev_cookie {
        pub use super::super::dev_cookie::*;
    }
    pub mod shell_app_state {
        pub use super::super::shell_app_state::*;
    }
    pub mod path_helpers {
        pub use super::super::path_helpers::*;
    }
    pub mod info_plist {
        pub use super::super::info_plist::*;
    }

    pub mod verify_xrweb_code {
        pub use super::super::verify_xrweb_code::*;
    }
}

mod nae_protocol;

use nae_protocol::try_get_authentication_cookie;

// TODO(lreyna): Add better mocks for try_get_authentication_cookie

#[tokio::test]
async fn test_try_get_authentication_cookie_with_encrypted_cookie() {
    let result = try_get_authentication_cookie(
        "https://example.dev.8thwall.app/some-endpoint",
        "example.dev.8thwall.app",
        "invalid_encrypted_cookie", // This should fail to decrypt
        "",
    ).await;

    // The function should try to decrypt this and fail
    assert!(result.is_err());
    let err_response = result.err().unwrap();
    assert_eq!(err_response.status(), 500);
}

#[tokio::test]
async fn test_try_get_authentication_cookie_empty_staging_passcode() {
    let result = try_get_authentication_cookie(
        "https://example.staging.8thwall.app",
        "example.staging.8thwall.app", // Contains .staging.8thwall.app
        "", // No encrypted cookie, should try staging flow
        "", // Empty passcode should trigger staging error
    ).await;

    // Should fail because empty passcode
    assert!(result.is_err());
    let err_response = result.err().unwrap();
    assert_eq!(err_response.status(), 500);
}

#[tokio::test]
async fn test_try_get_authentication_cookie_empty_dev_token() {
    let result = try_get_authentication_cookie(
        "https://example.dev.8thwall.app/some-endpoint",
        "example.dev.8thwall.app", // Contains .dev.8thwall.app
        "", // No encrypted cookie, should try dev flow
        "", // Empty token should trigger dev error
    ).await;

    // Should fail because empty token
    assert!(result.is_err());
    let err_response = result.err().unwrap();
    assert_eq!(err_response.status(), 500);
}
