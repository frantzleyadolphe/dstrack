import { auth } from "@/lib/auth";

export const signIn = async (email: string, password: string) => {
  try {
    await auth.signInEmail({
      email,
      password,
    });

    return { success: true, message: "User signed in successfully" };
  } catch (error) {
    console.log({ error });
  }
};
