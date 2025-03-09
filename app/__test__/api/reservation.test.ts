import { POST } from "@/app/api/reservation/route";
import prisma from "@/lib/prisma";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, { status } = { status: 200 }) => ({
      json: () => Promise.resolve(data),
      status,
    })),
  },
}));

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    customer: {
      create: jest.fn(),
    },
    reservation: {
      create: jest.fn(),
    },
  },
}));

describe("POST /api/reservation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (prisma.customer.create as jest.Mock).mockResolvedValue({
      id: 1,
      name: "テストユーザー",
      phone: "09012345678",
    });
    (prisma.reservation.create as jest.Mock).mockResolvedValue({
      id: 1,
      productName: "テスト商品",
      price: 1234,
      reservationDate: new Date("2025-1-1"),
      deliveryDate: new Date("2025-1-10"),
      type: "test_type",
      customerId: 1,
    });
  });

  it("正常に予約情報が作成される", async () => {
    const requestBody = {
      name: "テストユーザー",
      phone: "09012345678",
      productName: "テスト商品",
      price: 1234,
      reservationDate: "2025-1-1",
      deliveryDate: "2025-1-10",
      type: "test_type",
    };

    const req = new Request("/api/reservation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(prisma.customer.create).toHaveBeenCalledWith({
      data: {
        name: "テストユーザー",
        phone: "09012345678",
      },
    });

    expect(prisma.reservation.create).toHaveBeenCalledWith({
      data: {
        productName: "テスト商品",
        price: 1234,
        reservationDate: new Date("2025-1-1"),
        deliveryDate: new Date("2025-1-10"),
        type: "test_type",
        customer: {
          connect: { id: 1 },
        },
      },
    });

    expect(json).toEqual(
      expect.objectContaining({ message: "予約が正常に作成されました" })
    );
  });

  it("成功時にstatus番号200を返す", async () => {
    const requestBody = {
      name: "テストユーザー",
      phone: "09012345678",
      productName: "テスト商品",
      price: 1234,
      reservationDate: "2025-1-1",
      deliveryDate: "2025-1-10",
      type: "test_type",
    };

    const request = new Request("/api/reservation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const res = await POST(request);

    expect(res.status).toEqual(200);
  });

  it("必須項目が抜けている場合に, 400エラーを返す", async () => {
    const requestBody = {
      phone: "09012345678",
      productName: "テスト商品",
      price: 1234,
      reservationDate: "2025-1-1",
      deliveryDate: "2025-1-10",
      type: "test_type",
    };

    const request = new Request("/api/reservation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const res = await POST(request);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json).toEqual(
      expect.objectContaining({ error: "必須項目が不足しています" })
    );
  });

  it("価格が数字ではない場合には, 400エラーを返す", async () => {
    const requestBody = {
      name: "テスト商品",
      phone: "09012345678",
      productName: "テスト商品",
      price: "二千五百円",
      reservationDate: "2025-1-1",
      deliveryDate: "2025-1-10",
      type: "test_type",
    };

    const request = new Request("/api/reservation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const res = await POST(request);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json).toEqual(
      expect.objectContaining({ error: "価格を数字にしてください" })
    );
  });

  it("customer.createでエラーが発生した場合に, 500エラーを返す", async () => {
    (prisma.customer.create as jest.Mock).mockRejectedValue(
      new Error("DBエラー")
    );

    const requestBody = {
      name: "テストユーザー",
      phone: "09012345678",
      productName: "テスト商品",
      price: 1234,
      reservationDate: "2025-1-1",
      deliveryDate: "2025-1-10",
      type: "test_type",
    };

    const request = new Request("/api/reservation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const res = await POST(request);
    const json = await res.json();
    expect(res.status).toBe(500);
    expect(json).toEqual(
      expect.objectContaining({ error: "サーバーエラーが発生しました" })
    );
  });

  it("reservation.createでエラーが発生した場合、500エラーを返す", async () => {
    (prisma.reservation.create as jest.Mock).mockRejectedValue(
      new Error("DBエラー")
    );

    const requestBody = {
      name: "テストユーザー",
      phone: "09012345678",
      productName: "テスト商品",
      price: 1234,
      reservationDate: "2025-1-1",
      deliveryDate: "2025-1-10",
      type: "test_type",
    };

    const request = new Request("/api/reservation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const res = await POST(request);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual(
      expect.objectContaining({ error: "サーバーエラーが発生しました" })
    );
  });

  it("POST 以外のリクエストは405エラーを返す", async () => {
    const request = new Request("/api/reservation", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(request);
    const json = await res.json();
    expect(res.status).toBe(405);
    expect(json).toEqual(expect.objectContaining({error: "メソッドが許可されていません"}));
  });

  it("Content-Typeがapplication/json以外の場合には400エラーを返す", async () => {
    const request = new Request("/api/reservation", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain"
      },
      body: "テストname",
    });
    
    const res = await POST(request);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json).toEqual(expect.objectContaining({error: "JSON形式で送信してください"}))
  });
});
