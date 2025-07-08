import { env } from "../config/env.js";
import {
  emailVerificationMailGenContent,
  sendEmail,
} from "../utils/sendEmail.js";
import { logger } from "../utils/logger.js";

const sendEmailVerificationLink = async (user, email) => {
  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();
  user.emailVerificationToken = hashedToken;
  user.emailVerificationTokenExpiry = tokenExpiry;
  await user.save();

  logger.info(`Email verification token saved for user ID ${user._id}`);

  const verificationUrl = `${env.FRONTEND_URL}/api/v1/auth/verify-email/${unHashedToken}`;

  logger.info(`Sending verification link: ${verificationUrl} to: ${email}`);
  await sendEmail({
    email,
    subject: "Email Verification",
    mailGenContent: emailVerificationMailGenContent(
      user.fullname,
      verificationUrl,
    ),
  });
};

export { sendEmailVerificationLink };
