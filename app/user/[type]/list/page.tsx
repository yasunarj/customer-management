import UserListView from "@/components/list/UserListView";
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
  return (
    <UserListView key={new Date().getTime()} decodeType={decodeType} reservations={reservations} />
  )
}

export default UserReservationList;
