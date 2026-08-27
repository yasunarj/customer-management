"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { inputSchema } from "../lib/inputSchema";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface ValueState {
  name: string;
  yen: number | null;
  error: string;
}

type ValuesState = ValueState[];

const InputForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [values, setValues] = useState<ValuesState>([
    { name: "バラ", yen: null, error: "" },
    { name: "一万円", yen: null, error: "" },
    { name: "五千円", yen: null, error: "" },
    { name: "千円", yen: null, error: "" },
    { name: "500円", yen: null, error: "" },
    { name: "100円", yen: null, error: "" },
    { name: "50円", yen: null, error: "" },
    { name: "10円", yen: null, error: "" },
    { name: "5円", yen: null, error: "" },
    { name: "1円", yen: null, error: "" },
  ]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Input欄に入力時の関数
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string,
    index: number,
    error: string,
  ) => {
    if (e.target.value.length > 1 && e.target.value.startsWith("0")) {
      e.target.value = e.target.value.replace(/^0+/, "");
    }

    const newValues = [...values];
    newValues[index] = {
      name,
      yen: e.target.value ? Number(e.target.value) : null,
      error,
    };
    const newTotal = newValues.reduce(
      (sum, value) => sum + (value.yen ?? 0),
      0,
    );
    setValues(newValues);
    setTotal(newTotal);
  };

  // リセットボタン押下
  const handleReset = () => {
    if (window.confirm("リセットしても良いですか？")) {
      const newValues = values.map((value) => {
        return { name: value.name, yen: null, error: "" };
      });
      setValues(newValues);
      setTotal(null);
    } else {
      return;
    }
  };

  // 送信ボタン押下
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);
    const newValues = values.map((value) => {
      if (value.yen === null) {
        value.yen = 0;
      }
      const result = inputSchema.safeParse({ yen: value.yen });
      if (!result.success) {
        return { ...value, error: result.error.errors[0].message };
      }
      return { ...value, error: "" };
    });

    setValues(newValues);

    if (newValues.some((value) => value.error !== "")) {
      setIsSending(false);
      return;
    }

    // supabaseへの保存処理
    const sendData = {
      date: new Date(),
      bara: values[0].yen,
      yen10000: values[1].yen,
      yen5000: values[2].yen,
      yen1000: values[3].yen,
      yen500: values[4].yen,
      yen100: values[5].yen,
      yen50: values[6].yen,
      yen10: values[7].yen,
      yen5: values[8].yen,
      yen1: values[9].yen,
      total: total,
    };
    try {
      const res = await fetch("/api/safe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendData),
      });
      if (res.ok) {
        toast({
          title: "登録しました",
          description: "金庫内金額を登録しました",
        });
        router.push("/safe/history");
      } else {
        setErrorMessage("登録できませんでした");
      }
    } catch (e) {
      setErrorMessage("登録できませんでした");
      console.error("データの登録に失敗しました", e);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-xl">
      {/* 金種ごとのInput */}
      <div className="space-y-2">
        {values.map((value: ValueState, index) => (
          <div
            key={index}
            className="rounded-lg border border-gray-700 bg-gray-800 p-1"
          >
            <div className="flex items-center gap-4">
              <Label
                htmlFor={`yen-${index}`}
                className="text-sm font-medium text-gray-200 sm:text-base w-[40%]"
              >
                {value.name}
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
                id={`yen-${index}`}
                value={value.yen !== null ? value.yen : ""}
                placeholder="0"
                className="bg-gray-900 text-right text-white border-gray-600 placeholder:text-gray-600"
                onChange={(e) =>
                  handleChange(e, value.name, index, value.error)
                }
              />
            </div>
            <p className="mt-1 text-sm text-right text-red-600">
              {value.error ? value.error : ""}
            </p>
          </div>
        ))}

        <div className="rounded-lg border border-gray-700 bg-gray-800 p-2">
          <div className="flex items-center justify-between ">
            <p>合計金額</p>
            <p
              className={`text-xl font-bold ${
                total === 300000 ? "text-green-400" : "text-red-400"
              }`}
            >
              {total !== null ? total.toLocaleString("ja-JP") : "0"}
              <span className="text-gray-400 text-sm font-normal">円</span>
            </p>
          </div>
          {/* 送信ボタン */}
          <div className="mt-2 flex gap-4 justify-end mx-auto max-w-[400px] mb-2">
            <Button
              type="button"
              variant="outline"
              className="w-36 border-gray-600 bg-transparent text-gray-200 hover:bg-gray-800 hover:text-white"
              onClick={handleReset}
            >
              リセット
            </Button>
            <Button
              type="submit"
              disabled={isSending}
              className="w-36 bg-blue-700 px-6 hover:bg-blue-600"
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  送信中...
                </>
              ) : (
                "送信"
              )}
            </Button>
          </div>
        </div>
      </div>
      {errorMessage && (
        <p className="mt-1 rounded bg-red-950 px-3 py-2 text-center test-sm text-red-200">{errorMessage}</p>
      )}
    </form>
  );
};

export default InputForm;
