import HistoryList from "@/components/historyList/HistoryList";
import { getReservationByCustomerName } from "@/lib/getReservationsByType";

const UserHistoryPage = async ({ params }: { params: { type: string, name: string } }) => {
  const { type, name } = await params;
  const customerName = decodeURIComponent(name);
  const customerReservations = await getReservationByCustomerName(customerName);

  return (
    <HistoryList admin={false} type={type} name={customerName} customerReservations={customerReservations}/>
  );
};

export default UserHistoryPage;