const createVerifyEmail = (email, subject, verificationToken) => ({
  to: email,
  subject,
  html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${verificationToken}">Click verify email</a>`,
});

export default createVerifyEmail;
