import prisma from "@/lib/prisma";

const getSafeCheckHistory = async () => {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const safeCheckData = await prisma.safeCheck.findMany({
      where: {
        date: {
          gte: oneMonthAgo,
        },
      },
      orderBy: {
        date: "desc",
      }
    });
    return safeCheckData;
  } catch(e) {
    console.error("データ取得エラー", e);
    return [];
  }
}

export { getSafeCheckHistory };