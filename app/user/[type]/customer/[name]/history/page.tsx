import HistoryList from "@/components/historyList/HistoryList";
import { getReservationByCustomerName } from "@/lib/getReservationsByType";

type UserHistoryPageProps = {
  params: Promise<{
    type: string;
    name: string;
  }>
}

const UserHistoryPage = async (props: UserHistoryPageProps) => {
  const params = await props.params;
  const { type, name } = params;
  const customerName = decodeURIComponent(name);
  const customerReservations = await getReservationByCustomerName(customerName);

  return (
    <HistoryList admin={false} type={type} name={customerName} customerReservations={customerReservations}/>
  );
};

export default UserHistoryPage;