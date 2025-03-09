import { POST } from "@/app/api/reservation/search/route";
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
    reservation: {
      findMany: jest.fn(),
    },
  },
}));

describe("POST /api/reservation/search", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (prisma.reservation.findMany as jest.Mock).mockResolvedValue([
      {
        id: 1,
        productName: "テスト商品",
        price: 2000,
        reservationDate: new Date("2025-1-1"),
        deliveryDate: new Date("2025-1-10"),
        type: "test_type",
        customer: {
          id: 1,
          name: "テストユーザー",
          phone: "09012345678",
        },
      },
    ]);
  });

  it("正常に検索結果を取得できる", async () => {
    const requestBody = {
      name: "テストユーザー",
      year: "2025",
      type: "test_type",
    };

    const request = new Request("/api/reservation/search", {
      method: "POST",
      body: JSON.stringify(requestBody),
    });
    const res = await POST(request);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual(
      expect.objectContaining({
        data: expect.arrayContaining([
          expect.objectContaining({
            productName: "テスト商品",
            type: "test_type",
            customer: expect.objectContaining({ name: "テストユーザー" }),
          }),
        ]),
      })
    );
  });

  it("必須項目 typeが不足している場合400エラーを返す", async () => {
    const requestBody = {
      name: "テストユーザー",
      year: "2025",
    };

    const request = new Request("/api/reservation/search", {
      method: "POST",
      body: JSON.stringify(requestBody),
    });

    const res = await POST(request);
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json).toEqual(
      expect.objectContaining({ error: "タイプと名前を入力してください" })
    );
  });

  it("nameもyearも空の場合には400エラーを返す", async () => {
    const requestBody = {
      name: "",
      year: "",
      type: "test_type",
    };

    const request = new Request("/api/reservation/search", {
      method: "POST",
      body: JSON.stringify(requestBody),
    });

    const res = await POST(request);
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json).toEqual(
      expect.objectContaining({ error: "西暦または名前を入力してください" })
    );
  });

  it("検索結果が空でもstatusは200を返す", async () => {
    (prisma.reservation.findMany as jest.Mock).mockResolvedValue([]);

    const requestBody = {
      name: "存在しない名前",
      year: "2025",
      type: "test_type",
    };

    const request = new Request("/api/reservation/search", {
      method: "POST",
      body: JSON.stringify(requestBody),
    });

    const res = await POST(request);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json).toEqual(expect.objectContaining({ data: [] }));
  });

  it("POST以外のメソッドは405エラーを返す", async () => {
    const request = new Request("/api/reservation/search", {
      method: "GET",
    });

    const res = await POST(request);
    const json = await res.json();
    expect(res.status).toBe(405);
    expect(json).toEqual(
      expect.objectContaining({ error: "メソッドが許可されていません" })
    );
  });

  it("データベースのエラー時には500エラーを返す", async () => {
    (prisma.reservation.findMany as jest.Mock).mockRejectedValue(
      new Error("DBエラー")
    );

    const requestBody = {
      name: "エラーネーム",
      year: "2025",
      type: "test_type",
    };

    const request = new Request("/api/reservation/search", {
      method: "POST",
      body: JSON.stringify(requestBody),
    });

    const res = await POST(request);
    const json = await res.json();
    expect(res.status).toBe(500);
    expect(json).toEqual(
      expect.objectContaining({ error: "検索に失敗しました" })
    );
  });
});
