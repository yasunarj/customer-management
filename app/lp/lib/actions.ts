"use server";

import { contactSchema } from "./contactSchema";
import nodemailer from "nodemailer";

interface InitialState {
  success: boolean;
  errors: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
}

export async function handleContactForm(
  formData: FormData
): Promise<InitialState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  };

  const result = contactSchema.safeParse(raw);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  // ここでメール送信などの処理を追加予定
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const clientMailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.TO_EMAIL,
    subject: "【お問い合わせフォーム】新しいメッセージ",
    text: `
    お名前: ${raw.name} 
    メールアドレス: ${raw.email}
    お問い合わせ内容: ${raw.message}

    お問い合わせ先へのご返信をお願います
    `,
  };

  const userMailOptions = {
    from: process.env.GMAIL_USER,
    to: raw.email?.toString(),
    subject: `${
      process.env.REPLY_SUBJECT ?? "お問い合わせありがとうございます"
    }`,
    text: `
    ${process.env.REPLY_BODY ?? ""}
    以下の内容を受け付けました
    お名前: ${raw.name}
    お問い合わせ内容: ${raw.message}
    `,
    html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8f8f8; color: #333;">
      <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 24px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #2c3e50;">お問い合わせありがとうございます</h2>
        <p>このたびは <strong>さくら卯の里4丁目店</strong> にお問い合わせいただき、誠にありがとうございます。</p>
        <p>以下の内容で受け付けました。</p>

        <hr style="margin: 20px 0;" />

        <p><strong>お名前：</strong> ${raw.name}</p>
        <p><strong>メールアドレス：</strong> ${raw.email}</p>
        <p><strong>お問い合わせ内容：</strong><br />${raw.message}</p>

        <hr style="margin: 20px 0;" />

        <p style="font-size: 14px; color: #888;">※このメールは自動返信です。ご返信いただいてもお答えできかねる場合がございます。</p>
        <p style="margin-top: 24px;">さくら卯の里4丁目店</p>
      </div>
    </div>
    `,
  };

  try {
    await transporter.sendMail(clientMailOptions);
    await transporter.sendMail(userMailOptions);

    return { success: true, errors: {} };
  } catch (error) {
    console.error("メール送信に失敗しました", error);
    return {
      success: false,
      errors: {
        message: ["メールの送信に失敗しました。"],
      },
    };
  }
}
