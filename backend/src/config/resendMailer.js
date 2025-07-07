import { Resend } from "resend";
import { env } from "./env.js";

const resendTransporter = new Resend(env.RESEND_API_KEY);

export { resendTransporter };
