import getReservationsByType, {
  getReservationByTypeWithId,
  getReservationByCustomerName,
} from "@/lib/getReservationsByType";
import prisma from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    reservation: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
    customer: {
      findMany: jest.fn(),
    },
  },
}));

describe("getReservationByType", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("正常に予約データを取得できる", async () => {
    (prisma.reservation.findMany as jest.Mock).mockResolvedValue([
      {
        id: 1,
        type: "test",
        deliveryDate: "2025-1-1",
        customer: { id: 1, name: "高橋" },
      },
      {
        id: 2,
        type: "test",
        deliveryDate: "2025-2-1",
        customer: { id: 2, name: "竹内" },
      },
    ]);

    const reservations = await getReservationsByType("test");
    expect(reservations).toHaveLength(2);
    expect(prisma.reservation.findMany).toHaveBeenCalledWith({
      where: { type: "test" },
      include: { customer: true },
      orderBy: { deliveryDate: "desc" },
      take: 100,
    });
  });

  it("予約データがない場合には空の配列を返す", async () => {
    (prisma.reservation.findMany as jest.Mock).mockResolvedValue([]);

    const reservations = await getReservationsByType("test");

    expect(reservations).toEqual([]);
  });

  it("データ取得時にエラーが発生した場合には'undefined'を返す", async () => {
    (prisma.reservation.findMany as jest.Mock).mockRejectedValue(
      new Error("テスト用DBエラー")
    );

    const reservations = await getReservationsByType("test");

    expect(reservations).toBeUndefined();
  });
});

describe("getReservationByTypeWithId", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("指定したtypeとidの予約情報を取得する", async () => {
    (prisma.reservation.findFirst as jest.Mock).mockResolvedValue({
      id: 1,
      productName: "テスト商品",
      price: 2000,
      reservationDate: new Date("2025-1-1"),
      deliveryDate: new Date("2025-1-5"),
      customer: { name: "テストユーザー", phone: "09012345678" },
    });

    const reservation = await getReservationByTypeWithId("test", 1);

    expect(reservation).toEqual({
      id: 1,
      productName: "テスト商品",
      price: 2000,
      reservationDate: new Date("2025-1-1"),
      deliveryDate: new Date("2025-1-5"),
      customer: { name: "テストユーザー", phone: "09012345678" },
    });

    expect(prisma.reservation.findFirst).toHaveBeenCalledWith({
      where: {
        type: "test",
        id: 1,
      },
      include: { customer: true },
    });
  });

  it("予約が見つからない場合にはnullを返す", async () => {
    (prisma.reservation.findFirst as jest.Mock).mockResolvedValue(null);

    const reservation = await getReservationByTypeWithId("test", 999);

    expect(reservation).toBeNull();
  });

  it("データ取得時にエラーが発生した時に'undefined'を返す", async () => {
    (prisma.reservation.findFirst as jest.Mock).mockRejectedValue(
      new Error("テスト用DBエラー")
    );
    const reservation = await getReservationByTypeWithId("test", 1);

    expect(reservation).toBeUndefined();
  });
});

describe("getReservationByCustomerName", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("指定したnameの予約情報を取得する", async () => {
    (prisma.customer.findMany as jest.Mock).mockResolvedValue([
      {
        id: 1,
        name: "テストユーザー",
        phone: "09012345678",
        reservations: [
          {
            productName: "テスト商品",
            price: 2000,
            reservationDate: new Date("2025-1-1"),
            deliveryDate: new Date("2025-1-5"),
          },
          {
            productName: "テスト商品2",
            price: 4000,
            reservationDate: new Date("2025-1-2"),
            deliveryDate: new Date("2025-1-6"),
          },
        ],
      },
    ]);

    const reservations = await getReservationByCustomerName("テストユーザー");
    expect(reservations).toHaveLength(2);
    if (!reservations) {
      return;
    }
    expect(reservations[0]).toEqual(
      expect.objectContaining({
        customerName: "テストユーザー",
        customerPhone: "09012345678",
        productName: "テスト商品",
        price: 2000,
      })
    );
    expect(reservations[1]).toEqual(
      expect.objectContaining({
        customerName: "テストユーザー",
        customerPhone: "09012345678",
        productName: "テスト商品2",
        price: 4000,
      })
    );
    expect(prisma.customer.findMany).toHaveBeenCalledWith({
      where: { name: "テストユーザー" },
      include: { reservations: { orderBy: {deliveryDate: "desc"} } }
    });
  });

  it("顧客データが見つからない場合に空の配列を返す", async () => {
    (prisma.customer.findMany as jest.Mock).mockResolvedValue([]);

    const reservations = await getReservationByCustomerName("高橋");

    expect(reservations).toEqual([]);
  });

  it("データ取得時にエラーが発生した場合にはundefinedを返す", async () => {
    (prisma.customer.findMany as jest.Mock).mockRejectedValue(new Error("DBエラー"));

    const reservations = await getReservationByCustomerName("高橋");

    expect(reservations).toBeUndefined();
  })
});
