import { NextResponse } from "next/server";
import { getSessionUser } from "../../../../lib/auth";

export async function GET(request) {
  const user = getSessionUser(request);
  if (!user) {
    return NextResponse.json({ message: "Not signed in." }, { status: 401 });
  }
  return NextResponse.json({ user });
}
