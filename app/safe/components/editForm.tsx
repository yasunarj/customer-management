"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { inputSchema } from "../lib/inputSchema";
import { useRouter } from "next/navigation";
import { safeMenuList } from "../lib/safMenuList";
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
    return <div className="h-screen-vh">データが存在しません</div>;
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
    error: string
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
    <div className="h-screen-vh overflow-hidden bg-blue-200 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="mt-2 max-w-[520px] w-[90%] h-[98%] bg-white p-2 rounded-xl shadow-2xl"
      >
        <div className="flex flex-col h-full">
          <h2 className="relative mt-2 text-center text-2xl font-bold text-gray-800">
            修正フォーム
            <div className="absolute top-1 right-4">
              <SheetMenu menuList={safeMenuList} />
            </div>
          </h2>
          {/* 金種ごとのInput */}
          <div className="w-[95%] max-w-[520px] mx-auto mt-2 border-2 border-gray-400 p-4 pb-0 overflow-y-scroll flex-1">
            <div className="flex flex-col justify-between max-w-[400px] mx-auto h-full">
              <div className="flex-1 flex flex-col justify-between">
                {detailStates.map((state: DetailState, index: number) => {
                  return (
                    <div
                      key={state.name}
                      className="flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor={"bara"}
                          className="text-md sm:text-lg w-full"
                        >
                          {state.name}
                        </Label>
                        <Input
                          ref={(el: HTMLInputElement | null) => {
                            if (el) inputRefs.current[index] = el;
                          }}
                          type="number"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              inputRefs.current[index + 1]?.focus();
                            }
                          }}
                          id={"bara"}
                          value={state.yen}
                          placeholder="0"
                          className="text-right"
                          onChange={(e) =>
                            handleChange(e, state.name, index, state.error)
                          }
                        />
                      </div>
                      <p className="text-sm text-right text-red-600">
                        {state.error ? state.error : ""}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="py-2 mt-2 sm:py-4 flex justify-between max-w-[400px] mx-auto w-full">
                <p>合計金額</p>
                <p
                  className={`text-[18px] ${
                    total === 300000 ? "text-blue-600" : "text-red-600"
                  }`}
                >
                  {total}
                  <span className="text-gray-800">円</span>
                </p>
              </div>
              {/* 送信ボタン */}
              <div className="flex justify-center py-2">
                <Button type="submit" className="text-md w-[40%]">
                  {isEditing ? (
                    <Loader2
                      className="animate-spin h-10 w-10"
                      strokeWidth={3}
                    />
                  ) : (
                    "更新"
                  )}
                </Button>
              </div>
            </div>
            <p className="text-red-600 text-center text-sm mt-1">
              {errorMessage}
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditForm;
