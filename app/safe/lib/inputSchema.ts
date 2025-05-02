import { z } from "zod";

export const inputSchema = z.object({
  yen: z
    .number({ invalid_type_error: "数値を入力してください" })
    .nonnegative("0以上の数値で入力してください")
    .int("整数で入力してください"),
});

export type InputValue = z.infer<typeof inputSchema>