import HistoryList from "@/components/historyList/HistoryList";
import { getReservationByCustomerName } from "@/lib/getReservationsByType";

type AdminHistoryPageProps = {
  params: Promise<{
    type: string;
    name: string;
  }>;
};

const AdminHistoryPage = async (props: AdminHistoryPageProps) => {
  const params = await props.params;
  const { name, type } = params;
  const customerName = decodeURIComponent(name);
  const customerReservations = await getReservationByCustomerName(customerName);
  return (
    <HistoryList
      admin={true}
      type={type}
      name={customerName}
      customerReservations={customerReservations}
    />
  );
};

export default AdminHistoryPage;
