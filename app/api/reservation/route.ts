import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const {
      name,
      phone,
      productName,
      price,
      reservationDate,
      deliveryDate,
      type,
    } = body;

    const parsePrice = Number(price);
    if (isNaN(parsePrice)) {
      return NextResponse.json(
        { error: "価格を数字にしてください" },
        { status: 400 }
      );
    }

    const resultCustomer = await prisma.customer.create({
      data: {
        name,
        phone,
      }
    });

    const resultReservation = await prisma.reservation.create({
      data: {
        productName,
        price: parsePrice,
        reservationDate: new Date(reservationDate),
        deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
        type,
        customer: {
          connect: { id: resultCustomer.id }
        },
      }
    });

    return NextResponse.json({
      message: "予約が正常に作成されました",
      customer: resultCustomer,
      reservation: resultReservation,
    });
  } catch (e) {
    console.error("サーバーエラー", e);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
};

export { POST };
