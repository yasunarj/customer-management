"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

const newReservationSchema = z.object({
  name: z.string().min(1, "名前を入力してください"),
  phone: z
    .string()
    .regex(/^\d{10,11}$/, "10桁または11桁の数字を入力してください"),
  productName: z.string().min(1, "商品名を入力してください"),
  price: z.string().refine((value) => !isNaN(Number(value)), "正しい数字を入力してください"),
  reservationDate: z
    .string()
    .refine(
      (value) => !isNaN(Date.parse(value)),
      "正しい日付を入力してください"
    ),
  deliveryDate: z
    .string()
    .refine(
      (value) => !isNaN(Date.parse(value)),
      "正しい日付を入力してください"
    ),
});

const CreateForm = ({ type }: { type: string }) => {
  const [ errorMessage, setErrorMessage ] = useState<string>("");
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(newReservationSchema),
    defaultValues: {
      name: "",
      phone: "",
      productName: "",
      price: "",
      reservationDate: "",
      deliveryDate: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof newReservationSchema>) => {
    const sendData = {...values, type};
    try {
      const response = await fetch("/api/reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendData),
      });
      if (response.ok) {
        router.push(`/admin/${type}/list`);
      } else {
        setErrorMessage("登録できませんでした");
        console.error("Error creating reservation");
      } 
    } catch (e) {
      setErrorMessage("登録できませんでした");
      console.error("NeTwork error:", e);
    }
  };

  return (
    <Form {...form}>
      <div className="h-[98%] w-[80%] flex justify-center">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center px-6 py-6 w-full h-auto gap-4 rounded-md shadow-2xl bg-white"
        >
          <h2 className="text-xl sm:text-3xl text-gray-800 font-semibold">予約フォーム</h2>
          <div className="w-full space-y-3 sm:space-y-0 sm:flex sm:w-[80%] sm:h-full sm:justify-center sm:gap-8 sm:p-4">
            <div className="flex flex-col gap-3 sm:w-[45%] sm:gap-12">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md sm:text-lg">
                      お客様名
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="p-1 sm:p-2 text-sm sm:text-lg"
                        placeholder="名前を入力"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md sm:text-lg">
                      電話番号
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="p-1 sm:p-2 text-sm sm:text-lg"
                        placeholder="090xxxxxxxx"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-3 sm:w-[45%] sm:gap-12">
              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md sm:text-lg">商品名</FormLabel>
                    <FormControl>
                      <Textarea
                        className="p-1 sm:p-2 text-sm sm:text-lg"
                        placeholder="商品名を入力"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md sm:text-lg">
                      合計金額
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="p-1 sm:p-2 text-sm sm:text-lg"
                        placeholder="価格を入力してください"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reservationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md sm:text-lg">
                      予約受付日時
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="p-1 sm:p-2 text-sm sm:text-lg"
                        placeholder="20xx/xx/xx"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deliveryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md sm:text-lg">
                      お渡し日時
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="p-1 sm:p-2 text-sm sm:text-lg"
                        placeholder="20xx/xx/xx"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
            </div>
          </div>
          { errorMessage && <div className="text-sm text-red-500">{errorMessage}</div> }
          <Button className="w-[50%] bg-gray-800 sm:w-[30%] font-semibold sm:text-lg sm:p-5">
            登録する
          </Button>
        </form>
      </div>
    </Form>
  );
};

export default CreateForm;
