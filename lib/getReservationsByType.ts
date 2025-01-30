import prisma from "./prisma";

const getReservationsByType = async (type: string) => {
  try {
    const reservations = await prisma.reservation.findMany({
      where: {
        type,
      },
      include: { customer: true },
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
      include: { customer: true }
    });
    return reservation;
  } catch(e) {
    console.error("データ取得エラー:", e);
  }
}

export { getReservationByTypeWithId };
export default getReservationsByType;
