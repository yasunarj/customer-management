import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const DELETE = async (
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) => {
  const params = await props.params;
  try {
    const reservationId = parseInt(params.id, 10);
    if (isNaN(reservationId)) {
      return NextResponse.json({ error: "無効なIDです" }, { status: 400 });
    }

    const reservationData = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { customer: true },
    });
    if (!reservationData) {
      return NextResponse.json(
        { error: "該当する予約情報が見つかりません" },
        { status: 404 }
      );
    }

    await prisma.$transaction([
      prisma.reservation.delete({
        where: { id: reservationId },
      }),
      prisma.customer.delete({
        where: { id: reservationData.customerId },
      }),
    ]);
    return NextResponse.json({ message: "削除が成功しました" });
  } catch (e) {
    console.error("削除エラー:", e);
    return NextResponse.json(
      { error: "削除できませんでした" },
      { status: 500 }
    );
  }
};

const PUT = async (
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) => {
  const params = await props.params;
  try {
    const parseId = parseInt(params.id, 10);
    if (isNaN(parseId)) {
      return NextResponse.json({ error: "無効なIDです" }, { status: 400 });
    }
    const { name, phone, productName, price, reservationDate, deliveryDate } =
      await req.json();
    const parsePrice = parseInt(price);
    if (isNaN(parsePrice)) {
      return NextResponse.json({ error: "無効な価格です" }, { status: 400 });
    }

    const reservationData = await prisma.reservation.findUnique({
      where: { id: parseId },
      include: { customer: true },
    });

    if (!reservationData) {
      return NextResponse.json(
        { error: "データが見つかりません" },
        { status: 400 }
      );
    }

    const updateCustomerData = await prisma.customer.update({
      where: { id: reservationData.customer.id },
      data: {
        name,
        phone,
      },
    });

    const updateReservationData = await prisma.reservation.update({
      where: { id: reservationData.id },
      data: {
        productName,
        price: parsePrice,
        reservationDate: new Date(reservationDate),
        deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
      },
    });
    if (!updateReservationData || !updateCustomerData) {
      return NextResponse.json({ error: "データの登録に失敗しました" });
    }
    return NextResponse.json(
      {
        message: "データの保存に成功しました",
        customer: updateCustomerData,
        reservation: updateReservationData,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("データを登録できませんでした", e);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
};

export { DELETE, PUT };
