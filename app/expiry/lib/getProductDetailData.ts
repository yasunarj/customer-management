import prisma from "@/lib/prisma";

export const getProductDetailData = async (id: number) => {
  try {
    const productDetailData = await prisma.productExpiry.findFirst({
      where: {
        id,
      },
    });
    return productDetailData;
  } catch (e) {
    console.error("データ取得エラー", e);
    return null;
  }
};
