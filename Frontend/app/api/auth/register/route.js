import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import User from "../../../../models/User";
import { hashPassword } from "../../../../lib/password";
import { signToken } from "../../../../lib/token";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const passwordFields = hashPassword(body.password);
    const user = await User.create({
      name: body.name,
      email: body.email,
      phone: body.phone,
      ...passwordFields
    });
    return NextResponse.json({
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
      token: signToken({ id: user._id, role: user.role })
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.code === 11000 ? "This email is already registered." : error.message }, { status: 400 });
  }
}
