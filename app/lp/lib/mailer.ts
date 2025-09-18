import nodemailer from "nodemailer";

export function createMailer() {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    throw new Error("GMAIL_USER / GMAIL_PASS が未設定です");
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS, // ※2段階認証ならアプリパスワード
    },
  });
}

export async function sendMail({
  to,
  subject,
  text,
  html,
  from,
}: {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
}) {
  const transporter = createMailer();
  const mailFrom = from ?? process.env.GMAIL_USER!;
  await transporter.sendMail({ from: mailFrom, to, subject, text, html });
}
