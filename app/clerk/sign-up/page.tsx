"use client"

import { SignUp, useUser } from "@clerk/nextjs";

export default function SignUpPage() {
  const { user } = useUser();

  return (
    // IF ORGANIZATION HAS BEEN MADE PREVENT FORM FROM BEING SUBMITTED
   <>
   <div className="flex justify-center">
    <SignUp routing="hash"  afterSignUpUrl="/create/face-swap" afterSignInUrl="/create/face-swap"></SignUp>
    </div>
      </>
  );

}