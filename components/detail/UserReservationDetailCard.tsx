"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Reservation } from "@/types/reservation";
import { useRouter } from "next/navigation";

interface UserReservationDetailCardProps {
  reservationData?: Reservation;
}

const UserReservationDetailCard = ({
  reservationData,
}: UserReservationDetailCardProps) => {
  const router = useRouter();
  return (
    <div
      className="h-[90dvh] flex justify-center items-center bg-center bg-cover"
      style={{
        backgroundImage: "url('/images/istockphoto-1499955814-612x612.jpg')",
      }}
    >
      <Card className="flex flex-col max-w-4xl w-[98%] h-[98%] sm:w-[95%] sm:h-[95%] bg-white rounded-xl shadow-4xl sm:p-4 border-double border-8 border-gray-800 overflow-y-auto">
        <CardHeader className="relative">
          <CardTitle className="text-xl sm:text-3xl text-gray-800 font-semibold text-center">
            {reservationData?.customer.name} 様の予約状況
          </CardTitle>
          <div
            className="select-none text-sm sm:text-lg absolute sm:top-5 right-4 text-blue-600 hover:underline hover:underline-offset-2 cursor-pointer"
            onClick={() => router.back()}
          >
            戻る
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 justify-center items-center">
          <div className="flex flex-col w-[98%] sm:w-[70%] gap-8 sm:gap-12">
            <div className="flex justify-between items-center text-sm md:text-lg">
              <strong className="sm:text-2xl text-gray-800">お名前</strong>
              <div className="w-[70%] sm:w-[60%] p-2 bg-gray-100 rounded border">
                {reservationData?.customer.name}
              </div>
            </div>
            <div className="flex justify-between items-center text-sm md:text-lg">
              <strong className="sm:text-2xl text-gray-800">電話番号</strong>
              <div className="w-[70%] sm:w-[60%] p-2 bg-gray-100 rounded border">
                {reservationData?.customer.phone}
              </div>
            </div>
            <div className="flex justify-between items-center text-sm md:text-lg">
              <strong className="sm:text-2xl text-gray-800">商品名</strong>
              <div className="w-[70%] sm:w-[60%] p-2 bg-gray-100 rounded border">
                <ul className="px-1 max-w-[185px] sm:max-w-[100%]">
                  {reservationData?.productName.split(",").map((item, index) => (
                    <li key={index} className="py-1">{`・${item.trim()}`}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm md:text-lg">
              <strong className="sm:text-2xl text-gray-800">合計金額</strong>
              <div className="w-[70%] sm:w-[60%] p-2 bg-gray-100 rounded border">
                {`¥${reservationData?.price}`}
              </div>
            </div>
            <div className="flex justify-between items-center text-sm md:text-lg">
              <strong className="sm:text-2xl text-gray-800">
                予約受付日時
              </strong>
              <div className="w-[70%] sm:w-[60%] p-2 bg-gray-100 rounded border">
                {new Date(reservationData!.reservationDate).toLocaleDateString()}
              </div>
            </div>
            <div className="flex justify-between items-center text-sm md:text-lg">
              <strong className="sm:text-2xl text-gray-800">お渡し日時</strong>
              <div className="w-[70%] sm:w-[60%] p-2 bg-gray-100 rounded border">
                {new Date(
                  reservationData?.deliveryDate ? reservationData.deliveryDate : "未定"
                ).toLocaleDateString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserReservationDetailCard;
