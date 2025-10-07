import * as nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { render } from "@react-email/render";
import MagicLinkEmail from "@/utils/email/form-templates";
import WelcomeEmail from "./email/welcome-email";
import EmailVerificationEmail from "./email/verification-email";
import ResetPasswordEmail from "./email/reset-email";

const transporter = nodemailer.createTransport({
  host: (process.env.NEXT_PUBLIC_SMTP_HOST as string) ?? "",
  port: (process.env.NEXT_PUBLIC_SMTP_PORT as unknown as number) ?? 25,
  secure: false,
  auth: {
    user: (process.env.NEXT_PUBLIC_SMTP_USER as string) ?? "",
    pass: (process.env.NEXT_PUBLIC_SMTP_PASS as string) ?? "",
  },
});

type emailProps = {
  to: string;
  subject: string;
  text?: string;
};

export const sendEmail = async ({
  to,
  subject,
  text,
}: emailProps): Promise<SMTPTransport.SentMessageInfo> => {
  const fromLine = process.env.NEXT_PUBLIC_SMTP_FROM ?? "no-reply";

  return await transporter.sendMail({
    from: fromLine,
    to: to,
    subject: subject,
    text: text,
  });
};

export const sendWelcomeEmail = async ({
  to,
  subject,
  text,
  dashboard,
}: emailProps & {
  dashboard?: string;
}): Promise<SMTPTransport.SentMessageInfo> => {
  const fromLine = process.env.NEXT_PUBLIC_SMTP_FROM ?? "no-reply@photoml.app";

  const emailHtml = await render(
    WelcomeEmail({ userName: to, userEmail: to, dashboardLink: dashboard }),
  );

  const emailText = await render(
    WelcomeEmail({ userName: to, userEmail: to, dashboardLink: dashboard }),
    {
      plainText: true,
    },
  );

  return await transporter.sendMail({
    from: fromLine,
    to: to,
    subject: subject,
    text: emailText,
    html: emailHtml,
  });
};

export const sendMagicLinkEmail = async ({
  to,
  subject,
  magicLink,
}: {
  to: string;
  subject: string;
  magicLink: string;
}) => {
  const fromLine = process.env.NEXT_PUBLIC_SMTP_FROM ?? "no-reply@photoml.app";

  const emailHtml = await render(MagicLinkEmail({ magicLink, userEmail: to }));

  const emailText = await render(MagicLinkEmail({ magicLink, userEmail: to }), {
    plainText: true,
  });

  return await transporter.sendMail({
    from: fromLine,
    to: to,
    subject: subject,
    text: emailText,
    html: emailHtml,
  });
};

export const sendResetPasswordEmail = async ({
  to,
  subject,
  resetLink,
}: {
  to: string;
  subject: string;
  resetLink: string;
}) => {
  const fromLine = process.env.NEXT_PUBLIC_SMTP_FROM ?? "no-reply@photoml.app";
  const emailHtml = await render(
    ResetPasswordEmail({ resetLink: resetLink, userEmail: to }),
  );

  const emailText = await render(
    ResetPasswordEmail({ resetLink: resetLink, userEmail: to }),
    {
      plainText: true,
    },
  );

  return await transporter.sendMail({
    from: fromLine,
    to: to,
    subject: subject,
    text: emailText,
    html: emailHtml,
  });
};

export const sendVerificationEmail = async ({
  to,
  subject,
  url,
}: {
  to: string;
  subject: string;
  url: string;
}) => {
  const fromLine = process.env.NEXT_PUBLIC_SMTP_FROM ?? "no-reply@photoml.app";
  const emailHtml = await render(
    EmailVerificationEmail({ verificationLink: url, userEmail: to }),
  );

  const emailText = await render(
    EmailVerificationEmail({ verificationLink: url, userEmail: to }),
    {
      plainText: true,
    },
  );
  return await transporter.sendMail({
    from: fromLine,
    to: to,
    subject: subject,
    text: emailText,
    html: emailHtml,
  });
};
