"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SignedIn, RedirectToOrganizationProfile, SignIn, useOrganizationList, useUser, SignInButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { MouseEventHandler, useState } from "react";

function SignInPage() {
return (
  <>
  <div className="flex justify-center">
  <SignIn afterSignInUrl="/clerk/create-org"></SignIn>
  </div>
  </>
)
}

export default SignInPage;