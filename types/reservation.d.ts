interface Reservation {
  id: number;
  productName: string;
  price: number;
  reservationDate: Date;
  deliveryDate: Date | null
  type: string,
  customer: {
    id: number,
    name: string,
    phone: string | null,
  }
};

interface HistoryListProps {
  admin: boolean;
  type: string;
  name: string;
  customerReservations: {
    customerName: string;
    customerPhone: string | null;
    id: number;
    productName: string;
    price: number;
    reservationDate: Date;
    deliveryDate: Date | null;
    customerId: number;
    type: string;
  }[] | undefined;
}

export type {
  Reservation,
  HistoryListProps
};
