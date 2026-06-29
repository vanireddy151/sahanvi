import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import User from "../../../../models/User";
import { verifyPassword } from "../../../../lib/password";
import { signToken } from "../../../../lib/token";
import { SESSION_COOKIE } from "../../../../lib/auth";

export async function POST(request) {
  await connectDB();
  const body = await request.json();
  const user = await User.findOne({ email: String(body.email || "").toLowerCase() });
  if (!user || !verifyPassword(body.password || "", user)) {
    return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
  }

  const token = signToken({ id: user._id, role: user.role });
  const response = NextResponse.json({
    user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
    token
  });

  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  return response;
}
