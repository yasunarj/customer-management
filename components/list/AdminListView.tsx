"use client";
import Link from "next/link";
import SheetMenu from "@/components/sheet/SheetMenu";
import { Reservation } from "@/types/reservation";
import { useState } from "react";
import SearchComponent from "../searchList/SearchComponent";
type ReservationListData = Reservation[] | undefined;

import { useRouter } from "next/navigation"; //デバック

const AdminListView = ({
  decodeType,
  reservations,
}: {
  decodeType: string;
  reservations: ReservationListData;
}) => {
  const menuList = [
    { listName: `予約商材一覧へ`, link: `/admin/dashboard/` },
    { listName: `新規登録`, link: `/admin/${decodeType}/new/` },
    { listName: `アタックリスト`, link: `/admin/dashboard` },
  ];
  const [reservationsList, setReservationList] =
    useState<ReservationListData>(reservations);
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const router = useRouter(); //デバック
  const handleGetLists = () => {
    router.refresh();
  }; //デバック
  if (!reservationsList || reservationsList.length === 0) {
    return (
      <div className="select-none h-[90vh] bg-center bg-cover flex justify-center items-center bg-[url('/images/istockphoto-1499955814-612x612.jpg')]">
        <div className="overflow-y-auto w-[95%] h-[95%] bg-white rounded-xl shadow-4xl p-4 relative">
          <h1 className="text-gray-800 text-xl sm:text-3xl font-bold text-center">
            {decodeType}の予約一覧 (管理者用)
          </h1>
          <div className="absolute top-4 right-4">
            <SheetMenu menuList={menuList} />
          </div>
          <SearchComponent
            type={decodeType}
            setReservationList={(data) => {
              setReservationList(data);
              setIsSearched(true);
            }}
            isSearched={isSearched}
            handleGetLists={handleGetLists}
          />
          <p className="h-[80%] flex justify-center items-center text-md sm:text-xl ">
            データがありません
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="select-none h-[90vh] bg-center bg-cover flex justify-center items-center bg-[url('/images/istockphoto-1499955814-612x612.jpg')]">
      <div className="overflow-y-auto  w-[95%] h-[95%] bg-white rounded-xl shadow-4xl p-4 relative">
        <h1 className="text-gray-800 text-xl sm:text-3xl font-bold text-center">
          {decodeType}の予約一覧 (管理者用)
        </h1>
        <SearchComponent
          type={decodeType}
          setReservationList={(data) => {
            setReservationList(data);
            setIsSearched(true);
          }}
          isSearched={isSearched}
          handleGetLists={handleGetLists}
        />
        <div className="absolute top-5 right-4">
          <SheetMenu menuList={menuList} />
        </div>
        <table className="table-auto w-full border-collapse border border-gray-300 mt-4 text-gray-700">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">お客様名</th>
              <th className="border border-gray-300 px-4 py-2">電話番号</th>
              <th className="border border-gray-300 px-4 py-2">予約商品名</th>
              <th className="border border-gray-300 px-4 py-2">合計金額</th>
              <th className="border border-gray-300 px-4 py-2">予約受付日</th>
              <th className="border border-gray-300 px-4 py-2">お渡し日</th>
              <th className="border border-gray-300 px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {reservationsList.map((reservation) => {
              return (
                <tr key={reservation.id}>
                  <td className="text-sm border border-gray-300 px-4 py-2 text-center min-w-[120px]">
                    <Link href={`/admin/${decodeType}/customer/${reservation.customer.name}/history`}>{reservation.customer.name}</Link>
                  </td>
                  <td className="text-sm border border-gray-300 px-4 py-2 text-center">
                    {reservation.customer.phone}
                  </td>
                  <td className="text-sm border border-gray-300 px-4 py-2 max-w-[200px]  relative group">
                    <div className="truncate">{reservation.productName}</div>
                    <span className="absolute left-0 top-0 mt-1 w-max max-w-xs p-2 bg-gray-700 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
                      <ul className="px-1">
                        {reservation.productName
                          .split(",")
                          .map((item, index) => (
                            <li key={index} className="py-1">
                              {item.trim()}
                            </li>
                          ))}
                      </ul>
                    </span>
                  </td>
                  <td className="text-sm border border-gray-300 px-4 py-2 text-center">{`¥${reservation.price.toLocaleString()}`}</td>
                  <td className="text-sm border border-gray-300 px-4 py-2 text-center">
                    {new Date(reservation.reservationDate).toLocaleDateString()}
                  </td>
                  <td className="text-sm border border-gray-300 px-4 py-2 text-center">
                    {reservation.deliveryDate
                      ? new Date(reservation.deliveryDate).toLocaleDateString()
                      : "未定"}
                  </td>
                  <td className="border border-gray-300 text-gray-600 min-w-[60px]">
                    <Link
                      href={`/admin/${decodeType}/${reservation.id}/detail`}
                      className="flex justify-center"
                    >
                      詳細
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminListView;
