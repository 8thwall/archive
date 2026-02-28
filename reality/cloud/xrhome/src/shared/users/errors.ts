enum SIGNUP_ERRORS {
  GOOGLE_SIGNUP_FAILED = 'niantic_id_sign_up_page.error.google_sign_up_failed',
  APPLE_SIGNUP_FAILED = 'niantic_id_sign_up_page.error.apple_sign_up_failed',
  FAILED_TO_SIGNUP = 'niantic_id_sign_up_page.error.failed_to_sign_up',
  PLAYER_EXISTS = 'niantic_id_sign_up_page.error.social_email_exists',
  USER_EMAIL_EXISTS = 'niantic_id_sign_up_page.error.user_with_email_exists',
  INVALID = 'niantic_id_sign_up_page.error.invalid_request',
  NO_EMAIL_PROVIDED = 'niantic_id_sign_up_page.error.no_email_provided',
}

enum DISCONNECT_LOGIN_ERRORS {
  FAILED_TO_DISCONNECT = 'user_profile_page.error.failed_to_disconnect',
  LOGIN_NOT_FOUND = 'user_profile_page.error.login_not_found',
  LOGIN_NOT_REMOVABLE = 'user_profile_page.error.login_not_removeable',
  INVALID = 'user_profile_page.error.invalid_request',
  CHANGE_CONTACT_EMAIL = 'user_profile_page.error.change_contact_email',
}

enum CONNECT_LOGIN_ERRORS {
  FAILED_TO_LINK = 'connected_account_settings.error.failed_to_link',
  FAILED_TO_GET_LOGINS = 'connected_account_settings.error.failed_to_get_logins',
  LOGIN_EXISTS = 'connected_account_settings.warning.used_by_another_account',
  LOGIN_NOT_CHANGEABLE = 'connected_account_settings.error.login_not_changeable',
}

enum CONNECT_EMAIL_ERRORS {
  FAILED_TO_LINK = 'connected_account_settings.error.failed_to_connect_email',
  LOGIN_EXISTS = 'connected_account_settings.warning.email_used_by_another_account',
}

enum MIGRATE_ERRORS {
  FAILED_TO_MIGRATE = 'migrate_existing_users.error.failed_to_migrate',
  ALREADY_MIGRATED = 'migrate_existing_users.error.already_migrated',
  NIANTIC_GOOGLE_ACCOUNT_EXISTS = 'migrate_existing_users.error.google_account_already_migrated',
  NIANTIC_APPLE_ACCOUNT_EXISTS = 'migrate_existing_users.error.apple_account_already_migrated',
  MISSING_APPLE_NIANTIC_ACCOUNT = 'migrate_existing_users.error.missing_apple_niantic_account',
  MISSING_GOOGLE_NIANTIC_ACCOUNT = 'migrate_existing_users.error.missing_google_niantic_account'
}

enum UPDATE_EMAIL_ERRORS {
  INVALID_EMAIL = 'confirm_update_email.error.invalid_email',
  INVALID_PASSWORD = 'confirm_update_email.error.invalid_password',
  EMPTY_EMAIL = 'confirm_update_email.error.empty_email',
  LOWER_CASE_EMAIL = 'confirm_update_email.error.lower_case_email',
  UPDATE_EMAIL_FAILED = 'confirm_update_email.error.update_email_failed',
}

enum CREATE_LOGIN_TOKEN_ERRORS {
  EXCEEDED_TOKEN_LIMIT = 'create_login_token.error.exceeded_token_limit',
  INVALID_USER_SESSION = 'create_login_token.error.invalid_user_session',
  UNEXPECTED = 'create_login_token.error.unexpected',
}

enum EMAIL_VERIFICATION_ERRORS {
  INVALID = 'email_verification.error.invalid',
  CODE_SENT_FAILED = 'email_verification.error.code_sent_failed',
  CHANGE_EMAIL_FAILED = 'email_verification.error.change_email_failed',
  EMPTY_EMAIL = 'email_verification.validation.error.empty_email',
  INVALID_EMAIL = 'email_verification.validation.error.invalid_email',
  LOWER_CASE_EMAIL = 'email_verification.validation.error.invalid_email_lowercase',
  LIMIT_EXCEEDED_EXCEPTION = 'email_verification.error.limit_exceeded_exception',
}

export {
  CONNECT_EMAIL_ERRORS,
  SIGNUP_ERRORS,
  DISCONNECT_LOGIN_ERRORS,
  CONNECT_LOGIN_ERRORS,
  MIGRATE_ERRORS,
  UPDATE_EMAIL_ERRORS,
  CREATE_LOGIN_TOKEN_ERRORS,
  EMAIL_VERIFICATION_ERRORS,
}
