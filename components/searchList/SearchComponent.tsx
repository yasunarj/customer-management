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
  name: z.string().min(1, "名前を入力してください"),
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
      setReservationList(searchData.data);
    } catch (e) {
      console.error("Network error", e);
    }
  };

  return (
    <Form {...form}>
      <div className="flex items-center justify-center mt-2 p-1 gap-4">
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
          <Button
            className="bg-gray-700 font-semibold sm:text-md px-2"
            onClick={handleGetLists}
          >
            一覧再表示
          </Button>
        )}
      </div>
    </Form>
  );
};

export default SearchComponent;

