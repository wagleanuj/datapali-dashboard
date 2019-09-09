const ERROR_CODES = Object.freeze({
    INCORRECT_PASSWORD: "incorrect_password",
    USER_WITH_GIVEN_EMAIL_NOT_FOUND: "user_with_given_email_not_found",
    USER_WITH_GIVEN_USERNAME_NOT_FOUND: "user_with_given_username_not_found",
    EMAIL_ALREADY_EXISTS: "email_already_exists",
    USERNAME_ALREADY_EXISTS: "username_already_exists",
    BCRYPT_ERROR: "bcrypt_error",
    FAILED_TO_SEND_EMAIL: "failed_to_send_email",
    INVALID_PASSWORD_RESET_TOKEN: "invalid_password_reset_token",
    PASSWORD_RESET_TOKEN_EXPIRED: "password_reset_token_expired"
})

module.exports = {
    AUTH_ERROR_CODES: ERROR_CODES
}