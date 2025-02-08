import prisma from "./prisma";

const getReservationsByType = async (type: string) => {
  try {
    const reservations = await prisma.reservation.findMany({
      where: {
        type,
      },
      include: {
        customer: true,
      },
      orderBy: {
        deliveryDate: "desc",
      },
      take: 100,
    });
    return reservations;
  } catch (e) {
    console.error("データ取得エラー:", e);
  }
};

const getReservationByTypeWithId = async (type: string, id: number) => {
  try {
    const reservation = await prisma.reservation.findFirst({
      where: {
        type,
        id,
      },
      include: { customer: true },
    });
    return reservation;
  } catch (e) {
    console.error("データ取得エラー:", e);
  }
};

const getReservationByCustomerName = async (name: string) => {
  try {
    const customers = await prisma.customer.findMany({
      where: {
        name,
      },
      include: { reservations: { orderBy: { deliveryDate: "desc" } } },
    });
    const customerReservations = customers.flatMap((customer) =>
      customer.reservations.map((reservation) => ({
        customerName: customer.name,
        customerPhone: customer.phone,
        ...reservation,
      }))
    );
    return customerReservations;
  } catch (e) {
    console.error("データ取得エラー", e);
  }
};

export { getReservationByTypeWithId, getReservationByCustomerName };
export default getReservationsByType;
