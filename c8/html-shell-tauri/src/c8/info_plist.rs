use objc::{msg_send, sel, sel_impl};
use objc::runtime::{Class, Object};
pub fn get_info_plist_value(key: &str) -> Option<String> {
    use std::ffi::CStr;
    use std::os::raw::c_char;

    unsafe {
        let ns_bundle: *const Class = Class::get("NSBundle")?;
        let main_bundle: *mut Object = msg_send![ns_bundle, mainBundle];
        let info_dict: *mut Object = msg_send![main_bundle, infoDictionary];

        let ns_string = str_to_nsstring(key);
        let value: *mut Object = msg_send![info_dict, objectForKey: ns_string];

        if !value.is_null() {
            let c_str: *const c_char = msg_send![value, UTF8String];
            if !c_str.is_null() {
                return Some(CStr::from_ptr(c_str).to_string_lossy().into_owned());
            }
        }

        None
    }
}

pub fn get_info_plist_bool(key: &str) -> Option<bool> {
    get_info_plist_value(key).and_then(|val| {
        match val.to_lowercase().as_str() {
            "true" | "1" => Some(true),
            "false" | "0" => Some(false),
            _ => None,
        }
    })
}

unsafe fn str_to_nsstring(s: &str) -> *mut Object {
    let ns_string_class = objc::runtime::Class::get("NSString").unwrap();
    let c_string = std::ffi::CString::new(s).unwrap();
    msg_send![ns_string_class, stringWithUTF8String: c_string.as_ptr()]
}
