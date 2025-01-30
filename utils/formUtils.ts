import { Reservation } from "@/types/reservation";

const getInitialFormData = (reservationData: Reservation) => {
  return {
    name: reservationData.customer.name,
    phone: reservationData.customer.phone,
    productName: reservationData.productName,
    price: reservationData.price.toString(),
    reservationDate: new Date(
      reservationData.reservationDate
    ).toLocaleDateString(),
    deliveryDate: reservationData.deliveryDate
      ? new Date(reservationData.deliveryDate).toLocaleDateString()
      : "未定",
  };
};

export { getInitialFormData };
