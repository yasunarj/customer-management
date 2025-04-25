import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "名前は必須です"),
  email: z.string().email("メールアドレスが不正です"),
  message: z.string().min(1, "お問い合わせ内容を入力してください"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
