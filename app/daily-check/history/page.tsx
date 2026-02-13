import prisma from "@/lib/prisma";
import Link from "next/link";
import { jstDateKey } from "../lib/dateKey";

export const dynamic = "force-dynamic";

const WEEK_KEYS = [
  "onSun",
  "onMon",
  "onTue",
  "onWed",
  "onThu",
  "onFri",
  "onSat",
] as const;
type WeekKey = (typeof WEEK_KEYS)[number];

// const weekdayKeyFromYmd = (ymd: string) => {
//   const d = new Date(`${ymd}T00:00:00+09:00`);
//   const w = d.getDay();
//   return WEEK_KEYS[w] ?? "onSun";
// };
const weekdayKeyFromYmd = (ymd: string): WeekKey => {
  const [Y, M, D] = ymd.split("-").map(Number);
  // Tomohiko Sakamoto algorithm
  const t = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
  let y = Y;
  const m = M;
  const d = D;
  if (m < 3) y -= 1;
  const w = (y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) + t[m - 1] + d) % 7;
  return WEEK_KEYS[w];
};

const DailyCheckHistoryPage = async () => {
  const dates = Array.from({ length: 30 }, (_, i) => jstDateKey(i));

  const checks = await prisma.dailyTaskCheck.findMany({
    where: { date: { in: dates } },
    select: { date: true },
  });

  const doneMap = new Map<string, number>();
  for (const c of checks) {
    doneMap.set(c.date, (doneMap.get(c.date) ?? 0) + 1);
  }

  const tasks = await prisma.dailyTask.findMany({
    where: { isActive: true },
    select: {
      onMon: true,
      onTue: true,
      onWed: true,
      onThu: true,
      onFri: true,
      onSat: true,
      onSun: true,
    },
  });

  const expectedMap = new Map<string, number>();
  for (const date of dates) {
    const wk = weekdayKeyFromYmd(date) as WeekKey;
    const expected = tasks.filter((t) => t[wk]).length;
    expectedMap.set(date, expected);
  }

  return (
    <main className="h-screen-vh bg-black text-white flex justify-center items-center">
      <div className="relative max-w-2xl w-[90%] h-[95%] px-4 py-6 bg-gray-900 overflow-y-scroll">
        <h1 className="text-2xl font-bold">チェック履歴(直近30日)</h1>
        <div className="absolute top-0 right-4 mt-8 text-sm">
          <Link href="/daily-check" className="text-blue-600 hover:underline">
            {`<< 戻る`}
          </Link>
        </div>

        <ul className="mt-6 space-y-3">
          {dates.map((date) => {
            const done = doneMap.get(date) ?? 0;
            const expected = expectedMap.get(date) ?? 0;
            const ok = expected > 0 && done >= expected;
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
                  {done}/{expected} {ok ? "完了" : "未完了"}
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
