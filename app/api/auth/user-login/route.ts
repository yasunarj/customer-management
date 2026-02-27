import { NextResponse } from "next/server";
import { rateLimitLogin } from "@/lib/rateLimitLogin";
import { getClientIp } from "@/lib/getClientIp";

const POST = async (req: Request) => {
  const body = await req.json();
  const ip = getClientIp(req);

  const result = await rateLimitLogin({
    email: body.email,
    password: body.password,
    ip,
    prefix: "reserve-user"
  });

  return NextResponse.json(result, { status: result.status });
};

export { POST };
