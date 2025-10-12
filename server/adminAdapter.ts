import { db } from "../app/db/drizzle";
import { user } from "@/app/db/schema";
import { hashPassword } from "./hashPassword";
import { eq } from "drizzle-orm";

export async function createUser(
  adminId: string,
  machineId: number,
  name: string,
  email: string,
  password: string
) {
  const hashed = await hashPassword(password);
  try {
    await db.insert(user).values({
      id: crypto.randomUUID(),
      name,
      email,
      password: hashed,
      machineId,
      adminId,
      createdAt: new Date(),
    });
    return {
      success: true,
      message: "User created successfully",
    };
  } catch (error) {
    if (error) {
      return { success: false, message: "Email already in use" };
    }
  }

  return { success: false, message: "User creation failed" };
}

export async function resetUserPassword(userId: string, newPassword: string) {
  const hashed = await hashPassword(newPassword);
  try {
    const updated = await db
      .update(user)
      .set({ password: hashed })
      .where(eq(user.id, userId));
    if (updated.rowCount === 1) {
      return { success: true, message: "User password updated successfully" };
    }
  } catch (error) {
    if (error) {
      return { success: false, message: "User not found" };
    }
  }
}
