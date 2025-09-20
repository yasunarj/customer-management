import prisma from "@/lib/prisma";

export const getExpiryProductList = async () => {
  try {
    const list = await prisma.productExpiry.findMany({
      orderBy: { expiryDate: "asc" },
      select: {
        id: true,
        gondolaNo: true,
        category: true,
        productName: true,
        expiryDate: true,
        quantity: true,
        manager: true,
      }
    });
    return list;
  } catch (e) {
    console.error("データ取得エラー", e);
    return [];
  }
};
