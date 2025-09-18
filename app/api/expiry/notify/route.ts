import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendMail } from "@/app/lp/lib/mailer";

// JST の「今日」の yyyy-mm-dd を得る
function getTodayYmdInJst() {
  const now = new Date();
  // JST に変換した「ローカル表記」を Date にもう一度パースしないよう、
  // 直接 yyyy-mm-dd を組み立てます
  const jst = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  const y = jst.getFullYear();
  const m = String(jst.getMonth() + 1).padStart(2, "0");
  const d = String(jst.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export async function GET() {
  try {
    const today = getTodayYmdInJst(); // "YYYY-MM-DD"
    // Prisma の @db.Date は日付のみなので、UTC 00:00 を渡して equality 比較させる
    const todayDate = new Date(`${today}T00:00:00Z`);

    const items = await prisma.productExpiry.findMany({
      where: { expiryDate: { equals: todayDate } },
      orderBy: { expiryDate: "asc" },
    });

    // 対象なし → 何も送らず終了
    if (!items.length) {
      return NextResponse.json({ ok: true, message: "no items today" });
    }

    // 本文生成（テキスト/HTML）
    const lines = items.map(
      (r) =>
        `G${r.gondolaNo}｜${r.category}｜${r.productName}｜${
          r.quantity
        }個｜担当: ${r.manager ?? "-"}`
    );

    const textBody =
      `【本日が消費/賞味期限の商品】(${today})\n\n` +
      lines.join("\n") +
      `\n\n※アプリ：/expiry/productList をご確認ください`;

    const htmlBody = `
      <div style="font-family:system-ui,Arial,sans-serif;padding:16px;background:#f7f7f7">
        <div style="max-width:640px;margin:auto;background:#fff;border-radius:8px;padding:20px">
          <h2 style="margin:0 0 12px;">本日が期限の商品</h2>
          <p style="margin:0 0 12px">${today}</p>
          <ul>
            ${items
              .map(
                (r) =>
                  `<li>ゴンドラ: ${r.gondolaNo}/ 商品: <strong>${r.productName}</strong>/ 個数: ${r.quantity}個
                  </li>`
              )
              .join("")}
          </ul>
          <p style="margin-top:16px;">アプリの
            <a href="https://customer-management-delta.vercel.app/expiry/productList" target="_blank" rel="noopener noreferrer">商品リスト</a>
            をご確認ください。
          </p>
        </div>
      </div>
    `;

    const to = process.env.TO_EMAIL ?? process.env.GMAIL_USER!;
    await sendMail({
      to,
      subject: `【鮮度管理】本日が期限の商品（${today}）`,
      text: textBody,
      html: htmlBody,
    });

    return NextResponse.json({ ok: true, count: items.length });
  } catch (e) {
    console.error("notify error", e);
    return NextResponse.json({ error: "notify failed" }, { status: 500 });
  }
}
