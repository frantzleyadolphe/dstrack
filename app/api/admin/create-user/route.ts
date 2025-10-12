import { NextResponse } from "next/server";
import { createUser } from "@/server/adminAdapter";

export async function POST(req: Request) {
  try {
    const { adminId, machineId, name, email, password } = await req.json();

    if (!adminId || !machineId || !name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await createUser(adminId, machineId, name, email, password);
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
