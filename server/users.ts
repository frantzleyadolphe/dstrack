"use server";
import { auth } from "../lib/auth";
import { hashPassword } from "./hashPassword";

export const signIn = async (email: string, password: string) => {
  const passwordHashed = await hashPassword(password);
  try {
    await auth.api.signInEmail({
      body: {
        email,
        password: passwordHashed,
      },
    });

    return { success: true, message: "User signed in successfully" };
  } catch (error) {
    if (error) {
      return { success: false, message: "Invalid email or password" };
    }
  }
};
