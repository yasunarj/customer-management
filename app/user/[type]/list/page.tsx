import UserSheetMenu from "@/components/sheet/UserSheetMenu";
import getReservationByType from "@/lib/getReservationsByType";
import { Reservation } from "@/types/reservation";
type ReservationListData = Reservation[] | undefined;

const UserReservationList = async ({
  params,
}: {
  params: { type: string };
}) => {
  const { type } = await params;
  const decodeType = decodeURIComponent(type);
  const reservations: ReservationListData = await getReservationByType(
    decodeType
  );
  if (!reservations || reservations.length === 0) {
    return (
      <div className="flex-grow flex justify-center items-center bg-center bg-cover bg-[url('/images/istockphoto-1499955814-612x612.jpg')]">
        <div className="overflow-y-auto w-[95%] h-[95%] bg-white rounded-xl shadow-4xl p-4 relative">
          <h1 className="text-gray-800 text-xl sm:text-3xl font-bold text-center">
            {decodeType}の予約一覧
          </h1>
          <p className="h-[80%] flex justify-center items-center text-md sm:text-xl">
            データがありません
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex-grow flex justify-center items-center bg-center bg-cover bg-[url('/images/istockphoto-1499955814-612x612.jpg')]">
      <div className="overflow-y-auto w-[95%] h-[95%] bg-white rounded-xl shadow-4xl p-4 relative">
        <h1 className="text-gray-800 text-xl sm:text-3xl font-bold text-center">
          {decodeType}の予約一覧
        </h1>
        <div className="absolute top-4 right-4">
          <UserSheetMenu type={decodeType} />
        </div>
        <table className="table-auto w-full border-collapse border border-gray-700 mt-4 text-gray-700">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">お客様名</th>
              <th className="border border-gray-300 px-4 py-2">電話番号</th>
              <th className="border border-gray-300 px-4 py-2">予約商品名</th>
              <th className="border border-gray-300 px-4 py-2">合計金額</th>
              <th className="border border-gray-300 px-4 py-2">予約受付日</th>
              <th className="border border-gray-300 px-4 py-2">お渡し日</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id}>
                <td className="text-sm border border-gray-300 px-4 py-2 text-center">
                  {reservation.customer.name}
                </td>
                <td className="text-sm border border-gray-300 px-4 py-2 text-center">
                  {reservation.customer.phone}
                </td>
                <td className="text-sm border border-gray-300 px-4 py-2  max-w-[200px] relative group">
                  <div className="truncate">{reservation.productName}</div>
                  <span className="absolute left-0 top-0 mt-1 w-max max-w-xs p-2 bg-gray-700 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
                    <ul className="px-1">{reservation.productName.split(",").map((item, index) => (<li key={index} className="py-1">{item.trim()}</li>))}</ul>
                  </span>
                </td>
                <td className="text-sm border border-gray-300 px-4 py-2 text-center">{`¥${reservation.price.toLocaleString()}`}</td>
                <td className="text-sm border border-gray-300 px-4 py-2 text-center">{new Date(reservation.reservationDate).toLocaleDateString()}</td>
                <td className="text-sm border border-gray-300 px-4 py-2 text-center">{new Date(reservation.reservationDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserReservationList;
