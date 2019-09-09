const PasswordResetTemplate = (username, ResetLink) => (`
<body>
<p>Hello ${username},</p>
<p> Reset your password following the <a href=${ResetLink}>link</a></p>
<p>EggHead</p>
</body>
`)

module.exports = {
    PasswordResetTemplate: PasswordResetTemplate
}