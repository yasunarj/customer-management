import { Reservation } from "@/types/reservation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type ReservationListData = Reservation[] | undefined;

interface SearchComponentProps {
  type: string;
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
  setReservationList,
  isSearched,
  handleGetLists,
}: SearchComponentProps) => {
  const form = useForm({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      name: "",
      year: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof searchSchema>) => {
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
        throw new Error("検索データを取得できませんでした");
      }
      const searchData = await response.json();
      console.log("デバック用", searchData.length);
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
                <div className="">
                  <FormControl>
                    <Input
                      className="px-1 text-sm sm:text-lg w-full"
                      placeholder="西暦を入力"
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
                      className="px-1 text-sm sm:text-lg w-full"
                      placeholder="名前を入力"
                      {...field}
                    />
                  </FormControl>
                  <Button className="bg-gray-700 font-semibold sm:text-md px-2">
                    検索
                  </Button>
                </div>
              </FormItem>
            )}
          />
        </form>
        {isSearched && (
          <div>
            <Button
              className="bg-gray-700 font-semibold sm:text-md px-2"
              onClick={handleGetLists}
            >
              一覧再表示
            </Button>
            <p>合計件数: {}</p>
          </div>
        )}
      </div>
    </Form>
  );
};

export default SearchComponent;
