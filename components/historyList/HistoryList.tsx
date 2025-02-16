"use client";
import { HistoryListProps } from "@/types/reservation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
const HistoryList = ({
  admin,
  // type,
  name,
  customerReservations,
}: HistoryListProps) => {
  const router = useRouter();
  const [activeToolTip, setActiveToolTip] = useState<number | null>(null);
  if (!customerReservations) {
    return (
      <div
        className="flex-grow flex justify-center items-center bg-center bg-cover"
        style={{
          backgroundImage: "url('/images/istockphoto-1499955814-612x612.jpg')",
        }}
      >
        <div className="w-[80%] h-[95%] bg-white rounded-xl shadow-4xl p-4">
          <div className="h-full flex justify-center items-center">
            データがありません
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      className="flex-grow flex justify-center items-center bg-center bg-cover"
      style={{
        backgroundImage: "url('/images/istockphoto-1499955814-612x612.jpg')", // cSpell: disable-line
      }}
    >
      <div className="overflow-y-auto w-[95%] sm:w-[90%] h-[95%] bg-white rounded-xl shadow-4xl p-4">
        <header className="relative">
          <h1 className="sm:text-3xl text-gray-800 font-semibold text-center">
            {name} 様の予約履歴
          </h1>
          <div
            className="select-none text-sm sm:text-lg absolute top-1 right-2 text-blue-600 hover:underline hover:underline-offset-2 cursor-pointer"
            onClick={() => router.back()}
          >
            戻る
          </div>
        </header>
        <table className="table-auto w-full border-collapse border border-gray-300 mt-4 text-gray-700">
          <thead>
            <tr>
              <th className="border border-gray-300 px4 py-2">予約項目</th>
              <th className="border border-gray-300 px4 py-2 ">予約商品名</th>
              <th className="border border-gray-300 px4 py-2 hidden sm:table-cell">
                合計金額
              </th>
              <th className="border border-gray-300 px4 py-2 hidden sm:table-cell">
                予約受付日
              </th>
              <th className="border border-gray-300 px4 py-2 hidden sm:table-cell">
                お渡し日
              </th>
              <th className="border border-gray-300 px4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {customerReservations.map((reservation) => (
              <tr key={reservation.id}>
                <td className="text-sm border border-gray-300 px-4 py-2 flex justify-center min-w-[120px]">
                  <p className="w-[80px]">{reservation.type}</p>
                </td>
                <td
                  className="text-sm border border-gray-300 px-4 py-2 max-w-[200px] relative"
                  onClick={() => setActiveToolTip(reservation.id)}
                  onBlur={() => setActiveToolTip(null)}
                  onMouseEnter={() => setActiveToolTip(reservation.id)}
                  onMouseLeave={() => setActiveToolTip(null)}
                >
                  <div className="truncate">{reservation.productName}</div>
                  {(activeToolTip === reservation.id) &&
                  (
                    <span className="absolute left-0 top-0 mt-1 w-max max-w-xs p-2 bg-gray-700 text-white text-sm rounded shadow-lg z-50">
                      <ul className="px-1 max-w-[185px] sm:max-w-[100%]">
                        {reservation.productName
                          .split(",")
                          .map((item, index) => (
                            <li key={index} className="py-1">
                              {item.trim()}
                            </li>
                          ))}
                      </ul>
                    </span>
                  )}
                </td>
                <td className="text-sm border border-gray-300 px-4 py-2 text-center hidden sm:table-cell">{`¥${reservation.price}`}</td>
                <td className="text-sm border border-gray-300 px-4 py-2 text-center hidden sm:table-cell">
                  {new Date(reservation.reservationDate).toLocaleDateString()}
                </td>
                <td className="text-sm border border-gray-300 px-4 py-2 text-center hidden sm:table-cell">
                  {new Date(reservation.deliveryDate!).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 text-gray-600 min-w-[60px]">
                  <Link
                    href={`/${admin ? "admin" : "user"}/${reservation.type}/${
                      reservation.id
                    }/detail`}
                    className="flex justify-center"
                  >
                    詳細
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryList;
