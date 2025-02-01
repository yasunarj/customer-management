import { Reservation } from "@/types/reservation";

const getInitialFormData = (reservationData: Reservation) => {
  return {
    name: reservationData.customer.name,
    phone: reservationData.customer.phone,
    productName: reservationData.productName,
    price: reservationData.price.toString(),
  };
};

const getInitialFormDate = (reservationData: Reservation) => {
  return {
    initialReservationYear: reservationData.reservationDate.getFullYear(),
    initialReservationMonth: reservationData.reservationDate.getMonth() + 1,
    initialReservationDay: reservationData.reservationDate.getDate(),
    initialDeliveryYear:  reservationData.deliveryDate!.getFullYear(),
    initialDeliveryMonth: reservationData.deliveryDate!.getMonth() + 1,
    initialDeliveryDay: reservationData.deliveryDate!.getDate()
  }
}

export { getInitialFormData, getInitialFormDate };
