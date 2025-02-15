"use client";

import Link from "next/link";
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
import DateSelect from "../dateSelect/DateSelect";

const newReservationSchema = z.object({
  name: z.string().min(1, "名前を入力してください"),
  phone: z
    .string()
    .optional()
    .refine(
      (value) => !value || /^\d{10,11}$/.test(value),
      "10桁または11桁の数字を入力してください"
    ),
  productName: z.string().min(1, "商品名を入力してください"),
  price: z
    .string()
    .min(1, "価格を入力してください")
    .refine((value) => !isNaN(Number(value)), "正しい数字を入力してください"),
});

const CreateForm = ({ type }: { type: string }) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [reservationYear, setReservationYear] = useState<number>(2025);
  const [reservationMonth, setReservationMonth] = useState<number>(1);
  const [reservationDay, setReservationDay] = useState<number>(1);
  const [deliveryYear, setDeliveryYear] = useState<number>(2025);
  const [deliveryMonth, setDeliveryMonth] = useState<number>(1);
  const [deliveryDay, setDeliveryDay] = useState<number>(1);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(newReservationSchema),
    defaultValues: {
      name: "",
      phone: "",
      productName: "",
      price: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: z.infer<typeof newReservationSchema>) => {
    const reservationDate = new Date(
      reservationYear,
      reservationMonth - 1,
      reservationDay
    );
    const deliveryDate = new Date(deliveryYear, deliveryMonth - 1, deliveryDay);
    const sendData = { ...values, type, reservationDate, deliveryDate };
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
      <div className="h-[98%] w-[85%] sm:w-[80%] flex justify-center relative">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center px-6 py-6 w-full h-auto gap-6 rounded-md shadow-2xl bg-white"
        >
          <h2 className="text-xl sm:text-3xl text-gray-800 font-semibold">
            予約フォーム
          </h2>
          <Link
            href={`/admin/${type}/list`}
            className="text-sm sm:text-lg absolute top-7 right-4 text-blue-600 hover:underline hover:underline-offset-2"
          >
            一覧へ戻る
          </Link>
          <div className="w-full space-y-3 sm:space-y-0 sm:flex sm:w-[80%] sm:h-full sm:justify-center sm:gap-8 sm:p-4">
            <div className="flex flex-col gap-3 sm:w-[45%] sm:gap-16">
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

            <div className="flex flex-col gap-3 sm:w-[45%] sm:gap-16">
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

              <DateSelect
                title="予約年月日"
                setYear={setReservationYear}
                setMonth={setReservationMonth}
                setDay={setReservationDay}
                year={reservationYear}
                month={reservationMonth}
                day={reservationDay}
              />
              <DateSelect
                title="お渡し年月日"
                setYear={setDeliveryYear}
                setMonth={setDeliveryMonth}
                setDay={setDeliveryDay}
                year={deliveryYear}
                month={deliveryMonth}
                day={deliveryDay}
              />
            </div>
          </div>
          {errorMessage && (
            <div className="text-sm text-red-500">{errorMessage}</div>
          )}
          <Button
            className="w-[50%] bg-gray-800 sm:w-[30%] font-semibold sm:text-lg sm:p-5"
            disabled={isSubmitting}
          >
            {isSubmitting ? "登録中" : "登録する"}
          </Button>
        </form>
      </div>
    </Form>
  );
};

export default CreateForm;
