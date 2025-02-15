import ReservationDetailCard from "@/components/detail/reservationCard";
import { getReservationByTypeWithId } from "@/lib/getReservationsByType";
type ReservationDetailPageProps = {
  params: {
    type: string;
    id: string;
  };
};
const ReservationDetailPage = async ({ params }: ReservationDetailPageProps) => {
  const { type, id } = params;
  const reservationId = parseInt(id, 10);
  const decodeType = decodeURIComponent(type);
  const reservation = await getReservationByTypeWithId(
    decodeType,
    reservationId
  );

  if (!reservation) {
    return (
      <div
        className="flex-grow flex justify-center items-center bg-center bg-cover"
        style={{
          backgroundImage: "url('/images/istockphoto-1499955814-612x612.jpg')",
        }}
      >
        <div className="w-[80%] h-[95%] bg-white rounded-xl shadow-4xl p-4">
          <div className="flex justify-center items-center h-[80%]">
            データがありません
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-[90dvh] flex justify-center items-center bg-center bg-cover bg-[url('/images/istockphoto-1499955814-612x612.jpg')]" // cSpell: disable-line
    >
      <ReservationDetailCard
        reservationData={reservation}
        decodeType={decodeType}
      />
    </div>
  );
};

export default ReservationDetailPage;
