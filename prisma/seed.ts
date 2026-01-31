import prisma from "@/lib/prisma";

const main = async () => {
  const tasks = [
    { title: "発注", sortOrder: 1 },
    { title: "日報", sortOrder: 2 },
    { title: "在庫変更報告", sortOrder: 3 },
    { title: "承認業務", sortOrder: 4 },
  ]

  for (const t of tasks) {
    await prisma.dailyTask.upsert({
      where: { title: t.title },
      update: { sortOrder: t.sortOrder },
      create: {
        title: t.title,
        sortOrder: t.sortOrder,
        isActive: true,
      }
    })
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())