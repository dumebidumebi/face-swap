"use client"

import { SignIn } from "@clerk/nextjs";

function SignInPage() {
return (
  <>
  <div className="flex justify-center">
  <SignIn afterSignInUrl="/create/face-swap"></SignIn>
  </div>
  </>
)
}

export default SignInPage;