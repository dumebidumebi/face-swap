"use client"

import { SignIn } from "@clerk/nextjs";

function SignInPage() {
return (
  <>
  <div className="flex justify-center">
  <SignIn routing="hash" afterSignInUrl="/create/face-swap"></SignIn>
  </div>
  </>
)
}

export default SignInPage;