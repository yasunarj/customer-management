import { Reservation } from "@/types/reservation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";

type ReservationListData = Reservation[] | undefined;

interface SearchComponentProps {
  type: string;
  totalNumber?: number;
  totalAmount?: number;
  setReservationList: (state: ReservationListData) => void;
  isSearched: boolean;
  handleGetLists: () => void;
}

const searchSchema = z.object({
  name: z.string().optional(),
  year: z
    .string()
    .optional()
    .refine(
      (value) => !value || (Number(value) >= 1000 && Number(value) <= 9999),
      { message: "正しい西暦を入力してください" }
    ),
});

const SearchComponent = ({
  type,
  totalAmount,
  totalNumber,
  setReservationList,
  isSearched,
  handleGetLists,
}: SearchComponentProps) => {
  const [error, setError] = useState<string | null>(null);
  const form = useForm({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      name: "",
      year: "",
    },
  });
  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: z.infer<typeof searchSchema>) => {
    setError(null);
    const sendData = { ...values, type };
    try {
      const response = await fetch(`/api/reservation/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error);
        return;
      }
      const searchData = await response.json();
      setReservationList(searchData.data);
    } catch (e) {
      console.error("Network error", e);
    }
  };

  return (
    <Form {...form}>
      <div className="flex items-center justify-center mt-2 p-1 gap-4">
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <div>
                  <FormControl>
                    <Input
                      className="px-1 text-sm md:text-md lg:text-lg w-full"
                      placeholder="西暦を入力"
                      onFocus={() => setError(null)}
                      {...field}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      className="px-1 text-sm md:text-md lg:text-lg w-full"
                      placeholder="名前を入力"
                      onFocus={() => setError(null)}
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type="submit"
                    className="bg-gray-700 font-semibold sm:text-md px-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "取得中" : "検索"}
                  </Button>
                </div>
              </FormItem>
            )}
          />
        </form>
        {isSearched && (
          <div className="flex justify-center items-center gap-8 ">
            <div>
              <Button
                className="bg-gray-700 font-semibold sm:text-md px-2"
                onClick={handleGetLists}
              >
                一覧再表示
              </Button>
            </div>
            <div className="hidden md:block">
              <p>合計件数: {totalNumber}件</p>
              <p>合計金額: {totalAmount}円</p>
            </div>
          </div>
        )}
      </div>
      {error && (
        <div className="text-center text-red-500 text-sm">{error}</div>
      )}
      {isSearched && (
        <div className="flex gap-8 justify-end text-sm sm:text-md md:hidden mt-2">
          <p>合計件数: {totalNumber}件</p>
          <p>合計金額: {totalAmount}円</p>
        </div>
      )}
    </Form>
  );
};

export default SearchComponent;
