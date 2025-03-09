import { DELETE, PUT } from "@/app/api/reservation/[id]/route";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

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
    reservation: {
      findUnique: jest.fn(),
      delete: jest.fn(() => ({ where: { id: 1 } })),
      update: jest.fn(),
    },
    customer: {
      delete: jest.fn(() => ({ where: { id: 1 } })),
      update: jest.fn(),
    },
    $transaction: jest.fn(
      async (queries: Array<() => Promise<unknown> | Promise<unknown>>) => {
        return Promise.all(
          queries.map((query) =>
            typeof query === "function" ? query() : query
          )
        );
      }
    ),
  },
}));

describe("DELETE /api/reservation/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("正常に予約が削除される", async () => {
    (prisma.reservation.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      customerId: 1,
    });

    const createMockNextRequest = (url: string, init?: RequestInit) => {
      const req = new Request(url, init);

      return Object.assign(req, {
        nextUrl: new URL(url, "http://localhost"),
      }) as NextRequest;
    };

    const request = createMockNextRequest("/api/reservation/1", {
      method: "DELETE",
    });

    const res = await DELETE(request, { params: Promise.resolve({ id: "1" }) });
    const json = await res.json();

    expect(prisma.$transaction).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ where: { id: 1 } }),
        expect.objectContaining({ where: { id: 1 } }),
      ])
    );

    expect(res.status).toBe(200);
    expect(json).toEqual(
      expect.objectContaining({ message: "削除が成功しました" })
    );
  });

  it("無効なIDを入力すると、404エラーを返す", async () => {
    (prisma.reservation.findUnique as jest.Mock).mockResolvedValue(null);

    const createMockRequest = (url: string, init?: RequestInit) => {
      const req = new Request(url, init);

      return Object.assign(req, {
        nextUrl: new URL(url, "http://localhost"),
      }) as NextRequest;
    };

    const request = createMockRequest("/api/reservation/999", {
      method: "DELETE",
    });

    const res = await DELETE(request, {
      params: Promise.resolve({ id: "999" }),
    });

    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json).toEqual(
      expect.objectContaining({ error: "該当する予約情報が見つかりません" })
    );
  });

  it("IDが数字でない場合には400エラーを返す", async () => {
    const createMockNextRequest = (url: string, init?: RequestInit) => {
      const req = new Request(url, init);

      return Object.assign(req, {
        nextUrl: new URL(url, "http://localhost"),
      }) as NextRequest;
    };

    const request = createMockNextRequest("/api/reservation/invalid-id", {
      method: "DELETE",
    });

    const res = await DELETE(request, {
      params: Promise.resolve({ id: "invalid-id" }),
    });
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json).toEqual(expect.objectContaining({ error: "無効なIDです" }));
  });

  it("データベース接続時にエラーが発生した場合に500を返す", async () => {
    (prisma.reservation.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      customerId: 1,
    });

    (prisma.$transaction as jest.Mock).mockRejectedValue(new Error("DBエラー"));

    const createMockNextRequest = (url: string, init?: RequestInit) => {
      const req = new Request(url, init);

      return Object.assign(req, {
        nextUrl: new URL(url, "http://localhost"),
      }) as NextRequest;
    };

    const request = createMockNextRequest("/api/reservation/1", {
      method: "DELETE",
    });
    const res = await DELETE(request, { params: Promise.resolve({ id: "1" }) });
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual(
      expect.objectContaining({ error: "削除できませんでした" })
    );
  });
});

describe("PUT /api/reservation/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("正常にデータが更新される", async () => {
    (prisma.reservation.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      customer: { id: 1 },
    });

    (prisma.customer.update as jest.Mock).mockResolvedValue({
      name: "更新された名前",
      phone: "09012345678",
    });

    (prisma.reservation.update as jest.Mock).mockResolvedValue({
      productName: "更新された商品",
      price: 10000,
      reservationDate: new Date("2025-3-3"),
      deliveryDate: new Date("2025-3-10"),
    });
    const requestBody = {
      name: "更新された名前",
      phone: "09012345678",
      productName: "更新された商品",
      price: 10000,
      reservationDate: "2025-3-3",
      deliveryDate: "2025-3-10",
    };

    const createMockNextRequest = (url: string, init?: RequestInit) => {
      const req = new Request(url, init);

      return Object.assign(req, {
        nextUrl: new URL(url, "http://localhost"),
      }) as NextRequest;
    };

    const request = createMockNextRequest("/api/reservation/1", {
      method: "PUT",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await PUT(request, { params: Promise.resolve({ id: "1" }) });
    const json = await res.json();

    expect(res.status).toBe(200);

    expect(prisma.reservation.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 1 } })
    );

    expect(prisma.customer.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 1 } })
    );

    expect(json).toEqual(
      expect.objectContaining({ message: "データの保存に成功しました" })
    );
  });

  it("存在しないIDが送られた場合には400エラーを返す", async () => {
    (prisma.reservation.findUnique as jest.Mock).mockResolvedValue(null);

    const createMockNextRequest = (url: string, init?: RequestInit) => {
      const req = new Request(url, init);

      return Object.assign(req, {
        nextUrl: new URL(url, "http://localhots"),
      }) as NextRequest;
    };

    const requestBody = {
      name: "更新ネーム",
      phone: "09011111111",
      productName: "更新商品",
      price: 1000,
      reservationDate: "2022-1-1",
      deliveryDate: "2022-1-11",
    };

    const request = createMockNextRequest("/api/reservation/999", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const res = await PUT(request, { params: Promise.resolve({ id: "999" }) });
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json).toEqual(
      expect.objectContaining({ error: "データが見つかりません" })
    );
  });

  it("priceが数字ではない場合に400エラーを返す", async () => {
    (prisma.reservation.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      customer: { id: 1 },
    });

    const createMockNextRequest = (url: string, init?: RequestInit) => {
      const req = new Request(url, init);

      return Object.assign(req, {
        nextUrl: new URL(url, "http://localhost"),
      }) as NextRequest;
    };

    const requestBody = {
      name: "更新ネーム",
      phone: "09011111111",
      productName: "更新商品",
      price: "二千円",
      reservationDate: "2022-1-1",
      deliveryDate: "2022-1-2",
    };

    const request = createMockNextRequest("/api/reservation/1", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const res = await PUT(request, { params: Promise.resolve({ id: "1" }) });
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json).toEqual(
      expect.objectContaining({ error: "無効な価格です" })
    );
  });
});
