import * as nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

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
