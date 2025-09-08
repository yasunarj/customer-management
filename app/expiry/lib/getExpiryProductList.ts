import prisma from "@/lib/prisma";

export const getExpiryProductList = async () => {
  try {
    const list = await prisma.productExpiry.findMany({
      orderBy: { expiryDate: "asc" },
    });
    return list;
  } catch (e) {
    console.error("データ取得エラー", e);
    return [];
  }
};
