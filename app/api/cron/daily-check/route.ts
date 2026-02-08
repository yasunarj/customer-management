import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jstDateKey } from "@/app/daily-check/lib/dateKey";
import { sendMail } from "@/app/lp/lib/mailer";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  // ✅ Vercel Cron からの呼び出しをシークレットで保護
  const auth = req.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const date = jstDateKey(); //jstDateKey()は今日の日付を取得する関数

  // 現状では曜日関係なく全てのタスクを取得してしまうため、その日のタスクが終わったとしてもメールが来てしまう状態。jstWeekdayKeyを使用して曜日を取得。
  // where: {isActive: true と [jstWeekdayKey()]: true}として取得するタスクを絞る。
  // この修正と同時に30日以上経過したレコードを自動で削除する処理も一緒に実装するとよさそう。
  const tasks = await prisma.dailyTask.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: { id: true, title: true },
  });

  const checks = await prisma.dailyTaskCheck.findMany({
    where: { date },
    select: { taskId: true },
  });

  const checkedSet = new Set(checks.map((c) => c.taskId)); // checkedSetをconsole.logで確認する。
  const missing = tasks.filter((t) => !checkedSet.has(t.id)); //tasksは今日のtask、曜日ごとにタスク数が変わる

  // 未チェックがなければメール送らず終了
  if (missing.length === 0) {
    return NextResponse.json({ ok: true, date, missing: 0 });
  }

  const lines = missing.map((t, i) => `${i + 1}. ${t.title}`).join("\n");

  await sendMail({
    to: process.env.GMAIL_USER!,
    subject: `【未完了】本日のチェック漏れ (${date})`,
    text: `以下が未チェックです。\n\n${lines}\n\n（自動通知）`,
  });

  return NextResponse.json({ ok: true, date, missing: missing.length });
}
