"use server";
import { user } from "@/app/db/schema";
import { auth } from "../lib/auth";
import { hashPassword } from "./hashPassword";

type SignUpData = {
  name: string;
  email: string;
  password: string;
  role?: "admin" | "user";
};

export const signIn = async (email: string, password: string) => {
  const passwordHashed = await hashPassword(password);
  try {
    await auth.api.signInEmail({
      body: {
        email,
        password: passwordHashed,
      },
    });

    return {
      success: true,
      message: "User signed in successfully",
      user: {
        name: user?.name,
      },
    };
  } catch (error) {
    if (error) {
      return { success: false, message: "Invalid email or password" };
    }
  }
};

export const signUp = async (name: string, email: string, password: string) => {
  try {
    // We use the parameters to build the request body.
    const response = await auth.api.signUpEmail({
      body: {
        name: name,
        email: email,
        password: password,
        // If machineId is required, you would also pass it as a parameter to the function
        // machineId: machineId
      },
    });

    // It's good practice to return the result on success.
    console.log("Sign-up successful:", response);
    return { success: true, data: response };
  } catch (error) {
    // This 'catch' block will handle any errors from the API call.
    // For example, if the email is already taken or there's a network issue.
    console.error("Sign-up failed:", error);
    return { success: false, error: error };
  }
};
