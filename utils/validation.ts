import { z } from "zod";

const ReservationSchema = z.object({
  name: z.string().min(1, "名前を入力してください"),
  phone: z
    .string()
    .optional()
    .refine((value) => !value || /^\d{10,11}$/.test(value), "10桁または11桁の数字を入力してください"),
  productName: z.string().min(1, "商品名を入力してください"),
  price: z
    .string()
    .min(1, "価格を入力してください")
    .refine((value) => !isNaN(Number(value)), "正しい数字を入力してください"),
});

export { ReservationSchema };
