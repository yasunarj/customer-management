"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { inputSchema } from "../lib/inputSchema";
import { useRouter } from "next/navigation";
import { safeMenuList } from "../lib/safeMenuList";
import SheetMenu from "@/components/sheet/SheetMenu";

type DetailDataProps = {
  id: number;
  date: Date;
  bara: number;
  yen10000: number;
  yen5000: number;
  yen1000: number;
  yen500: number;
  yen100: number;
  yen50: number;
  yen10: number;
  yen5: number;
  yen1: number;
  total: number;
  createAt: Date;
  updateAt: Date;
} | null;

interface DetailState {
  name: string;
  yen: number;
  error: string;
}

type DetailStates = DetailState[];

const EditForm = ({ detailData }: { detailData: DetailDataProps }) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(detailData ? detailData.total : 0);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [detailStates, setDetailStates] = useState<DetailStates | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!detailData) {
      return;
    }

    setDetailStates([
      { name: "バラ", yen: detailData.bara, error: "" },
      { name: "一万円", yen: detailData.yen10000, error: "" },
      { name: "五千円", yen: detailData.yen5000, error: "" },
      { name: "千円", yen: detailData.yen1000, error: "" },
      { name: "500円", yen: detailData.yen500, error: "" },
      { name: "100円", yen: detailData.yen100, error: "" },
      { name: "50円", yen: detailData.yen50, error: "" },
      { name: "10円", yen: detailData.yen10, error: "" },
      { name: "5円", yen: detailData.yen5, error: "" },
      { name: "1円", yen: detailData.yen1, error: "" },
    ]);
  }, [detailData]);

  if (!detailStates) {
    return (
      <main className="h-screen-vh bg-black px-4 py-8 text-white">
        <div className="mx-auto max-w-4xl">
          <p className="rounded-xl border border-gray-700 bg-gray-900 p-6 text-center text-gray-400">
            データが存在しません
          </p>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsEditing(true);
    const newState = detailStates.map((state) => {
      const result = inputSchema.safeParse({ yen: state.yen });
      if (!result.success) {
        return { ...state, error: result.error.errors[0].message };
      }
      return { ...state };
    });

    setDetailStates(newState);

    if (newState.some((state) => state.error !== "")) {
      setIsEditing(false);
      return;
    }

    const updateData = {
      bara: detailStates[0].yen,
      yen10000: detailStates[1].yen,
      yen5000: detailStates[2].yen,
      yen1000: detailStates[3].yen,
      yen500: detailStates[4].yen,
      yen100: detailStates[5].yen,
      yen50: detailStates[6].yen,
      yen10: detailStates[7].yen,
      yen5: detailStates[8].yen,
      yen1: detailStates[9].yen,
      total: total,
    };

    try {
      if (!detailData) {
        throw new Error("データが見当たりません");
      }
      const res = await fetch(`/api/safe/${detailData.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });
      if (res.ok) {
        router.push("/safe/history");
      } else {
        setErrorMessage("データを更新できませんでした");
      }
    } catch (e) {
      setErrorMessage("データを更新できませんでした");
      console.error("データの更新に失敗しました", e);
    } finally {
      setIsEditing(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string,
    index: number,
    error: string,
  ) => {
    const newYen = Number(e.target.value);

    if (e.target.value.length > 1 && e.target.value.startsWith("0")) {
      e.target.value = e.target.value.replace(/^0+/, "");
    }

    const newValue = [...detailStates];
    newValue[index] = { name, yen: e.target.value !== "" ? newYen : 0, error };

    const newTotal = newValue.reduce((sum, value) => sum + (value.yen ?? 0), 0);

    setDetailStates(newValue);
    setTotal(newTotal);
  };

  return (
    <main className="h-screen-vh bg-black px-4 py-4 text-white">
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="mt-1 text-2xl font-bold">修正フォーム</h1>
          </div>
          <div className="text-white">
            <SheetMenu menuList={safeMenuList} />
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-4 rounded-xl border border-gray-700 bg-gray-900 p-4 sm:p-6"
        >
          <div className="space-y-1 sm:space-y-3">
            {detailStates.map((state: DetailState, index: number) => (
              <div
                key={state.name}
                className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-1 sm:py-3"
              >
                <div className="flex items-center gap-4">
                  <Label
                    htmlFor={`yen-${index}`}
                    className="w-[40%] text-sm font-medium text-gray-200 sm-text-base
                  "
                  >
                    {state.name}
                  </Label>

                  <Input
                    ref={(el: HTMLInputElement | null) => {
                      if (el) {
                        inputRefs.current[index] = el;
                      }
                    }}
                    type="number"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        inputRefs.current[index + 1]?.focus();
                      }
                    }}
                    id={`yen-${index}`}
                    value={state.yen}
                    placeholder="0"
                    className="border-gray-600 bg-gray-900 text-right text-white placeholder:text-gray-600"
                    onChange={(e) =>
                      handleChange(e, state.name, index, state.error)
                    }
                  />
                </div>

                {state.error && (
                  <p className="mt-1 text-right text-sm text-red-400">
                    {state.error}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg border-border-gray-700 bg-gray-800 px-4 py-2 sm:p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-300">合計金額</p>
              <p
                className={`text-xl font-bold ${total === 300000 ? "text-green-400" : "text-red-400"}`}
              >
                {total.toLocaleString("ja-JP")}

                <span className="ml-1 text-sm font-normal text-gray-400">
                  円
                </span>
              </p>
            </div>
          </div>

          {errorMessage && (
            <p className="mt-4 rounded bg-red-950 px-3 py-2 text-center text-sm text-red-200">
              {errorMessage}
            </p>
          )}

          <div className="mt-4 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isEditing}
              className="w-32 border-gray-600 bg-transparent text-gray-200 hover:bg-gray-800 hover:text-white"
            >
              キャンセル
            </Button>

            <Button
              type="submit"
              disabled={isEditing}
              className="w-32 bg-blue-700 hover:bg-blue-600"
            >
              {isEditing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  更新中
                </>
              ) : (
                "更新"
              )}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default EditForm;

{
  /* <Input
  ref={(el: HTMLInputElement | null) => {
    if (el) {
      inputRefs.current[index] = el;
    }
  }}
  type="number"
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  }}
/>; */
}
// こちらの意味を忘れてしまったので教えてください。入力後にEnterを押すと下のInput欄に移動するような設定の内容でしょうか？
