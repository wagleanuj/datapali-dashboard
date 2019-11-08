const {AUTH_ERROR_CODES} = require("./authorizationErrors");
const {MAILER_ERROR_CODES} = require("./mailerErrors");

module.exports = {
    AuthorizationErrorsCodes: AUTH_ERROR_CODES,
    MailerErrorCodes: MAILER_ERROR_CODES
}