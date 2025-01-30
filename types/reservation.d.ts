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

export type {
  Reservation
};
