use objc::{msg_send, sel, sel_impl};
use objc::runtime::{Class, Object};
pub fn get_resources_directory() -> Option<String> {
    use std::ffi::CStr;
    use std::os::raw::c_char;

    unsafe {
        let ns_bundle: *const Class = Class::get("NSBundle")?;
        let main_bundle: *mut Object = msg_send![ns_bundle, mainBundle];
        let resource_path: *mut Object = msg_send![main_bundle, resourcePath];
        let c_str: *const c_char = msg_send![resource_path, UTF8String];
        if !c_str.is_null() {
            return Some(CStr::from_ptr(c_str).to_string_lossy().into_owned());
        }
    }
    None
}
