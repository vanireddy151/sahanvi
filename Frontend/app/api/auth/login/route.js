import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import User from "../../../../models/User";
import { verifyPassword } from "../../../../lib/password";
import { signToken } from "../../../../lib/token";

export async function POST(request) {
  await connectDB();
  const body = await request.json();
  const user = await User.findOne({ email: String(body.email || "").toLowerCase() });
  if (!user || !verifyPassword(body.password || "", user)) {
    return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
  }
  return NextResponse.json({
    user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
    token: signToken({ id: user._id, role: user.role })
  });
}
