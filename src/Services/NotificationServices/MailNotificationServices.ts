import sendGrid from "@sendgrid/mail";
import { from_email, send_grid_key } from "../../Utils/Config";
import { CustomError } from "../../Exceptions/customError";
import { errorSendMail } from "../../Messages/ErrorExceptions";

sendGrid.setApiKey(`${send_grid_key}`);

interface toBody {
  email: string;
  name: string;
}

export const sendEmailTemplate = async (
  to: toBody[],
  template_data: any,
  template_id: string
) => {
  try {
    await sendGrid.send({
      from: {
        email: from_email,
      },
      personalizations: [
        {
          to: to,
          dynamicTemplateData: template_data,
        },
      ],
      templateId: template_id,
    });
  } catch (e) {
    throw new CustomError(
      errorSendMail,
      500,
      "MAIL_ERROR",
      e,
      true
    );
  }
};
