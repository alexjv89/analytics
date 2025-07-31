"use server"
import { signIn } from "@/auth"

export async function loginWithGoogle() {
  return await signIn("google")
}