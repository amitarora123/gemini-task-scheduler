"use server";

import { cookies } from "next/headers";
import { auth } from "../firebase/admin";
import { db } from "@/db/drizzle";
import { User } from "@/db/schema";
import { eq } from "drizzle-orm";
import { signOut } from "firebase/auth";
import { auth as clientAuth } from "../firebase/client";

const ONE_WEEK = 60 * 60 * 24 * 7;
export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK * 1000,
  });

  cookieStore.set("session", sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: ONE_WEEK,
    path: "/",
  });
  return sessionCookie;
}

export async function signUp(params: SignUpParams) {
  try {
    const { id, email } = params;

    const existingUserById = await db
      .select()
      .from(User)
      .where(eq(User.id, id));

    const existingUserByEmail = await db
      .select()
      .from(User)
      .where(eq(User.email, email));

    if (existingUserById[0] || existingUserByEmail[0]) {
      return {
        success: false,
        message: "Email already exists",
      };
    }

    await db.insert(User).values({
      id,
      email,
    });

    return {
      success: true,
      message: "Registration Successful",
    };
  } catch (error) {
    console.log("Error registering user: ", error);

    return {
      success: false,
      message: "ERROR REGISTERING USER",
    };
  }
}
export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);

    if (!userRecord) {
      return {
        success: false,
        message: "User does not exist. Create an account instead",
      };
    }

    await setSessionCookie(idToken);

    return {
      success: true,
      message: "Login Successful",
    };
  } catch (error) {
    console.log("Error while login ", error);
    return {
      success: false,
      message: "Error while login",
    };
  }
}
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const userRecord = await db
      .select()
      .from(User)
      .where(eq(User.id, decodedClaims.uid));

    if (!userRecord[0]) return null;

    return userRecord[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user;
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  try {
    signOut(clientAuth);
    return {
      success: true,
      message: "Logout successful",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Unable to perform logout",
    };
  }
}
export async function googleLogin({
  params,
  idToken,
}: {
  params: SignUpParams;
  idToken: string;
}) {
  const { email, id } = params;

  const existedUser = await db.select().from(User).where(eq(User.id, id));
  if (!existedUser[0]) {
    await db.insert(User).values({
      email,
      id,
    });
  }

  const response = signIn({ email, idToken });

  return response;
}
