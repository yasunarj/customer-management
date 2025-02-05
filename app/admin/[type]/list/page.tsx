import ListView from "@/components/list/AdminListView";
import decodeURIComponent from "decode-uri-component";
import { Reservation } from "@/types/reservation";
import getReservationsByType from "@/lib/getReservationsByType";
type ReservationListData = Reservation[] | undefined;
const AdminReservationList = async ({
  params,
}: {
  params: { type: string };
}) => {
  const { type } = await params;
  const decodeType = decodeURIComponent(type);
  const reservations: ReservationListData = await getReservationsByType(
    decodeType
  );
  return (
    <ListView key={new Date().getTime()} decodeType={decodeType} reservations={reservations} />
  )
};

export default AdminReservationList;