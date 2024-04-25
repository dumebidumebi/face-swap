"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SignUp, useOrganizationList, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { MouseEventHandler, useState } from "react";
 
export default function SignUpPage() {
 
  const { createOrganization } = useOrganizationList();
  const [organizationName, setOrganizationName] = useState<string>("");
  const {  user } = useUser()
  const router = useRouter()
  
  return (
    // IF ORGANIZATION HAS BEEN MADE PREVENT FORM FROM BEING SUBMITTED
   <>
   <div className="flex justify-center">
    <SignUp afterSignUpUrl="/clerk/create-org" afterSignInUrl="/clerk/create-org"></SignUp>
    </div>
      </>
  );

}