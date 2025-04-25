import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const POST = async (req: Request) => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "認証されていません" },
        { status: 401 }
      );
    }

    if (req.method !== "POST") {
      return NextResponse.json(
        { error: "メソッドが許可されていません" },
        { status: 405 }
      );
    }

    const contentType = req.headers.get("Content-Type")?.toLowerCase();
    if (contentType !== "application/json") {
      return NextResponse.json(
        { error: "JSON形式で送信してください" },
        { status: 400 }
      );
    }

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

    if (!name || !productName || !price || !reservationDate || !type) {
      return NextResponse.json(
        {
          error: "必須項目が不足しています",
        },
        { status: 400 }
      );
    }

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
      },
    });

    const resultReservation = await prisma.reservation.create({
      data: {
        productName,
        price: parsePrice,
        reservationDate: new Date(reservationDate),
        deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
        type,
        customer: {
          connect: { id: resultCustomer.id },
        },
      },
    });

    return NextResponse.json(
      {
        message: "予約が正常に作成されました",
        customer: resultCustomer,
        reservation: resultReservation,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("サーバーエラー", e);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
};

export { POST };
