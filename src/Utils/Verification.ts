import { CLIENT_VERIFICATION_TEMPLATE } from "../Constants/MailTemplates";
import { createNewCode } from "../Services/DatabaseServices/VerificationDBServices";
import { sendEmailTemplate } from "../Services/NotificationServices/MailNotificationServices";
import { app_url } from "./Config";
import { sendApiCall } from "./HttpHelper";
import { generateOTP } from "./Token";

export const sendVerificationCode = async (
  client: any,
  createNew: boolean = false,
  message: string
) => {
  try {
    const code = generateOTP();
    const verificationData = {
      verificationType: "CLIENT",
      email: client.email,
      userId: client._id,
      code,
      expiresAt: new Date(new Date().getTime() + 20 * 60 * 1000).toISOString(),
    };
    await Promise.all([
      createNewCode(verificationData, createNew),
      sendEmailTemplate(
        [{ email: client.email, name: client.name }],
        {
          name: client.name,
          verify_url: `${app_url}/clients/verify?token=${code}&userId=${client._id}`,
          title: message,
        },
        CLIENT_VERIFICATION_TEMPLATE
      ),
    ]);
  } catch (e) {
    throw e;
  }
};

export const sendUserVerificationCode = async (
  user: any,
  collection: any,
  createNew: boolean = false,
  eventType: string
) => {
  try {
    const code = generateOTP();
    const verificationData = {
      verificationType: "USER",
      userId: user._id,
      code,
      expiresAt: new Date(new Date().getTime() + 20 * 60 * 1000).toISOString(),
    };
    await Promise.all([
      createNewCode(verificationData, createNew),
      sendApiCall(
        "POST",
        collection.callbackUrl,
        { eventType: eventType, code, data: user },
        { verification_token: collection.verificationToken }
      ),
    ]);
  } catch (e) {
    throw e;
  }
};
