"use client";
import { Reservation } from "@/types/reservation";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Link from "next/link";
import { Button } from "../ui/button";
import { useState } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import DeleteButton from "../button/DeleteButton";
import { ReservationSchema } from "@/utils/validation";
import { getInitialFormData, getInitialFormDate } from "@/utils/formUtils";
import { updateReservation } from "@/utils/api";
import DateSelect from "../dateSelect/DateSelect";

interface ReservationDetailCardProps {
  reservationData: Reservation;
  decodeType: string;
}

const ReservationDetailCard = ({
  reservationData,
  decodeType,
}: ReservationDetailCardProps) => {
  const router = useRouter();
  const originalData = getInitialFormData(reservationData);
  const originalDate = getInitialFormDate(reservationData);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [reservationYear, setReservationYear] = useState<number>(
    reservationData.reservationDate.getFullYear()
  );
  const [reservationMonth, setReservationMonth] = useState<number>(
    reservationData.reservationDate.getMonth() + 1
  );
  const [reservationDay, setReservationDay] = useState<number>(
    reservationData.reservationDate.getDate()
  );

  const [deliveryYear, setDeliveryYear] = useState<number>(
    reservationData.deliveryDate!.getFullYear()
  );
  const [deliveryMonth, setDeliveryMonth] = useState<number>(
    reservationData.deliveryDate!.getMonth() + 1
  );
  const [deliveryDay, setDeliveryDay] = useState<number>(
    reservationData.deliveryDate!.getDate()
  );

  const [formData, setFormData] = useState({
    name: reservationData.customer.name,
    phone: reservationData.customer.phone,
    productName: reservationData.productName,
    price: reservationData.price.toString(),
  });


  const resetDate = () => {
    setReservationYear(originalDate.initialReservationYear);
    setReservationMonth(originalDate.initialReservationMonth);
    setReservationDay(originalDate.initialReservationDay);
    setDeliveryYear(originalDate.initialDeliveryYear);
    setDeliveryMonth(originalDate.initialDeliveryMonth);
    setDeliveryDay(originalDate.initialDeliveryDay);
  }

  const handleSave = async () => {
    const sanitizeFormData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, value?.trim()])
    );
    const result = ReservationSchema.safeParse(sanitizeFormData);
    if (!result.success) {
      const errors = result.error.format() as Record<
        string,
        { _errors?: string[] }
      >;

      const formattedErrors = Object.entries(errors).reduce(
        (acc, [key, value]) => {
          if (key !== "_errors") {
            acc[key] = value._errors?.[0] || "";
          }
          return acc;
        },
        {} as Record<string, string>
      );

      setFormErrors(formattedErrors);
      return;
    }

    try {
      setIsSaving(true);
      const reservationDate = `${reservationYear}/${reservationMonth}/${reservationDay}`;
      const deliveryDate = `${deliveryYear}/${deliveryMonth}/${deliveryDay}`;
      const sendFormData = { ...formData, reservationDate, deliveryDate };
      await updateReservation(String(reservationData.id), sendFormData);
      alert("登録しました");
      setFormErrors({});
      setIsEditing(false);
      router.refresh();
    } catch (e) {
      console.error("登録できませんでした", e);
      alert(`更新に失敗しました:${e instanceof Error ? e.message : "不明なエラー"}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  return (
    <Card className="flex flex-col w-[80%] max-w-4xl min-w-[580px] h-[95%] bg-white rounded-xl shadow-4xl p-4 border-double border-8 border-gray-800">
      <CardHeader className="relative">
        <CardTitle className="sm:text-3xl text-gray-800 font-semibold text-center">
          {isEditing
            ? "編集モード"
            : `${reservationData.customer.name}様の予約状況`}
        </CardTitle>

        <Link
          href={`/admin/${decodeType}/list`}
          className="text-sm sm:text-lg absolute right-4 text-blue-600 hover:underline hover:underline-offset-2"
        >
          一覧へ戻る
        </Link>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center items-center overflow-y-auto py-2">
        <div className="flex flex-col mt-4 w-[70%]">
          <div className="flex justify-between items-center text-md">
            <strong className="sm:text-2xl text-gray-800">お名前</strong>
            {isEditing ? (
              <Input
                name="name"
                className={`w-[55%] p-2 rounded border ${
                  formErrors.name ? "border-red-500" : ""
                }`}
                value={formData.name}
                onChange={handleInputChange}
              />
            ) : (
              <div className="w-[55%] p-2 bg-gray-100 rounded border">
                {reservationData.customer.name}
              </div>
            )}
          </div>
          {formErrors.name && (
            <p className="text-red-500 text-sm text-right mt-1">
              {formErrors.name}
            </p>
          )}
          <div className="flex justify-between items-center text-md mt-8">
            <strong className="sm:text-2xl text-gray-800">電話番号</strong>
            {isEditing ? (
              <Input
                name="phone"
                className={`w-[55%] p-2 rounded border ${
                  formErrors.phone ? "border-red-500" : ""
                }`}
                value={formData.phone ?? ""}
                onChange={handleInputChange}
              />
            ) : (
              <div className="w-[55%] p-2 bg-gray-100 rounded border">
                {reservationData.customer.phone}
              </div>
            )}
          </div>
          {formErrors.phone && (
            <p className="text-red-500 text-sm text-right mt-1">
              {formErrors.phone}
            </p>
          )}
          <div className="flex justify-between items-center text-md mt-8">
            <strong className=" sm:text-2xl text-gray-800">商品名</strong>
            {isEditing ? (
              <Textarea
                name="productName"
                className={`w-[55%] p-2 rounded border ${
                  formErrors.productName ? "border-red-500" : ""
                }`}
                rows={6}
                value={formData.productName}
                onChange={handleInputChange}
              />
            ) : (
              <div className="w-[55%] p-2 bg-gray-100 rounded border">
                <ul>
                  {reservationData.productName
                    .split(",")
                    .map((reservation, index) => (
                      <li
                        key={index}
                        className="py-1"
                      >{`・${reservation.trim()}`}</li>
                    ))}
                </ul>
              </div>
            )}
          </div>
          {formErrors.productName && (
            <p className="text-red-500 text-sm text-right mt-1">
              {formErrors.productName}
            </p>
          )}
          <div className="flex justify-between items-center text-md mt-8">
            <strong className="sm:text-2xl text-gray-800">合計金額</strong>
            {isEditing ? (
              <Input
                name="price"
                className={`w-[55%] p-2 rounded border ${
                  formErrors.price ? "border-red-500" : ""
                }`}
                value={formData.price}
                onChange={handleInputChange}
              />
            ) : (
              <div className="w-[55%] p-2 bg-gray-100 rounded border">{`¥${reservationData.price}`}</div>
            )}
          </div>
          {formErrors.price && (
            <p className="text-red-500 text-sm text-right mt-1">
              {formErrors.price}
            </p>
          )}
          <div className="flex justify-between items-center text-md mt-8">
            <strong className="sm:text-2xl text-gray-800">予約受付日時</strong>
            {isEditing ? (
              <div className="w-[55%]">
                <DateSelect
                  setYear={setReservationYear}
                  setMonth={setReservationMonth}
                  setDay={setReservationDay}
                  year={reservationYear}
                  month={reservationMonth}
                  day={reservationDay}
                />
              </div>
            ) : (
              <div className="w-[55%] p-2 bg-gray-100 rounded border">{`${new Date(
                reservationData.reservationDate
              ).toLocaleDateString()}`}</div>
            )}
          </div>
          <div className="flex justify-between items-center text-md mt-8">
            <strong className="sm:text-2xl text-gray-800">お渡し日時</strong>
            {isEditing ? (
              <div className="w-[55%]">
                <DateSelect
                  setYear={setDeliveryYear}
                  setMonth={setDeliveryMonth}
                  setDay={setDeliveryDay}
                  year={deliveryYear}
                  month={deliveryMonth}
                  day={deliveryDay}
                />
              </div>
            ) : (
              <div className="w-[55%] p-2 bg-gray-100 rounded border">
                {new Date(
                  reservationData.deliveryDate
                    ? reservationData.deliveryDate
                    : "未定"
                ).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center gap-12 font-semibold pt-4">
        {isEditing ? (
          <>
            <Button
              variant="default"
              className="text-lg bg-blue-600 text-white"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "保存中..." : "保存"}
            </Button>
            <Button
              variant="outline"
              className="text-lg"
              onClick={() => {
                setFormErrors({});
                setFormData(originalData);
                resetDate();
                setIsEditing(false);
              }}
            >
              戻る
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              className="black text-lg"
              onClick={() => {
                setIsEditing(true);
              }}
            >
              編集
            </Button>
            <DeleteButton id={reservationData.id} type={decodeType} />
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default ReservationDetailCard;
