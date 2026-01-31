import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

const daysAgoKey = (daysAgo: number) => {
  const now = new Date();
  const jst = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  jst.setDate(jst.getDate() - daysAgo);
  const y = jst.getFullYear();
  const m = String(jst.getMonth() + 1).padStart(2, "0");
  const d = String(jst.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const DailyCheckHistoryPage = async () => {
  const tasksCount = await prisma.dailyTask.count({
    where: { isActive: true },
  });

  const dates = Array.from({ length: 30 }, (_, i) => daysAgoKey(i));
  const checks = await prisma.dailyTaskCheck.findMany({
    where: { date: { in: dates } },
    select: { date: true },
  });

  const map = new Map<string, number>();
  for (const c of checks) {
    map.set(c.date, (map.get(c.date) ?? 0) + 1);
  }

  return (
    <main className="h-screen-vh bg-black text-white flex justify-center items-center">
      <div className="relative max-w-2xl w-[90%] h-[95%] px-4 py-6 bg-gray-900 overflow-y-scroll">
        <h1 className="text-2xl font-bold">チェック履歴(直近30日)</h1>

        <p className="mt-2 text-sm text-gray-600">
          完了 = {tasksCount}/{tasksCount}
        </p>
        <div className="absolute top-0 right-4 mt-8 text-sm">
          <Link href="/daily-check" className="text-blue-600 hover:underline">
            {`<< 戻る`}
          </Link>
        </div>

        <ul className="mt-6 space-y-3">
          {dates.map((date) => {
            const done = map.get(date) ?? 0;
            const ok = tasksCount > 0 && done >= tasksCount;
            return (
              <li
                key={date}
                className="flex items-center justify-between rounded-xl border p-3"
              >
                <span className="font-medium">{date}</span>
                <span
                  className={
                    ok ? "text-green-600 font-semibold" : "text-yellow-700"
                  }
                >
                  {done}/{tasksCount} {ok ? "完了" : "未完了"}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
};

export default DailyCheckHistoryPage;
