"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { inputSchema } from "../lib/inputSchema";
import { useRouter } from "next/navigation";

interface ValueState {
  name: string;
  yen: number | null;
  error: string;
}

type ValuesState = ValueState[];

const InputForm = () => {
  const router = useRouter();
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
      0
    );
    setValues(newValues);
    setTotal(newTotal);
  };

  // リセットボタン押下
  const handleReset = () => {
    if (confirm("リセットしても良いですか？")) {
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
      if(value.yen === null) {
        value.yen = 0;
      }
      const result = inputSchema.safeParse({ yen: value.yen });
      if (!result.success) {
        return { ...value, error: result.error.errors[0].message };
      }
      return { ...value, error: "" };
    });

    setValues(newValues);

    if(newValues.some((value) => value.error !== "")) {
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
    }
    try {
      const res = await fetch("/api/safe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendData)
      })
      if(res.ok) {
        router.push("/safe/history");
      } else {
        setErrorMessage("登録できませんでした");
      }
    } catch(e) {
      setErrorMessage("登録できませんでした");
      console.error("データの登録に失敗しました", e);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-2 border-gray-400 mt-2 p-4 h-[88%] sm:h-[90%] overflow-y-scroll"
    >
      {/* 金種ごとのInput */}
      <div className="flex flex-col h-[85%] sm:h-[90%] justify-between sm:p-6">
        {values.map((value: ValueState, index) => (
          <div key={index}>
            <div className="flex items-center gap-3">
              <Label
                htmlFor={`yen-${index}`}
                className="text-md sm:text-lg w-[40%]"
              >
                {value.name}
              </Label>
              <Input
                type="number"
                id={`yen-${index}`}
                value={value.yen !== null ? value.yen : ""}
                placeholder="0"
                className="text-right"
                onChange={(e) => handleChange(e, value.name, index, value.error)}
              />
            </div>
            <p className="text-sm text-right text-red-600">{value.error ? value.error : ""}</p>
          </div>
        ))}
      </div>
      <div className="m-3 flex justify-between">
        <p>合計金額</p>
        <p
          className={`text-[18px] ${
            total === 300000 ? "text-blue-600" : "text-red-600"
          }`}
        >
          {total ? total : ""}
          <span className="text-gray-800">円</span>
        </p>
      </div>
      {/* 送信ボタン */}
      <div className="flex gap-4 justify-center">
        <Button type="button" className="text-md w-[40%]" onClick={handleReset}>
          リセット
        </Button>
        <Button type="submit" className="text-md w-[40%]">
          {isSending ? (
            <Loader2 className="animate-spin h-10 w-10" strokeWidth={3} />
          ) : (
            "送信"
          )}
        </Button>
      </div>
      <p className="text-red-600 text-center text-sm mt-1">{errorMessage}</p>
    </form>
  );
};

export default InputForm;
