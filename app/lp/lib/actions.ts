"use server";

import { contactSchema } from "./contactSchema";
import { sendMail } from "./mailer";

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
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  const result = contactSchema.safeParse(raw);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  const adminSubject = "[お問合せフォーム] 新しいメッセージ";
  const adminText = `
  お名前: ${raw.name}
  メールアドレス: ${raw.email}
  お問合せ内容:
  ${raw.message}

  ※このメールサイトからの自動通知です。
  `;
  const userSubject =
    process.env.REPLY_SUBJECT ?? "お問い合わせありがとうございます";
  const userText = `
  ${process.env.REPLY_BODY ?? ""}
  
  以下の内容を受け付けました。
  お名前: ${raw.name}
  お問い合わせ内容:
  ${raw.message}
  `;

  const userHtml = `
<div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8f8f8; color: #333;">
  <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 24px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <h2 style="color: #2c3e50;">お問い合わせありがとうございます</h2>
    <p>このたびは <strong>さくら卯の里4丁目店</strong> にお問い合わせいただき、誠にありがとうございます。</p>
    <p>以下の内容で受け付けました。</p>
    <hr style="margin: 20px 0;" />
    <p><strong>お名前：</strong> ${raw.name}</p>
    <p><strong>メールアドレス：</strong> ${raw.email}</p>
    <p><strong>お問い合わせ内容：</strong><br />${raw.message.replace(
      /\n/g,
      "<br />"
    )}</p>
    <hr style="margin: 20px 0;" />
    <p style="font-size: 14px; color: #888;">※このメールは自動返信です。ご返信いただいてもお答えできかねる場合がございます。</p>
    <p style="margin-top: 24px;">さくら卯の里4丁目店</p>
  </div>
</div>
`;

  try {
    const toAdmin = process.env.GMAIL_USER!;
    await sendMail({
      to: toAdmin,
      subject: adminSubject,
      text: adminText,
    });

    await sendMail({
      to: raw.email,
      subject: userSubject,
      text: userText,
      html: userHtml,
    });

    return { success: true, errors: {} };
  } catch (e) {
    console.error("お問合わせメール送信に失敗", e);
    return {
      success: false,
      errors: { message: ["メールの送信に失敗しました"] },
    };
  }
}
