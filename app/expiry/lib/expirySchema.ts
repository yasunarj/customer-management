import { z } from "zod";

export const expirySchema = z.object({
  gondolaNo: z.number().int().nonnegative("0以上で入力してください"),
  category: z.string().min(1, "分類を入力してください"),
  productName: z.string().min(1, "商品名を入力してください"),
  expiryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "日付を入力してください"),
  quantity: z.number().int().min(1, "1以上で入力してください"),
  manager: z.string().optional(),
});

export type ExpiryInput = z.infer<typeof expirySchema>;
