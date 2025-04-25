"use client";
import { handleContactForm } from "../lib/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { startTransition, useActionState } from "react";
import { useState, useEffect } from "react";
import { Loader2, Phone } from "lucide-react";

interface TouchedFields {
  name: boolean;
  email: boolean;
  message: boolean;
}

const initialState = {
  success: false,
  errors: {} as {
    name?: string[];
    email?: string[];
    message?: string[];
  },
};

const ContactPage = () => {
  const [isSending, setIsSending] = useState<boolean>(false);
  const [localErrors, setLocalErrors] = useState<typeof initialState.errors>(
    {}
  );
  const [touchedFields, setTouchedFields] = useState<TouchedFields>({
    name: false,
    email: false,
    message: false,
  });
  const [state, formAction] = useActionState(
    async (_prevState: typeof initialState, formData: FormData) =>
      await handleContactForm(formData),
    initialState
  );

  const enhancedFormAction = async (formData: FormData) => {
    setIsSending(true);
    await new Promise((resolve) => setTimeout(resolve));
    startTransition(() => {
      formAction(formData);
    });
  };

  useEffect(() => {
    if (!state.success) {
      setLocalErrors(state.errors);
    } else {
      setLocalErrors({});
    }
    setIsSending(false);
  }, [state]);

  return (
    <div>
      <div className="mt-24 rounded-tl-full bg-gray-100">
        <div className="max-w-2xl mx-auto p-6 ">
          <h2 className="text-2xl text-green-500 text-center font-oswald font-bold tracking-wide mb-1">
            contact
          </h2>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl text-center font-bold text-gray-800 mb-4">
            お問い合わせ
          </h1>
          <div className="mb-4 text-center text-gray-800">
            <div className="h-[1px] bg-gray-800 w-[80%] mx-auto"></div>
            <div className="py-4 font-semibold">
              <h3 className="text-sm sm:text-[16px] lg:text-lg">
                お電話にてお問い合わせ
              </h3>
              <p className="flex items-center justify-center text-2xl lg:text-3xl mr-4 tracking-normal font-sans font-extrabold gap-1">
                <Phone className="w-[20px] mt-[2px]" />
                028-682-9365
              </p>
            </div>
            <div className="h-[1px] bg-gray-800 w-[80%] mx-auto"></div>
          </div>
          <p className="text-center text-gray-700 text-sm md:text-[16px]">
            <span className="block sm:inline">担当者からメールまたは、</span>
            <span>お電話にて対応いたします。</span>
          </p>
        </div>
      </div>

      <div className="bg-gray-100">
        <div className="max-w-2xl mx-auto p-6">
          <form
            action={enhancedFormAction}
            className="mt-12 space-y-8 bg-white p-6"
          >
            <div className="space-y-2">
              <Label htmlFor="name" className="text-md sm:text-lg">
                お名前
              </Label>
              <Input
                type="text"
                name="name"
                className="focus-visible:ring-2 p-1 sm:p-2 text-sm sm:text-lg md:text-lg lg:text-lg xl:text-lg "
                placeholder="例：セブン太郎"
                onChange={() =>
                  setTouchedFields((prev) => ({ ...prev, name: true }))
                }
              />
              {localErrors?.name && !touchedFields.name && (
                <p className="text-red-500 text-sm sm:text-md">
                  {localErrors.name[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-md text-md sm:text-lg">
                メールアドレス
              </Label>
              <Input
                type="text"
                name="email"
                placeholder="例：seventaro@nanaco.com"
                className="focus-visible:ring-2 p-1 sm:p-2 text-sm sm:text-lg md:text-lg lg:text-lg xl:text-lg"
                onChange={() =>
                  setTouchedFields((prev) => ({ ...prev, email: true }))
                }
              />
              {localErrors?.email && !touchedFields.email && (
                <p className="text-red-500 text-sm">{localErrors.email[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="message" className="text-md text-md sm:text-lg">
                お問い合わせ内容
              </Label>
              <Textarea
                name="message"
                placeholder="例：働ける時間帯を教えてください"
                className="focus-visible:ring-2 p-1 sm:p-2 text-sm sm:text-lg md:text-lg lg:text-lg xl:text-lg "
                onChange={() =>
                  setTouchedFields((prev) => ({ ...prev, message: true }))
                }
              />
              {localErrors?.message && !touchedFields.message && (
                <p className="text-red-500">{localErrors.message[0]}</p>
              )}
            </div>

            <div className="text-center">
              <Button
                type="submit"
                className="sm:text-lg w-[100px] md:w-[160px]"
                onClick={() => {
                  setTouchedFields({
                    name: false,
                    email: false,
                    message: false,
                  });
                  setIsSending(true);
                  setLocalErrors({});
                }}
              >
                {isSending ? (
                  <Loader2 className="animate-spin h-10 w-10" strokeWidth={3} />
                ) : (
                  "送信"
                )}
              </Button>
            </div>
            {state.success && (
              <p className="text-green-600 mt-2">
                <span className="block sm:inline">
                  送信ありがとうございます!
                </span>{" "}
                後ほど担当者よりご連絡いたします。
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
