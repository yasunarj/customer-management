import prisma from "@/lib/prisma"

const getSafeCheckDetailData = async (id: number) => {
  try {
    const safeCheckDetailData = await prisma.safeCheck.findFirst({
      where: {
        id
      }
    });
    return safeCheckDetailData;
  } catch (e) {
    console.error("データ取得エラー", e);
    return null;
  }
}

export { getSafeCheckDetailData };