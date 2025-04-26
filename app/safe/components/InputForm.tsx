"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface ValueState {
  name: string;
  yen: number | null;
}

type ValuesState = ValueState[];

const InputForm = () => {
  const [total, setTotal] = useState<number | null>(null);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [values, setValues] = useState<ValuesState>([
    { name: "バラ", yen: null },
    { name: "一万円", yen: null },
    { name: "五千円", yen: null },
    { name: "千円", yen: null },
    { name: "500円", yen: null },
    { name: "100円", yen: null },
    { name: "50円", yen: null },
    { name: "10円", yen: null },
    { name: "5円", yen: null },
    { name: "1円", yen: null },
  ]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string,
    index: number
  ) => {
    if(e.target.value.length > 1 && e.target.value.startsWith("0")) {
      e.target.value = e.target.value.replace(/^0+/, "");
    }

    const newValues = [...values];
    newValues[index] = { name, yen: e.target.value ? Number(e.target.value) : null};
    const newTotal = newValues.reduce(
      (sum, value) => sum + (value.yen ?? 0),
      0
    );
    setValues(newValues);
    setTotal(newTotal);
  };

  return (
    <form className="border-2 border-gray-400 mt-2 p-4">
      {/* 金種ごとのInput */}
      <div className="space-y-5">
        {values.map((value: ValueState, index) => (
          <div key={index} className="flex gap-4">
            <Label
              htmlFor={`yen-${index}`}
              className="text-md sm:text-lg w-[40%]"
            >
              {value.name}:
            </Label>
            <Input
              type="number"
              id={`yen-${index}`}
              value={value.yen !== null ? value.yen : ""}
              placeholder="0"
              className="text-right"
              onChange={(e) => handleChange(e, value.name, index)}
            />
          </div>
        ))}
      </div>
      <div className="m-3 flex justify-between">
        <p>合計金額:</p>
        <p
          className={`text-[18px] ${
            total === 300000 ? "text-blue-600" : "text-red-600"
          }`}
        >
          {total ? total : ""}
        </p>
      </div>
      {/* 送信ボタン */}
      <div className="text-center">
        <Button type="submit" className="text-lg w-[50%]">
          {isSending ? (
            <Loader2 className="animate-spin h-10 w-10" strokeWidth={3} />
          ) : (
            "送信"
          )}
        </Button>
      </div>
    </form>
  );
};

export default InputForm;
