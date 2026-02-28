// NOTE: Must be kept in sync with reality/cloud/xrhome/src/server/verify-xrweb-code.ts
const SECRET: &str = "<REMOVED_BEFORE_OPEN_SOURCING>";

pub fn verify_xrweb_code(verification_code: &str, app_key: &str) -> String {
    let app_key_bytes = app_key.as_bytes();
    let secret_bytes = SECRET.as_bytes();
    let char_code_0 = b'0';

    verification_code
        .chars()
        .enumerate()
        .map(|(i, digit_char)| {
            let v = digit_char.to_digit(10).unwrap_or(0) as usize;
            let a = app_key_bytes.get(i + (v % 8)).copied().unwrap_or(char_code_0) - char_code_0;
            let s = secret_bytes.get(i + (v % 3)).copied().unwrap_or(char_code_0) - char_code_0;
            if s == 0 {
                0
            } else {
                (a as usize * (v * 4)) / s as usize
            }
        })
        .map(|n| n.to_string())
        .collect()
}
