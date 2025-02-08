import HistoryList from "@/components/historyList/HistoryList";
import { getReservationByCustomerName } from "@/lib/getReservationsByType";

const AdminHistoryPage = async ({ params }: { params: { type: string, name: string} }) => {
  const { name, type } = await params;
  const customerName = decodeURIComponent(name);
  const customerReservations = await getReservationByCustomerName(customerName);
  return (
    <HistoryList admin={true} type={type} name={customerName} customerReservations={customerReservations}/>
  );
};

export default AdminHistoryPage;