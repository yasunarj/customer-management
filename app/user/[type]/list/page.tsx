import UserListView from "@/components/list/UserListView";
import getReservationByType from "@/lib/getReservationsByType";
import { Reservation } from "@/types/reservation";

type ReservationListData = Reservation[] | undefined;
type UserReservationListProps = {
  params: Promise<{
    type: string;
  }>
}
const UserReservationList = async (props: UserReservationListProps) => {
  const params = await props.params;
  const { type } = params;
  const decodeType = decodeURIComponent(type);
  const reservations: ReservationListData = await getReservationByType(
    decodeType
  );
  return (
    <UserListView key={new Date().getTime()} decodeType={decodeType} reservations={reservations} />
  )
}

export default UserReservationList;
