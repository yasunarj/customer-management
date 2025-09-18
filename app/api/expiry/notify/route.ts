import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendMail } from "@/app/lp/lib/mailer";

const getTodayYmdInJst = () => {
  const now = new Date();
  const jst = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  const y = jst.getFullYear();
  const m = String(jst.getMonth() + 1).padStart(2, "0");
  const d = String(jst.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export const GET = async () => {
  try {
    const today = getTodayYmdInJst();
    const todayDate = new Date(`${today}T00:00:Z`);

    const items = await prisma.productExpiry.findMany({
      where: { expiryDate: { equals: todayDate } },
      orderBy: { expiryDate: "asc" },
    });

    if (!items.length) {
      return NextResponse.json({ ok: true, message: "no items today" });
    }

    const lines = items.map(
      (r) =>
        `G${r.gondolaNo} | ${r.category} | ${r.productName} | ${
          r.quantity
        }個 | 担当: ${r.manager ?? "-"}`
    );

    const textBody =
      `[本日が消費/賞味期限の商品] (${today})\n\n` +
      lines.join("\n") +
      `\n\n※アプリ：/expiry/productList をご覧ください`;

    const htmlBody = `
    <div style="font-family:system-ui,Arial,sans-serif;padding:16px;background:#f7f7f7">
      <div style="max-width:640px;margin:auto;background:#fff;border-radius:8px;padding:20px">
        <h2 style="margin:0 0 12px;">本日が期限の商品（${today}）</h2>
        <ul>
          ${items
            .map(
              (r) =>
                `<li>G${r.gondolaNo}／${r.category}／<strong>${
                  r.productName
                }</strong>／${r.quantity}個／担当: ${r.manager ?? "-"}</li>`
            )
            .join("")}
        </ul>
        <p style="margin-top:16px;">アプリ：/expiry/productList をご確認ください。</p>
      </div>
    </div>
  `;

    const to = process.env.TO_EMAIL ?? process.env.GMAIL_USER!;
    await sendMail({
      to,
      subject: `[鮮度管理] 本日が期限の商品 (${today})`,
      text: textBody,
      html: htmlBody,
    });
    return NextResponse.json({ ok: true, count: items.length });
  } catch (e) {
    console.error("notify error", e);
    return NextResponse.json({ error: "notify failed" }, { status: 500 });
  }
};
