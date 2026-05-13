import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import supabaseAdmin from "@/lib/supabaseAdmin";
import { jstDateKey, jstWeekdayKey } from "@/app/daily-check/lib/dateKey";
import { sendMail } from "@/app/lp/lib/mailer";

export const dynamic = "force-dynamic";

type TaskRow = {
  id: string;
  title: string;
  ownerId: string;
};

const GET = async (req: Request) => {
  const auth = req.headers.get("authorization");

  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 }
    );
  }

  const date = jstDateKey();
  const wk = jstWeekdayKey();

  const tasks = await prisma.dailyTask.findMany({
    where: {
      isActive: true,
      [wk]: true,
    },
    orderBy: [{ ownerId: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      title: true,
      ownerId: true,
    }
  });

  if (tasks.length === 0) {
    return NextResponse.json({
      ok: true,
      date,
      weekday: wk,
      mailedUsers: 0,
      message: "no tasks today",
    });
  }

  const checks = await prisma.dailyTaskCheck.findMany({
    where: {
      date,
    },
    select: {
      taskId: true,
      ownerId: true,
    }
  });

  const tasksByOwner = new Map<string, TaskRow[]>();  //例　map.set("userA", ["発注", "日報"])
  for (const task of tasks) {
    const list = tasksByOwner.get(task.ownerId) ?? [];
    list.push(task);
    tasksByOwner.set(task.ownerId, list);
  }
  //最終的なtaskByOwnerの値（例）
  // tasksByOwner = {
  //   "userA" => [
  //     { id: "t1", title: "発注", ownerId: "userA" },
  //     { id: "t2", title: "日報", ownerId: "userA" }
  //   ],
  //   "userB" => [
  //     { id: "t3", title: "清掃", ownerId: "userB" }
  //   ]
  // }

  const checkedTaskIdsByOwner = new Map<string, Set<string>>();
  for (const check of checks) {
    const set = checkedTaskIdsByOwner.get(check.ownerId) ?? new Set<string>();
    set.add(check.taskId);
    checkedTaskIdsByOwner.set(check.ownerId, set);
  }
  // Setは重複した値を入れない箱
  //最終的なcheckedTaskIdsByOwnerの値（例）
  // checkedTaskIdsByOwner = {
  //   "userA" => Set { "t1" },
  //   "userB" => Set { "t3" },
  // }

  const mailResults: Array<{
    ownerId: string;
    email: string | null;
    missingCount: number;
    mailed: boolean;
    reason?: string;
  }> = [];

  for (const [ownerId, ownerTasks] of tasksByOwner.entries()) {
    const checkedSet = checkedTaskIdsByOwner.get(ownerId) ?? new Set<string>();

    const missing = ownerTasks.filter((task) => !checkedSet.has(task.id));

    if (missing.length === 0) {
      mailResults.push({
        ownerId,
        email: null,
        missingCount: 0,
        mailed: false,
        reason: "no missing tasks",
      });
      continue;
    }

    const { data, error } = await supabaseAdmin.auth.admin.getUserById(ownerId);

    if (error || !data?.user?.email) {
      mailResults.push({
        ownerId,
        email: null,
        missingCount: missing.length,
        mailed: false,
        reason: "email not found",
      });
      continue;
    }

    const email = data.user.email;
    const lines = missing.map((t, i) => `${i + 1}. ${t.title}`).join("\n");

    await sendMail({
      to: email,
      subject: `【未完了】本日のチェック漏れ (${date})`,
      text: `以下が未チェックです。\n\n${lines}\n\n (自動通知)`,
    });

    mailResults.push({
      ownerId,
      email,
      missingCount: missing.length,
      mailed: true,
    });
  }

  const mailedUsers = mailResults.filter((r) => r.mailed).length;

  return NextResponse.json({
    ok: true,
    date,
    weekday: wk,
    mailedUsers,
    results: mailResults,
  })
};

export { GET };
