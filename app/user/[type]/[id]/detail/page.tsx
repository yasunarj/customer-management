import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getReservationByTypeWithId } from "@/lib/getReservationsByType";
import Link from "next/link";

const UserDetailPage = async ({
  params,
}: {
  params: { type: string; id: string };
}) => {
  const { type, id } = await params;
  const reservationId = parseInt(id, 10);
  const decodeType = decodeURIComponent(type);
  const reservation = await getReservationByTypeWithId(
    decodeType,
    reservationId
  );

  if (!reservation) {
    <div
      className="flex-grow flex justify-center items-center bg-center bg-cover"
      style={{
        backgroundImage: "url('/images/istockphoto-1499955814-612x612.jpg')",
      }}
    >
      <div className="w-[80%] h-[95%] bg-white rounded-xl shadow-4xl p-4">
        <div className="flex justify-center items-center">
          データがありません
        </div>
      </div>
    </div>;
  }

  return (
    <div
      className="flex-grow flex justify-center items-center bg-center bg-cover"
      style={{
        backgroundImage: "url('/images/istockphoto-1499955814-612x612.jpg')",
      }}
    >
      <Card className="flex flex-col w-[80%] max-w-4xl min-w-[580px] h-[95%] bg-white rounded-xl shadow-4xl p-4 border-double border-8 border-gray-800">
        <CardHeader className="relative">
          <CardTitle className="sm:text-3xl text-gray-800 font-semibold text-center">
            {reservation?.customer.name} 様の予約状況
          </CardTitle>
          <Link
            href={`/user/${decodeType}/list`}
            className="text-sm sm:text-lg absolute right-4 text-blue-600 hover:underline hover:underline-offset-2"
          >
            一覧へ戻る
          </Link>
        </CardHeader>
        <CardContent className="flex flex-1 justify-center items-center overflow-y-auto">
          <div className="flex flex-col w-[70%] gap-14">
            <div className="flex justify-between items-center text-md">
              <strong className="sm:text-2xl text-gray-800">お名前</strong>
              <div className="w-[55%] p-2 bg-gray-100 rounded border">
                {reservation?.customer.name}
              </div>
            </div>
            <div className="flex justify-between items-center text-md">
              <strong className="sm:text-2xl text-gray-800">電話番号</strong>
              <div className="w-[55%] p-2 bg-gray-100 rounded border">
                {reservation?.customer.phone}
              </div>
            </div>
            <div className="flex justify-between items-center text-md">
              <strong className="sm:text-2xl text-gray-800">商品名</strong>
              <div className="w-[55%] p-2 bg-gray-100 rounded border">
                <ul>
                  {reservation?.productName.split(",").map((item, index) => (
                    <li key={index}>{`・${item}`}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex justify-between items-center text-md">
              <strong className="sm:text-2xl text-gray-800">合計金額</strong>
              <div className="w-[55%] p-2 bg-gray-100 rounded border">
                {`¥${reservation?.price}`}
              </div>
            </div>
            <div className="flex justify-between items-center text-md">
              <strong className="sm:text-2xl text-gray-800">予約受付日時</strong>
              <div className="w-[55%] p-2 bg-gray-100 rounded border">
                {new Date(reservation!.reservationDate).toLocaleDateString()}
              </div>
            </div>
            <div className="flex justify-between items-center text-md">
              <strong className="sm:text-2xl text-gray-800">お渡し日時</strong>
              <div className="w-[55%] p-2 bg-gray-100 rounded border">
                {new Date(reservation?.deliveryDate ? reservation.deliveryDate : "未定").toLocaleDateString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetailPage;
