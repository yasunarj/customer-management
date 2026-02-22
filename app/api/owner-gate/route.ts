import { NextResponse } from "next/server";

const POST = async (req: Request) => {
  try {
    const body = await req.json().catch(() => null);
    const password = body?.password;
  
    if (!password) {
      return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
    }
  
    const expected = process.env.OWNER_TASK_PASSWORD;
  
    if (!expected) {
      return NextResponse.json({ ok: false, error: "server_not_configured" }, { status: 500 });
    }
  
    if (password !== expected) {
      return NextResponse.json({ ok: false }, { status:  401});
    }
  
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch {
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}

export { POST };